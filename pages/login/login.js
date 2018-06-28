var app = getApp();
/**
 * 使用 Page 初始化页面，具体可参考微信公众平台上的文档
 */
Page({

  /**
   * 初始数据
   */
  data: {
    compname: "欢迎使用",
    submitting: false,
    isSaveAuthData: false,
    account: '',
    pwd: '',
    sessionTimer: null,
  },
  onLoad: function (options) {
    const that = this;
    const AuthData = wx.getStorageSync('userAuth');
    if (AuthData) {
      that.setData({
        account: AuthData.account,
        pwd: AuthData.password,
        isSaveAuthData: true
      })
    }
  },
  onShow: function (param) {
    console.log(app.globalData.company);
    if (app.globalData.company) {
      this.setData({
        compname: app.globalData.company.cname
      });
    }
  },

  doLogin: function (e) {
    console.log("-doLogin");
    var account = e.detail.value.accout;
    var pwd = e.detail.value.password;
    var that = this;
    if (account.length == 0) {
      //用户输入异常处理
      wx.showModal({
        content: "请输入工号",
        showCancel: false
      });
      return
    }
    // if (pwd.length == 0) {
    //   wx.showModal({
    //     content: "请输入密码",
    //     showCancel: false
    //   });
    //   return
    // }
    if (that.data.submitting) {
      wx.showModal({
        content: "正在处理,请勿多次点击",
        showCancel: false
      });
      return;
    } else {
      that.data.submitting = true;
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      that.userLogin(account, pwd);
    }
  },

  userLogin: function (account, pwd){
    const that = this;
    app.admx.login.login({
      url: app.config.service.loginUrl,
      data: {
        "account": account,
        "password": pwd
      },
      succ: function (res) {

        console.log("--login success");
        console.log(res);
        console.log(account);
        console.log(pwd);
        // var power = app.Session.get().user.power;
        var power = res.user.power;
        if (power == null || power.length == 0) {
          wx.showModal({
            showCancel: false,
            content: '权限没有设置'
          })
          return;
        } else {
          that.getSession();
          wx.redirectTo({
            url: '../main/main'
          })
          // if (power.length == 1) {
          //   if (power[0].id == 1) {
          //     wx.redirectTo({
          //       url: '../empapp/index'
          //     })
          //   }
          // } else {//如果权限多于一个跳转到主页面让去选择菜单
          //   wx.redirectTo({
          //     url: '../main/main'
          //   })
          // }

        }
      },
      complete: function (res) {
        wx.hideLoading();
        console.log('....complete');
        that.setData({
          submitting: false
        })
      },
      fail: function (res) {
        wx.hideLoading();
        console.log(res);
        wx.showModal({
          content: "登录失败",
          showCancel: false
        });
      }
    });
  },
  getSession: function(){
    const that = this;
    clearTimeout(that.data.sessionTimer);
    that.data.sessionTimer = setTimeout(function(){
      that.updateSession();
    },7000000);
  },
  updateSession: function(){
    const that = this;
    const userAuth = app.Session.get().userAuth;
    console.log(userAuth);
    app.admx.login.login({
      url: app.config.service.loginUrl,
      data: {
        "account": userAuth.account,
        "password": userAuth.password
      },
      succ: function (res) {
        console.log(res);
        that.getSession();
      },
      complete: function (res) {
        wx.hideLoading();
      }
    });
  },

  saveAuthData: function (e) {
    console.log(e);
    const that = this;
    if (e.detail.value) {
      if (that.data.account){
        that.setData({
          isSaveAuthData: true
        })
        const userAuth = {};
        userAuth.account = that.data.account;
        userAuth.password = that.data.pwd;
        wx.setStorageSync('userAuth', userAuth);
      }else {
        wx.showModal({
          content: '请输入工号',
          showCancel: false,
          success: function(res){
            if(res.confirm){
              that.setData({
                isSaveAuthData: false
              })
            }
          }
        })
      }
      
    } else {
      that.setData({
        isSaveAuthData: false
      })
      wx.removeStorageSync('userAuth');
    }
  },
  codingAccount: function (e) {
    const that = this;
    that.setData({
      account: e.detail.value
    })
  },
  codingPwd: function (e) {
    const that = this;
    that.setData({
      pwd: e.detail.value
    })
  },
  changeState: function(e){
    const that = this;
    if(e.target.dataset.state){
      wx.showModal({
        content: '是否取消保存工号和密码',
        cancelText: '继续保存',
        confirmText: '不保存',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              isSaveAuthData: false
            })
          }
        }
      })
    }
  },
});
