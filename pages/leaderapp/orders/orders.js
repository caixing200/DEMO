var app = getApp();
var utils = app.admx.utils;
Page({
  data: {
    orderslist: '',
    tabActive:['active',null,null,null],
    selectedDateAwaiting:null,
    selectedDateFinished: null,
    selectedDateCanceled: null,
    opened:{}//保存展开的产品
  },
  onLoad:function(options){
    console.log("----onLoad");
  },
  onShow: function (){
    console.log("----onShow");
    if (this.data.tabActive[0]) {//从search页传过来的搜索条件
      this.tabOnGoing(null, app.filters.orders_ongoing);
    } else if (this.data.tabActive[1]) {
      if (app.filters.orders_awaiting && app.filters.orders_awaiting.deliverydateEnd) {
        this.setData({
          selectedDateAwaiting: app.filters.orders_awaiting.deliverydateEnd
        });
      }
      this.tabAwaiting(null, app.filters.orders_awaiting);
    } else if (this.data.tabActive[2]) {
      if (app.filters.orders_finished && app.filters.orders_finished.finishedEnd) {
        this.setData({
          selectedDateFinished: app.filters.orders_finished.finishedEnd
        });
      }
      this.tabCliamed(null, app.filters.orders_finished);
    } else if (this.data.tabActive[3]) {
      if (app.filters.orders_canceled && app.filters.orders_canceled.canceledEnd) {
        this.setData({
          selectedDateCanceled: app.filters.orders_canceled.canceledEnd
        });
      }
      this.tabCanceled(null, app.filters.orders_canceled);
    }
  },
  //进行中  [utils.extend({state: app.config.OrdersState.awaiting}, filter)]的值为State的指，返回的就是state：-1的json
  tabOnGoing: function (e,filter) {
    console.log("---tab on go");
    console.log(filter);
    var that = this;
    this.setData({
      tabActive: ['active', null, null, null]
    })
    this._getOrdersList(utils.extend({
      state: app.config.OrdersState.ongoing
    }, filter));
  },
  //待排产
  tabAwaiting: function (e, filter) {
    console.log("---tab on wait");
    console.log(filter);
    this.setData({
      tabActive: [null, 'active', null, null]
    })
    if (!this.data.selectedDateAwaiting) {
      this.setData({
        selectedDateAwaiting: app.common.dateFormat("yyyy-MM-dd", new Date())
      });
    }

    this._getOrdersList(utils.extend({
      state: app.config.OrdersState.awaiting
    }, filter));
    
  },
  //已完成
  tabCliamed: function (e,filter){
    this.setData({
      tabActive: [null, null,'active', null],  
    })
    if (!this.data.selectedDateFinished) {
      this.setData({
        selectedDateFinished: app.common.dateFormat("yyyy-MM-dd", new Date())
      });
    }
    this._getOrdersList(utils.extend({
      state: app.config.OrdersState.finished
    },filter));
  },
  //已取消
  tabCanceled: function (e,filter){
    this.setData({
      tabActive: [null, null, null,'active'],
    })
    if (!this.data.selectedDateCanceled){
      this.setData({
        selectedDateCanceled:app.common.dateFormat("yyyy-MM-dd", new Date())
      });
    }
    this._getOrdersList(utils.extend({
      state: app.config.OrdersState.canceled
    },filter));
    
  },
  //当点击时间下拉时
  datePickerChangeFinished:function(e){
    console.log(e.detail.value);
    this.setData({
      selectedDateFinished: e.detail.value
    });
    if (!app.filters.orders_ongoing){
      app.filters.orders_ongoing = {
        finishedEnd: e.detail.value
      }
    }else{
      app.filters.orders_ongoing.finishedEnd = e.detail.value;
    }
    this.tabCliamed();
  },
  //当点击时间下拉时
  datePickerChangeAwaiting: function (e) {
    console.log(e.detail.value);
    this.setData({
      selectedDateAwaiting: e.detail.value
    });
    if (!app.filters.orders_ongoing) {
      app.filters.orders_ongoing = {
        deliverydateEnd: e.detail.value
      }
    } else {
      app.filters.orders_ongoing.deliverydateEnd = e.detail.value;
    }
    this.tabAwaiting();
  },
  //当点击时间下拉时
  datePickerChangeCanceled: function (e) {
    console.log(e.detail.value);
    this.setData({
      selectedDateCanceled: e.detail.value
    });
    if (!app.filters.orders_canceled) {
      app.filters.orders_canceled = {
        canceledEnd: e.detail.value
      }
    } else {
      app.filters.orders_canceled.canceledEnd = e.detail.value;
    }
    this.tabCanceled();
  },
  //当点击筛选时跳转的页面
  filterOngoing:function(){
    wx.navigateTo({
      url: './filter_ongoing/filter?',
    });
  },
  //当点击筛选时跳转的页面
  filterCanceled: function () {
    wx.navigateTo({
      url: './filter_canceled/filter?endDate=' + this.data.selectedDateCanceled,
    });
  },
  //当点击筛选时跳转的页面
  filterFinished: function () {
    wx.navigateTo({
      url: './filter_finished/filter?endDate=' + this.data.selectedDateFinished,
    });
  },
  //当点击筛选时跳转的页面
  filterAwaiting: function () {
    console.log("--filterAwaiting");
    console.log(this.data.selectedDateAwaiting)
    wx.navigateTo({
      url: './filter_awaiting/filter?endDate=' + this.data.selectedDateAwaiting,
    });
  },

  //展开产品
  unflodProds: function (e) {
    console.log(e.currentTarget.dataset);
    var id = e.currentTarget.dataset.id;
    var opened = this.data.opened;
    opened[id] = id;
    this.setData({
      opened: opened
    })
    console.log(this.data.opened)
  },
  //收起产品
  flodProds: function (e) {
    console.log(e.currentTarget.dataset)
    var id = e.currentTarget.dataset.id;
    var opened = this.data.opened;
    delete opened[id];
    this.setData({
      opened: opened
    })
  },

  //点击销售订单明细时去生产计划
  gotoPlanDetail:function(e){
    console.log(e.currentTarget.dataset)
    //订单明细id
    var odid = e.currentTarget.dataset.odid;
    var state = e.currentTarget.dataset.state;
    if (state == app.config.OrdersState.awaiting){//待排产还没有计划
      return;
    }
    var that = this;
    wx.showLoading({
      title: '加载中...'
    })
    app.admx.request({
      url: app.config.service.getbyorderdeailid,
      data: {
        odid: odid
      },
      succ: function (res) {
        if (res.list[0]) {
          wx.navigateTo({
            url: '../plandetail/detail?plan=' + JSON.stringify(res.list[0]),
          })
        } else {
          wx.showModal({
            showCancel:false,
            content: '没有找到生产计划'
          })
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
   
  },

  //查询订单
  _getOrdersList:function(options){
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    app.admx.request({
      url: app.config.service.orderlist,
      data: options,
      succ: function (res) {
        if (res.list[0]) {
          that.setData({
            orderslist:res.list
          });
        }else{
          that.setData({
            orderslist: null
          });
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  }

})