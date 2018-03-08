var app = getApp();
var utils = app.admx.utils;
Page({
  data: {
    orderslist: '',
    tabActive: ['active', null, null],
    selectedDate: null,
    qlt: []
  },
  onLoad: function (options) {
    this._getAllDept(options.code);
  },
  _getAllDept: function (code) {
    var that = this;
    wx.showLoading({
      title: 'loading',
    })
    app.admx.request({
      url: app.config.service.allDeptAc,
      data: {
        qrcode: code
      },
      succ: function (res) {
        that.setData({ qlt: res.deptTask });
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },
  onShow: function () {
    console.log("cj---onShow");
    var endDate = app.common.dateFormat("yyyy-MM-dd", new Date());
    var beginDate =
      app.dateUtil.getPreMonth(endDate);
    this.setData({
      beginDate: beginDate,
      endDate: endDate
    });
  },
  tabTask: function (e, start, end) {
    console.log("---ssstab task");
    var that = this;
    this.setData({
      tabActive: ['active', null, null]
    }),
      wx.showLoading({
        title: 'loading',
      })
    app.admx.request({
      url: app.config.service.allDeptAc,
      data: {
        beginDate: start,
        endDate: end
      },
      succ: function (res) {
        that.setData({ qlt: res.deptTask });
      },
      complete: function (res) {
        wx.hideLoading();
      }
    });
  },
  tabQuality: function (e, start, end) {
    console.log("---ssstab tabQuality");
    var that = this;
    this.setData({
      tabActive: [null, 'active', null]
    })
    wx.showLoading({
      title: 'loading',
    })
    app.admx.request({
      url: app.config.service.allQlfAc,
      data: {
        beginDate: start,
        endDate: end
      },
      succ: function (res) {
        that.setData({ qlt: res.qualifiedTask });
      },
      complete: function (res) {
        wx.hideLoading();
      }
    });
  },
  tabEfc: function (e, start, end) {
    console.log("---ssstab tabEfc");
    var that = this;
    this.setData({
      tabActive: [null, null, 'active']
    })
    wx.showLoading({
      title: 'loading',
    })
    app.admx.request({
      url: app.config.service.allEfcAc,
      data: {
        beginDate: start,
        endDate: end
      },
      succ: function (res) {
        that.setData({ qlt: res.efficiencyTask });
      },
      complete: function (res) {
        wx.hideLoading();
      }
    });
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    if (this.data.endDate < e.detail.value) {
      wx.showModal({
        showCancel: false,
        content: '开始时间不能大于结束时间',
      })
      return;
    }
    this.setData({
      beginDate: e.detail.value
    })
  },
  bindEndDateChange: function (e) {
    console.log(this.data.beginDate);
    console.log(e.detail.value);
    if (this.data.beginDate > e.detail.value) {
      wx.showModal({
        showCancel: false,
        content: '结束时间不能小于开始时间',
      })
      return;
    }
    this.setData({
      endDate: e.detail.value
    })
  },
  //当点击时间下拉时
  datePickerChangeOnGoing: function (e) {
    console.log(e.detail.value);
    this.setData({
      selectedDate: e.detail.value
    });
    if (!app.filters.orders_ongoing) {
      app.filters.orders_ongoing = {
        deliverydateEnd: e.detail.value
      }
    } else {
      app.filters.orders_ongoing.deliverydateEnd = e.detail.value;
    }
    this.tabOnGoing();
  },
  //当点击部门完成率时跳转页面
  detail:function(e){  
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../finishedrate/finishedrate?dept=' + JSON.stringify(this.data.qlt[index])
    })
    
  },
  query: function (e) {
    if (this.data.tabActive[0]) {
      this.tabTask(e, this.data.beginDate, this.data.endDate);
    } else if (this.data.tabActive[1]) {
      this.tabQuality(e, this.data.beginDate, this.data.endDate);
    } else if (this.data.tabActive[2]) {
      this.tabEfc(e, this.data.beginDate, this.data.endDate);
    }
  }
})