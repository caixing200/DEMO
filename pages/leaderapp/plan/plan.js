var app = getApp();
var utils = app.admx.utils;
Page({
  data: {
    planlist:null,
    tabActive: ['active', null, null],
    selectedDate: null
  },
  onLoad: function (options) {
    console.log("----onLoad");
    this.setData({
      selectedDate: app.common.dateFormat("yyyy-MM-dd", new Date())
    });

  },
  onShow: function () {
    console.log("----onShow");
    if (this.data.tabActive[0]) {//从search页传过来的搜索条件
      if (app.filters.plan_ongoing && app.filters.plan_ongoing.finishedEnd) {
        this.setData({
          selectedDate: app.filters.plan_ongoing.finishedEnd
        });
      }
      this.tabOnGoing(null, app.filters.plan_ongoing);
    }  else if (this.data.tabActive[1]) {
      if (app.filters.orders_finished && app.filters.orders_finished.finishedEnd) {
        this.setData({
          selectedDate: app.filters.orders_finished.finishedEnd
        });
      }
      this.tabCliamed(null, app.filters.orders_finished);
    } else if (this.data.tabActive[2]) {
      if (app.filters.orders_canceled && app.filters.orders_canceled.canceledEnd) {
        this.setData({
          selectedDate: app.filters.orders_canceled.canceledEnd
        });
      }
      this.tabCanceled(null, app.filters.orders_canceled);
    }
  },
  tabOnGoing:function(e,filter){
    console.log("---tab on go");
    console.log(filter);
    var that = this;
    this.setData({
      tabActive: ['active', null, null]
    })
    this._getPlanList(utils.extend({
      state: app.config.PlanState.ongoing,
      finishedEnd: that.data.selectedDate
    }, filter));
  },
  tabFinished: function (e, filter){
    this.setData({
      tabActive: [null, 'active',null]
    })
    this._getPlanList(utils.extend({
      state: app.config.PlanState.finished
    }, filter));
  },
  tabCanceled: function (e, filter){
    this.setData({
      tabActive: [null, null, 'active' ]
    })
    this._getPlanList(utils.extend({
      state: app.config.PlanState.canceled
    }, filter));
  },
  //当点击时间下拉时
  datePickerChangeOnGoing: function (e) {
    console.log(e.detail.value);
    this.setData({
      selectedDate: e.detail.value
    });
    if (!app.filters.plan_ongoing) {
      app.filters.plan_ongoing = {
        finishedEnd: e.detail.value
      }
    } else {
      app.filters.plan_ongoing.finishedEnd = e.detail.value;
    }
    this.tabOnGoing(e, app.filters.plan_ongoing);
  },
  //当点击筛选时跳转的页面
  filterOngoing: function () {
    wx.navigateTo({
      url: './filter_ongoing/filter?endDate=' + this.data.selectedDate,
    });
  },
  //当点击筛选时跳转的页面
  filterCanceled: function () {
    wx.navigateTo({
      url: './filter_canceled/filter?endDate=' + this.data.selectedDate,
    });
  },
  //当点击筛选时跳转的页面
  filterFinished: function () {
    wx.navigateTo({
      url: './filter_finished/filter?endDate=' + this.data.selectedDate,
    });
  },
  //当点击每一条生产计划时进入详情
  detail:function(e){
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../plandetail/detail?plan=' + JSON.stringify(this.data.planlist[index]),
    });
  },
 
  //查询订单
  _getPlanList: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    app.admx.request({
      url: app.config.service.planlist,
      data: options,
      succ: function (res) {
        if (res.list[0]) {
          var planlist = res.list;
          var planlistnew = [];
          for(var i = 0 ; i < planlist.length ; i++){
            var plan = planlist[i];
            plan.finishedrate = (plan.currnum/plan.num*100).toFixed(2);
            planlistnew.push(plan);
          }
          that.setData({
            planlist: planlistnew
          });
        } else {
          that.setData({
            planlist: null
          });
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  }

})