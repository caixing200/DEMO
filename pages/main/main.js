var app = getApp();
Page({
  data: {
    focus: false,
    power: null,
    inputValue: '',
    btnStatus: 1
  },
  onLoad: function () {
    const that = this;
    var power = app.Session.get().user.power;
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