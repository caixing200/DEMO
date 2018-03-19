//派工单审核模块，派工单中报工单详细信息
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plan: null,
    //微信用户信息
    wxUserInfo: null,
    //app用存储的员工信息
    appuserinfo: null,
    //存子派工单信息
    todo: [],
    //存报工单信息
    review: [],
    //上个页面传值过来知道，从而知道是查看审核中-0还是已审核-1
    state: '',
    inputViewHide: true,
    code: '',
  },


  //显示员工信息
  onLoad: function (options) {
    var that = this;
    console.log(app.Session.get());
    app.getUserInfo(function (wxUserInfo) {
      var session = app.Session.get();
      session.wxUserInfo = wxUserInfo;
      app.Session.set(session);
      //更新数据
      that.setData({
        wxUserInfo: wxUserInfo,
        appuserinfo: app.Session.get().user
      })
    })
    if (options.code) {
      that.setData({
        code: options.code,
        state: options.state,
      }, () => {
        that._getTodo(that.data.code, that.data.state);
        that._getReview(that.data.code, that.data.state);
      })
    } else {
      wx.showModal({
        showCancel: false,
        content: '页面加载错误，请返回',
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  },

  //根据子派工单号，得到派工单相关报工信息
  _getReview: function (code, state) {
    var that = this;
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    app.admx.request({
      url: app.config.service.ReviewDetail,
      data: {
        subtodo_code: code
      },
      succ: function (res) {
        console.log(res);
        const data = that.filtreList(res,state);
        if (res.length > 0) {
          that.setData({
            review: data,          //所有报工单信息
          })
        } else {
          wx.showModal({
            content: '没有需要审核的派工单',
            showCancel: false
          })
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },
  //根据进入状态过滤报工信息
  filtreList: function (data, state) {
    const that = this;
    const tempArr = [];
    for (let i = 0; i < data.length; i++) {
      if(data[i].state == state){
        tempArr.push(data[i]);
        console.log(tempArr);
      }
    }
    return tempArr
  },
  //获取子派工单信息
  _getTodo: function (code) {
    var that = this;
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    app.admx.request({
      url: app.config.service.getToDoByqrcode,
      data: {
        qrcode: code
      },
      succ: function (res) {
        console.log(res);
        if (Array.isArray(res) && res.length > 0) {
          that.setData({
            todo: res[0], //子派工单信息
          })
        } else {
          wx.showModal({
            content: '派工单不存在或已失效',
            showCancel: false
          })
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },

  //关闭弹出框
  closeInputView: function (e) {
    const that = this;
    that.setData({
      inputViewHide: true
    })
  },
  //点击修正按钮
  modify: function (e) {
    var that = this;
    console.log(e);
    that.setData({
      inputViewHide: false,
      claim_id: e.target.dataset.claim_id,
    })
    // wx.redirectTo({
    //   url: './disqreaon?claim_ok=' + e.target.dataset.claim_ok + '&claim_ng=' + e.target.dataset.claim_ng + '&claim_id=' + e.target.dataset.claim_id
    // });
  },
  //点击弹出框确定按钮
  formSubmit: function (e) {
    const that = this;
    console.log(e);
    //输入验证
    if (e.detail.value.exam_ok == '') {
      wx.showModal({
        content: "请输入审核合格数",
        showCancel: false
      });
      return
    }
    if (e.detail.value.exam_ng == '') {
      wx.showModal({
        content: "请输入审核不合格数",
        showCancel: false
      });
      return
    }
    if (isNaN(e.detail.value.exam_ok)) {
      wx.showModal({
        content: "合格数只能输入数字",
        showCancel: false
      });
      return
    }
    if (isNaN(e.detail.value.exam_ng)) {
      wx.showModal({
        content: "不合格数只能输入数字",
        showCancel: false
      });
      return
    }
    that.setData({
      inputViewHide: true
    })
    wx.showLoading({ //弹出消息框-操作中
      title: '操作中...',
      mask: true
    })

    app.admx.request({  //发起请求
      url: app.config.service.postAuditClaim, //把请求传到后端，地址
      data: {
        claim_id: that.data.claim_id,//报工单id
        exam_ok: e.detail.value.exam_ok,  //审核合格数
        exam_ng: e.detail.value.exam_ng   //审核不合格数
      },
      succ: function (res) {
        console.log(res);
        if (!res) {
          wx.showModal({ //弹出消息提示框
            content: '提交成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that._getTodo(that.data.code, that.data.state);
                that._getReview(that.data.code, that.data.state);
              }
            }
          })
        } else {
          wx.showModal({
            content: '提交失败，请重试',
            showCancel: false,
          })
        }

      }
    })
  },
  //点击确认按钮
  confirm: function (e) {
    const that = this;
    wx.showLoading({
      title: '审核中',
      mask: true
    })
    app.admx.request({  //发起请求
      url: app.config.service.confirmClaim, //把请求传到后端，地址
      data: {
        claim_ids: e.target.dataset.claim_id,//报工单id
        // state: 1 //进入已审核
      },
      succ: function (res) {
        console.log(res);
        if (!res) {
          // wx.hideLoading();
          wx.showModal({
            content: '操作成功',
            showCancel: false,
            success: function (res) {

              if (res.confirm) {
                that._getTodo(that.data.code, that.data.state);
                that._getReview(that.data.code, that.data.state);
              }
            }
          })
        } else {
          wx.showModal({
            content: '操作不成功，请重试',
            showCancel: false
          })
        }
      }
    })
  },

  confirmAll: function (e) {
    const that = this;
    const confirmArr = that.data.review;
    const resultArr = [];
    for (let i = 0; i < confirmArr.length; i++) {
      if (confirmArr[i].state === '0') {
        resultArr.push(confirmArr[i].claim_id);
      }
    }
    if (resultArr.length === 0) {
      wx.showModal({
        content: '没有可以审核的派工单',
        showCancel: false
      })
    } else {
      wx.showLoading({
        title: '审核中',
        mask: true
      })
      app.admx.request({  //发起请求
        url: app.config.service.confirmClaim, //把请求传到后端，地址
        data: {
          claim_ids: resultArr.join('|'),//报工单id
        },
        succ: function (res) {
          console.log(res);
          if (!res) {
            wx.hideLoading();
            wx.showModal({
              content: '全部审核成功',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          } else {
            wx.showModal({
              content: '审核失败，请重试',
              showCancel: false
            })
          }
        }
      })
    }

  },

  //点击反审核按钮
  rebackClaim: function (e) {
    const that = this;
    wx.showLoading({
      title: '反审核中',
      mask: true
    })
    app.admx.request({
      url: app.config.service.rebackClaim, //把请求传到后端，地址
      data: {
        claim_id: e.target.dataset.claim_id,//报工单id
        // state: 1 //进入已审核
      },
      succ: function (res) {
        if (!res) {
          wx.hideLoading();
          wx.showModal({
            content: '操作成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that._getTodo(that.data.code, that.data.state);
                that._getReview(that.data.code, that.data.state);
              }
            }
          })
        } else {
          wx.showModal({
            content: '反审核不成功，请重试',
            showCancel: false
          })
        }
        // if (res[0]) {
        //   that.setData({
        //     todo: res[0],
        //     review: res[0]
        //   });
        // }
      }
    })
  },


})