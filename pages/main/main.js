var app = getApp();
Page({
  data: {
    focus: false,
    power: null,
    inputValue: '',
    btnStatus: 1,
    isUserInfo: true
  },
  onLoad: function () {
    const that = this;
    //2018.05.10微信修改登录接口基础API后进行适应性修改
    wx.getSetting({
      success: function (data) {
        if (!data.authSetting['scope.userInfo']) {
          that.setData({
            isUserInfo: false
          })
        } else {
          app.getUserInfo(function (wxUserInfo) {
            var session = app.Session.get();
            session.wxUserInfo = wxUserInfo;
            app.Session.set(session);
            //更新数据
            that.setData({
              wxUserInfo: wxUserInfo,
              appuserinfo: app.Session.get().user
            })
          });
        }
      }
    })

    var power = app.Session.get().user.power;
    console.log(power);
    power = that.filtrMenu(power);
    console.log("power:" + power);
    console.log(power);
    if (power == null || power.length == 0) {
      wx.showModal({
        showCancel: false,
        content: '权限没有设置'
      })
    } else {
      this.setData({
        power: power
      })
    }
  },
  onShow: function () {
    const that = this;
    that.data.btnStatus = 1
  },
  //获取用户信息
  _setUserInfo: function (data) {
    const that = this;
    console.log(data);
    if (data.detail.userInfo){
      app.globalData.wxUserInfo = data.detail.userInfo;
      app.getUserInfo(function (wxUserInfo) {
        var session = app.Session.get();
        session.wxUserInfo = wxUserInfo;
        app.Session.set(session);
      });
      that.setData({
        isUserInfo: true
      })
    }else {
      wx.showToast({
        title: '需授权后使用',
        mask: true,
        icon: 'loading'
      })
    }
    
    
  },
  //过滤菜单
  filtrMenu: function (data) {
    const that = this;
    const tempArr = [];
    for (let i = 0; i < data.length; i++) {
      const index = data[i].orderby
      if (index === '4' || index === '5') {
        continue;
      }
      tempArr.push(data[i])
    }
    return tempArr
  },
  //员工报工系统
  menu_1: function () {
    const that = this;
    if (that.data.btnStatus === 1) {
      that.data.btnStatus = 2
      wx.navigateTo({
        url: '../empapp/index'
      })
    }
  },

  //派工单审核
  menu_7: function () {
    const that = this;
    if (that.data.btnStatus === 1) {
      that.data.btnStatus = 2
      wx.navigateTo({
        url: '../empapp/review/review'
      })
    }
  },

  //部门计划报工（！！）
  menu_9: function () {
    const that = this;
    if (that.data.btnStatus === 1) {
      that.data.btnStatus = 2
      wx.navigateTo({
        url: '../empapp/finishplan/finishplan'
      })
    }
  },

  //销售订单
  menu_2: function () {
    const that = this;
    if (that.data.btnStatus === 1) {
      that.data.btnStatus = 2
      wx.navigateTo({
        url: '../leaderapp/orders/orders'
      })
    }
  },
  //生产计划
  menu_3: function () {
    const that = this;
    if (that.data.btnStatus === 1) {
      that.data.btnStatus = 2
      wx.navigateTo({
        url: '../leaderapp/plan/plan'
      })
    }
  },

  //设备状态
  menu_4: function () {
    const that = this;
    if (that.data.btnStatus === 1) {
      that.data.btnStatus = 2
      wx.navigateTo({
        url: '../leaderapp/status/status'
      })
    }
  },

  //人员绩效
  menu_5: function () {
    const that = this;
    if (that.data.btnStatus === 1) {
      that.data.btnStatus = 2
      wx.navigateTo({
        url: '../leaderapp/perform/vary/vary'
      })
    }
  },

  //生产计划
  menu_6: function () {
    const that = this;
    if (that.data.btnStatus === 1) {
      that.data.btnStatus = 2
      wx.navigateTo({
        url: '../leaderapp/tracing/tracing'
      })
    }
  },

  //个人信息
  menu_8: function () {
    const that = this;
    if (that.data.btnStatus === 1) {
      that.data.btnStatus = 2
      wx.navigateTo({
        url: '../mine/mine'
      })
    }
  }

})