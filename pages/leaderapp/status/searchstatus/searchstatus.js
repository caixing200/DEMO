var app = getApp();
Page({
  data: {
    focus: false,
    inputValue: '',
    statusName: app.config.equipmentStatus,
    statusClass: ['green', 'red', 'green','gray'],
    status:'',
    list:[],
  },
  onLoad:function(option){
    console.log("lOAD");
    this.setData({status:option.index});
    this.loadEquipmentList();
  },
  loadEquipmentList:function(){
    var status = this.data.status;
    var that=this;
    wx.showLoading({
      title: '加载中...'
    })
    var that = this;
    app.admx.request({
      method: 'get',
      url: app.config.service.equiprlist.replace("{status}", status),
      succ: function (res) {
        that.setData({
          list:res,
        });
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  detail:function(e){
  
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../equipmentstatus/equipmentstatus?id=' + id
    })
  }

 
})