var app = getApp();
var utils = app.admx.utils;
Page({
  data: {
    plan:null,
    result: null,
    claimstates: ['已取消','进行中','已完成']
  },
  onLoad: function (options) {
    console.log(options);
    if (options && options.plan) {
      this.setData({
        plan:JSON.parse(options.plan)
      })
      this._getTodoList(this.data.plan.id);
    } else {
      wx.showModal({
        showCancel: false,
        content: '页面加载错误'
      })
    }
  },
  tracingCliam:function(e){
    console.log(e)
    var index = e.currentTarget.dataset.index;
    console.log("----index:" + index);
    console.log(this.data.result);
    console.log(this.data.result[index]);
    wx.redirectTo({
       url: '../tododetail/detail?todo=' + JSON.stringify(this.data.result[index])
     //  url: '../todo/todo?plan=' + JSON.stringify(this.data.planlist[index])
    })
  },
  //根据生产计划查找派工单
  _getTodoList:function(planid){
    var that = this;
    app.admx.request({
      url: app.config.service.tracingTodo,
      data:{
        planid: planid
      },
      succ: function (res) {
        if (res.list[0]) {
          that.setData({
            result: res.list
          })
        } else {
          wx.showModal({
            content: "没有找到符合条件的记录",
            showCancel: false
          })
        }
      },
      complete: function (res) {
        that.setData({
          submitting: false
        })
      }
    })
  }
})

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}