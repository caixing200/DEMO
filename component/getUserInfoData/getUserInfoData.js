// component/getUserInfoData.js
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _setUserInfo: function(data){
      console.log(data);
      app.globalData.wxUserInfo = data.detail.userInfo;
      app.getUserInfo(function (wxUserInfo) {
        var session = app.Session.get();
        session.wxUserInfo = wxUserInfo;
        app.Session.set(session);
      });
      
    }
  }
})
