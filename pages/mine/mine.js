var app = getApp();
var utils = app.admx.utils;
/**
 * 使用 Page 初始化页面，具体可参考微信公众平台上的文档
 */
Page({

  /**
   * 初始数据
   */
  data: {
    appuserinfo: null,
    wxUserInfo:null,
    company:null,
    genderRange: ['男', '女'],
    selectedSexIndex: 0,
    dateValue: null,
    submit: true
  },
  onLoad:function(){
    var that = this;
    app.getUserInfo(function (wxUserInfo) {
      var session = app.Session.get();
      session.wxUserInfo = wxUserInfo;
      app.Session.set(session);
      //更新数据
      that.setData({
        wxUserInfo: wxUserInfo,
        appuserinfo: app.Session.get().user,
        company: app.globalData.company
      },()=>{
        console.log(that.data.company)
        console.log(that.data.wxUserInfo)
        console.log(that.data.appuserinfo)
      })
    });
    
  },
 
  //修改密码
  chgPwd:function() {
    var userId = wx.getStorageSync('userId');
    wx.navigateTo({
      url: '../password/password'
    })
  },

  //退出登录
  logout:function(){
    app.Session.clear();
    wx.reLaunch({
      url: '../login/login',
    })
  }


});
