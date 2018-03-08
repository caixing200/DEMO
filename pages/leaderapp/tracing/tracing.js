var app = getApp();
var utils = app.admx.utils;
Page({
  data: {
    filter: {},
    submitting: false
  },
  datePickerChange:function(e){
    console.log(e.detail.value);
    this.setData({
      filter:{
        produceDate: e.detail.value
      }
    })
  },
  search:function(e){
    var formData = e.detail.value;
    var newFilter = utils.extend(this.data.filter,formData);
    console.log(newFilter)
    wx.navigateTo({
      url: './searchresult/searchresult?filter=' + JSON.stringify(newFilter)
    })
  },
  reset:function(){
    console.log("----reset");
    
  }
})