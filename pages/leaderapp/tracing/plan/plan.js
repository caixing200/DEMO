var app = getApp();
var utils = app.admx.utils;

Page({
  data: {
    focus: false,
    planlist: null
  },
  onLoad:function(options){
    console.log('csdsxx...' + JSON.stringify(options));
    if(options && options.odid){
      this._getPlanList({
        odid: options.odid
      });
    }else{
      wx.showModal({
        showCancel: false,
        content: '页面加载错误'
      })
    }
  },
  /**
   * 查询计划下的派工单
   * @param index 选择的计划下标
   */
  tracingTodo:function(e){
    console.log(e)
    var index = e.currentTarget.dataset.index;
    console.log("----index:" + index);
    console.log(this.data.planlist);
    console.log(this.data.planlist[index]);
    wx.redirectTo({
      url: '../todo/todo?plan=' + JSON.stringify(this.data.planlist[index])
    })
  },
   //查询订单
  _getPlanList: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    app.admx.request({
      url: app.config.service.tracingPlan,
      data: options,
      succ: function (res) {
        console.log('pcpcpc...' + JSON.stringify(res));
        if (res.list[0]) {
          that.setData({
            planlist: res.list
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