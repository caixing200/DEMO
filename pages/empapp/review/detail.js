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
        appuserinfo: app.Session.get().user,
        state: options.state,
      })
    })
    if (options.code) {
      if (options.navStatus === '2') {
        that._getTodo(options.code);
        that._getReview(options.code);
      } else if (options.navStatus === '1') {
        that._getTodo(options.code);
        that._getReview(options.code);
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
  _getReview: function (code) {
    var that = this;
    wx.showLoading({
      title: 'loading',
    })
    app.admx.request({
      url: app.config.service.ReviewDetail,
      data: {
        subtodo_code: code
      },
      succ: function (res) {
        console.log(res);
        if (Array.isArray(res)) {
          if (res.length > 0) {

            that.setData({
              review: res,          //所有报工单信息
            })
          } else {
            wx.showModal({
              content: '数据错误',
              showCancel: false
            })
          }
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
  //获取子派工单信息
  _getTodo: function (code) {
    var that = this;
    wx.showLoading({
      title: 'loading',
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

  //点击修正按钮
  modify: function (e) {
    var that = this;
    console.log(e);
    wx.redirectTo({
      url: './disqreaon?claim_ok=' + e.target.dataset.claim_ok + '&claim_ng=' + e.target.dataset.claim_ng + '&claim_id=' + e.target.dataset.claim_id
    });
  },

  //点击确认按钮
  confirm: function (e) {
    const that = this;
    app.admx.request({  //发起请求
      url: app.config.service.confirmClaim, //把请求传到后端，地址
      data: {
        claim_ids: e.target.dataset.claim_id,//报工单id
        // state: 1 //进入已审核
      },
      succ: function (res) {
        console.log(res);
        if (!res) {
          wx.showModal({
            content: '操作成功',
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
      if(confirmArr[i].state === '0'){
        resultArr.push(confirmArr[i].claim_id);
      }
    }
    if (resultArr.length === 0) {
      wx.showModal({
        content: '没有可以审核的派工单',
        showCancel: false
      })
    }else {
      app.admx.request({  //发起请求
        url: app.config.service.confirmClaim, //把请求传到后端，地址
        data: {
          claim_ids: resultArr.join('|'),//报工单id
        },
        succ: function (res) {
          console.log(res);
          if(!res){
            wx.showModal({
              content: '全部审核成功',
              showCancel: false,
              success: function(res){
                if(res.confirm){
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          }else {
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
    app.admx.request({
      url: app.config.service.rebackClaim, //把请求传到后端，地址
      data: {
        claim_id: e.target.dataset.claim_id,//报工单id
        // state: 1 //进入已审核
      },
      succ: function (res) {
        if (!res) {
          wx.showModal({
            content: '操作成功',
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