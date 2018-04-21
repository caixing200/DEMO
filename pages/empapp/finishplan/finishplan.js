//部门计划报工模块主界面
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
    //用户输入
    eligibilityNum: '',
    disqualificationNum: '',
    todocode: '',
    btnState: 1,
    listHidden: false,
    pageIndex: 1,
    planList: [],
    listHiddens: [],
  },
  //输入验证，2018.03.07废弃
  // inputCheck: function(e){
  //   const that = this;
  //   console.log(e);
  //   const origin = e.target.id;
  //   const num = parseInt(e.detail.value);
  //   const baseNum = parseInt(that.data.plan.dept_plannumber);
  //   if (e.detail.value !== ""){
  //     if (isNaN(num)) {
  //       wx.showModal({
  //         content: '请输入数字',
  //         showCancel: false,
  //         success: function (res) {
  //           if (res.confirm) {
  //             that.setData({
  //               eligibilityNum: '',
  //             })
  //           }
  //         }
  //       })
  //       return
  //     } else {
  //       if (origin === 'input1') {
  //         if ((num + that.data.disqualificationNum) > baseNum) {
  //           wx.showModal({
  //             content: '超出最大计划数',
  //             showCancel: false,
  //             success: function(res){
  //               if(res.confirm){
  //                 that.setData({
  //                   eligibilityNum: '',
  //                 })
  //               }
  //             }
  //           })
  //         } else {
  //           that.data.eligibilityNum = num;
  //         }
  //       } else if (origin === 'input2') {
  //         if ((num + that.data.eligibilityNum) > baseNum) {
  //           wx.showModal({
  //             content: '超出最大计划数',
  //             showCancel: false,
  //             success: function (res) {
  //               if (res.confirm) {
  //                 that.setData({
  //                   disqualificationNum: '',
  //                 })
  //               }
  //             }
  //           })
  //         } else {
  //           that.data.disqualificationNum = num;
  //         }
  //       }
  //     }
  //   }
  // },

  goFinishList: function (e) {
    const that = this;
    if (that.data.btnState === 1) {
      that.data.btnState = 2;
      wx.navigateTo({
        url: './finishList',
      })
    }
  },
  _unExamine: function (e) {
    const that = this;
    console.log(e);
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    app.admx.request({
      url: app.config.service.cancelAuditDeptplan,
      data: {
        deptplan_id: e.target.dataset.deptplan_id,
        qualitycheck_id: e.target.dataset.qualitycheck_id
      },
      succ: function (res) {
        console.log(res);
        if (!res) {
          that.data.listHiddens[e.target.dataset.index] = true;
          that.data.planList.splice(e.target.dataset.index,1);
          that.setData({
            //listHiddens: that.data.listHiddens,
            planList: that.data.planList
          }, () => {
            wx.showModal({
              content: '反审核成功',
              showCancel: false,
              // success: function (res) {
              //   if (res.confirm) {
              //     that._getPlanInfoByTodoCode(that.data.todocode)
              //   }
              // }
            })
          })
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },
  //下拉刷新
  lower: function () {
    const that = this;
    if (that.data.planList.length > 9) {
      that._getPlanInfoByTodoCode(that.data.todocode);
    }
  },

  //获得员工信息
  onLoad: function (options) {

    console.log("---onshow:" + options);
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

  },
  onShow: function () {
    console.log('show');
    const that = this;
    that.data.btnState = 1;
    that.setData({
      pageIndex: 1,
      planList: []
    }, () => {
      if (that.data.todocode) {
        that._getPlanInfoByTodoCode(that.data.todocode);
      }
    })
  },

  //扫派工单
  scanTodoCode: function () {
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res)
        if (res.scanType == 'QR_CODE') {
          //得到物料编号，测试用
          //res.result = 'Z18030900002';
          if (res.result.indexOf('Z') === 0) {
            that.setData({
              todocode: res.result
            }, () => {
              that._getPlanInfoByTodoCode(that.data.todocode);
            })
          } else {
            wx.showModal({
              content: '请扫子派工单二维码',
              showCancel: false
            })
          }

        } else {
          wx.showModal({
            content: '请扫派工单二维码',
            showCancel: false
          })
        }
      }
    });
  },
  _addKey: function (list) {
    const that = this;
    const tempArr = [];
    for (let i = 0; i < list.length; i++) {
      list[i].itemKey = i
      tempArr.push(false);
    };
    that.setData({
      listHiddens: tempArr
    })
    return list
  },
  _getPlanInfoByTodoCode: function (todocode) {
    var that = this;
    wx.showLoading({
      title: '查询中..',
      mask: true
    })
    app.admx.request({
      url: app.config.service.getDeptplan,
      data: {
        subtodo_code: todocode,
        currentPage: that.data.pageIndex
      },
      succ: function (res) {
        console.log(res);
        // res[0].dept_end = '';
        if (typeof res == 'object' && res.length > 0) {
          let tempArr = [];
          if(that.data.pageIndex === 1){
            tempArr = that._addKey(that._trimData(res));
          }else {
            tempArr = that._addKey(that.data.planList.concat(that._trimData(res)));
          }
          that.setData({
            listHidden: true,
            submitCover: res[0] ? true : false,
            plan: res[0],
            planList: tempArr,
            eligibilityNum: '',
            disqualificationNum: '',
            pageIndex: that.data.pageIndex + 1
          });
        } else {
          if(that.data.pageIndex === 1){
            wx.showModal({
              content: "没有找到生产计划信息",
              showCancel: false
            })
          }else {
            wx.showToast({
              title: '没有更多信息',
              mask: true,
              duration: 800,
              icon: 'loading'
            })
          }
          
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },
  _trimData: function (list) {
    const that = this;
    let tempArr = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].qualitycheck_id) {
        tempArr.push(list[i]);
      }
    }
    return tempArr;
  },
  //点击确定
  dosubmit: function (e) {
    console.log(e);
    var that = this;
    if (this.data.submitting) {
      return;
    }
    /*if (that.data.plan == '' || that.data.plan == null) {
      wx.showModal({
        content: '请先扫码派工单',
        showCancel: false
      });
      return
    }
    if (that.data.plan.state == app.config.PlanState.canceled){
      wx.showModal({
        content: '该生产计划已取消不可操作',
        showCancel: false
      });
      return
    }
    if (that.data.plan.state == app.config.PlanState.finished){
      wx.showModal({
        content: '该生产计划已完成不可操作',
        showCancel: false
      });
      return
    }*/

    var qualifiedNum = e.detail.value.qualifiedNum;
    if (qualifiedNum.length == 0) {
      wx.showModal({
        content: "请输入合格数量",
        showCancel: false
      });
      return
    }
    var disqualifiedNum = e.detail.value.disqualifiedNum;
    if (disqualifiedNum.length == 0) {
      wx.showModal({
        content: "请输入不合格数量",
        showCancel: false
      });
      return
    }
    if (isNaN(qualifiedNum)) {
      wx.showModal({
        content: "合格数量只能输入数字",
        showCancel: false
      });
      return
    }
    // else if (qualifiedNum > (that.data.plan.dept_plannumber - 0)) {
    //   wx.showModal({
    //     content: '合格数量不能大于计划数',
    //     showCancel: false
    //   })
    //   return
    // }
    if (isNaN(disqualifiedNum)) {
      wx.showModal({
        content: "不合格数量只能输入数字",
        showCancel: false
      });
      return
    }
    //  else if (disqualifiedNum > (that.data.plan.dept_plannumber - 0)) {
    //   wx.showModal({
    //     content: '不合格数量不能大于计划数',
    //     showCancel: false
    //   })
    //   return
    // }
    // if ((qualifiedNum + disqualifiedNum) > (that.data.plan.dept_plannumber - 0)){
    //   console.log(qualifiedNum + disqualifiedNum)
    //   console.log(that.data.plan.dept_plannumber - 0)
    //   wx.showModal({
    //     content: '输入的总数大于计划数',
    //     showCancel: false
    //   })
    //   return
    // }


    // if (disqualifiedNum>0){
    //   wx.navigateTo({
    //     url: 'disqreaon?disqnum=' + disqualifiedNum + '&qnum=' + qualifiedNum
    //   })
    // }


    this.setData({
      submitting: true,
      pageIndex: 1
    })
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    app.admx.request({
      url: app.config.service.updateDeptplan,
      data: {
        dept_id: that.data.plan.dept_id,
        dept_ok: qualifiedNum,
        dept_ng: disqualifiedNum
      },
      succ: function (res) {
        console.log(res);
        if (!res) {
          wx.showModal({
            content: "操作成功",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that._getPlanInfoByTodoCode(that.data.todocode);
              }
            }
          })
        } else {
          wx.showModal({
            content: "操作失败,请重试",
            showCancel: false
          })
        }
      },
      complete: function (res) {
        that.setData({
          submitting: false
        })
        wx.hideLoading();
      }
    })
  }


})