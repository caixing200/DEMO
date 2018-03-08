var app = getApp();

Page({
  data: {
    startDate: '',
    endDate: '',
    filter:null
  },
  onLoad:function(options){
    if(options && options.endDate){
      this.setData({
        endDate: options.endDate
      })
    }
    if (app.filters.orders_canceled){
      this.setData({
        filter: app.filters.orders_canceled
      });
    }
  },
  endDateChange:function(e){
    console.log(this.data.startDate > e.detail.value);
    if (this.data.startDate && this.data.startDate > e.detail.value) {
        wx.showModal({
          showCancel: false,
          content: '结束时间不能小于开始时间',
        })
        return;
    }
    this.setData({
      endDate:e.detail.value
    })
  },
  startDateChange:function(e){
    console.log(this.data.endDate > e.detail.value);
    if (this.data.endDate && this.data.endDate < e.detail.value) {
      wx.showModal({
        showCancel: false,
        content: '开始时间不能大于结束时间',
      })
      return;
    }
    this.setData({
      startDate: e.detail.value
    })
  },
  //点击确定时
  search:function(e){
    var formData = e.detail.value;
    formData.canceledEnd = this.data.endDate;
    formData.canceledStart = this.data.startDate;
    console.log(JSON.stringify(formData));
    app.filters.orders_canceled = formData;

    wx.navigateBack();
  },
  reset:function(e){
    this.setData({
      startDate:'',
      endDate:'',
      filter: null
    })
    app.filters.orders_canceled = null;
  }

})