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
    todo: {},
    //存报工单信息
    review: {},
    //上个页面传值过来知道，从而知道是查看审核中-0还是已审核-1
    state: '0',
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
    // this.setData({
    //   state: options.state,
    // });
    if (options.code) {
      if (options.navStatus === '2'){
        that._getTodo(options.code);
      } else if (options.navStatus === '1'){
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
        success: function(res){
          if(res.confirm){
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
          if (res && (res[0].claim_person !== '')) {
            that.setData({
              review: res,          //所有报工单信息
            })
          } else {
            wx.showModal({
              content: '派工单不存在或已失效',
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
            review: app.globalData.detailData
          })
          console.log(app.globalData.detailData)
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
    wx.navigateTo({
      url: './disqreaon'
    })
  },

  //点击反审核按钮
  rebackClaim: function (e) {
    wx.navigateTo({
      url: './review'
    })
  },


})