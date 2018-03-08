var app = getApp();

Page({
  data: {
    eqiupment:{},
    statusName: app.config.equipmentStatus,
  },
  onLoad:function(option){
    this.loadEqiupment(option.id);
  },
  loadEqiupment:function(id){
    var that=this;
    wx.showLoading({
      title: '加载中...'
    })
    app.admx.request({
      method: 'get',
      url: app.config.service.equiprdetail.replace("{id}", id),
      succ: function (res) {
        res.today.ontime = that.calsecond(res.today.ontime);
        res.today.offtime = that.calsecond(res.today.offtime);
        res.today.exceptiontime = that.calsecond(res.today.exceptiontime);
        that.setData({
          eqiupment: res,
        });
 
      
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  calsecond: function (a) {
    var hour = parseInt(a / 60 / 60);
    var minuter = parseInt(a % 360 / 60);
    var secord=parseInt(a%360%60);
    return hour + "小时" + minuter + "分钟" +secord+"秒";
  }
})