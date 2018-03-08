var app = getApp();
/**
 * 使用 Page 初始化页面，具体可参考微信公众平台上的文档
 */
Page({

  /**
   * 初始数据
   */
  data: {
    compname:"欢迎使用",
    submitting: false
  },

  onShow: function (param) {
    console.log(app.globalData.company);
    if(app.globalData.company){
      this.setData({
        compname: app.globalData.company.cname
      });
    }
    
  },

  doLogin:function(e) {
    console.log("-doLogin");
    var account = e.detail.value.accout;
    var pwd = e.detail.value.password;
    var that = this;
    //用户输入异常处理
    if (account.length == 0) {
      wx.showModal({
        content: "请输入工号",
        showCancel: false
      });
      return
    }
    if (pwd.length == 0) {
      wx.showModal({
        content: "请输入密码",
        showCancel: false
      });
      return
    }
    if (this.data.submitting){
      wx.showModal({
        content: "正在处理,请勿多次点击",
        showCancel: false
      });
      return;
    }
    app.admx.login.login({
      url: app.config.service.loginUrl,
      data:{
        "account":account,
        "password":pwd
      },
      succ: function (res) {
        console.log("--login success");
        console.log(res);
        var power = app.Session.get().user.power;
        if (power == null || power.length == 0) {
          wx.showModal({
            showCancel: false,
            content: '权限没有设置'
          })
          return;
        } else {
          if(power.length == 1){
            if(power[0].id == 1){
              wx.redirectTo({
                url: '../empapp/index'
              })
            }
          }else{//如果权限多于一个跳转到主页面让去选择菜单
            wx.redirectTo({
              url: '../main/main'
            })
          }
        }
       
      },
      complete: function (res) {
        that.setData({
          submitting: false
        })
      },
      fail:function (res) {
        console.log(res);
        wx.showModal({
          content: "登录失败",
          showCancel: false
        });
      }
    });
   
  
  }


});
