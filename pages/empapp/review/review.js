//派工单审核模块主界面
var app = getApp();
var utils = app.admx.utils;
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
    //存储已审核和审核中的派工单信息
    todolist: [],
    tabActiveClass: ['active', ''],
  },

  //显示员工信息
  onLoad: function (options) {

    console.log("---onshow:" + options);
    var that = this;
    app.globalData.detailData = null;
    app.globalData.todoData = null;
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

  //展示页面
  onShow: function (options) {
    var that = this;
    console.log("---onshow:" + app.refreshCofing);
    console.log(app.refreshCofing);
    that.tabShowOnGoing(null, app.config.ClaimState.ongoing);
  },


  //扫描子派工单，查看
  scanTodo: function () {
    const that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res)
        if (res.scanType == 'QR_CODE') {
          //得到派工单号
          //res.result = 'Z18030900002';//测试用
          var todocode = res.result;
          that._getReview(todocode);


          // wx.navigateTo({
          //   url: './detail?code=' + todocode
          // })
        } else {
          wx.showModal({
            content: '请扫派工单二维码',
            showCancel: false
          })
        }
      },
      // fail: (res) => {
      //   wx.showModal({
      //     content: '请扫派工单二维码',
      //     showCancel: false
      //   })
      // }
    });
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
        if (Array.isArray(res) && res.length>0) {
          //res[0].claim_person = '23333333';//测试用
          if (res && (res[0].claim_person !== '')) {
            //app.globalData.detailData = res;
            //app.globalData.detailData[0].state = '1';//测试用
            wx.navigateTo({
              url: './detail?code=' + code + '&navStatus=2',
            })
          } else {
            wx.showModal({
              content: '此派工单未报工',
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
        if (Array.isArray(res) && res[0]) {
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

  //待审核tab
  tabShowOnGoing: function (e, filter) {

    this.setData({
      tabActiveClass: ['active', '']
    });
    this._postAuditClaim(utils.extend({
      state: app.config.ReviewState.ongoing
    }, filter));
  },

  //已审核TAB
  tabShowFinished: function (e, filter) {
    this.setData({
      tabActiveClass: ['', 'active']
    });
    this._postAuditClaim(utils.extend({
      state: app.config.ReviewState.finished
    }, filter));
  },

  //获取审核中和已审核的派工单主要信息（根据option不同） 
  _postAuditClaim: function (option) {
    console.log(option);
    var that = this;
    wx.showLoading({
      title: '正在加载',
    });
    app.admx.request({
      url: app.config.service.ReviewList,
      data: option,
      succ: function (res) {
        console.log("success fasong");
        console.log(option);
        console.log(res);
        if (res.length>0) {//如果返回了派出工
          that.setData({
            doinglist: res,
          },()=>{
            app.globalData.todoData = res;
          });
        } else {
          that.setData({
            doinglist: null,
          });
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },



})