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

  //扫派工单
  scanTodoCode: function () {
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res)
        if (res.scanType == 'QR_CODE') {
          //得到物料编号，测试用
          //res.result = 'Z18030900002';
          that.data.todocode = res.result;
          that._getPlanInfoByTodoCode(that.data.todocode);
        } else {
          wx.showModal({
            content: '请扫派工单二维码',
            showCancel: false
          })
        }
      }
    });
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
        subtodo_code: todocode
      },
      succ: function (res) {
        console.log(res);
        // res[0].dept_end = '';
        if (typeof res == 'object' && res.length>0) {
          that.setData({
            submitCover: res[0].dept_end === '' ? true : false,
            plan: res[0],
            eligibilityNum: '',
            disqualificationNum: '',
          });
        } else {
          wx.showModal({
            content: "没有找到生产计划信息",
            showCancel: false
          })
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
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
      submitting: true
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
              if(res.confirm){
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