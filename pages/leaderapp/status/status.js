var app = getApp();
var wxCharts = require('../../../lib/wxcharts/wxcharts.js');
var pieCharts=null;
Page({
  data: {
    focus: false,
    inputValue: ''
  },
  onShow:function(){
    wx.showLoading({
      title: '加载中...'
    })
    var that=this;
    app.admx.request({
      method: 'get',
      url: app.config.service.equipruning,
      succ: function (res) {
        that.loadCharts(res);
      },
      complete:function(){
        wx.hideLoading();
      }
    });
  },
  touchHandler:function(e){
    
    var index = pieCharts.getCurrentDataIndex(e);
    if(index!==-1){
      wx.navigateTo({
        url: 'searchstatus/searchstatus?index='+index
      })
    }
  },
  loadCharts:function(res){
    pieCharts = new wxCharts({
      subtitle:{
        name:(function(){
         return res.count+"台设备"
        })(),
        color:'#000000'
      },
      canvasId: 'pieCanvas',
      type: 'ring',
      series: [{
        name: '待机',
        color: '#1BC798',
        data: res.wait,
        format:function(val){
          return this.data;
        }
      }, {
        name: '故障',
        color: '#E64340',
        data: res.exception,
        format: function (val) {
          return this.data;
        }
      }, {
        name: '运行',
        color: '#40AEE6',
        data: res.run,
        format: function (val) {
          return this.data;
        }
      }, {
        name: '关机',
        color: '#CCCCCC',
        data: res.off,
        format: function (val) {
          return  this.data;
        }
      }],
      width: this.getChartsWidth(),
      height: 300,
      dataLabel: true
    })
    }
  , getChartsWidth: function () {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    return windowWidth;
  }
  

})