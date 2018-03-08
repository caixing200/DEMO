var app = getApp();

Page({
  data: {
    plan:null,
    //派工单列表
    todolist:null
  },
  onLoad:function(options){
    console.log(options);
    if(options && options.plan){
      this.setData({
        plan:JSON.parse(options.plan)
      })
      this._getPlanDetail(this.data.plan.id);
    }
  },
  //当点击派工单时去详情
  todoDetail:function(e){
    var index = e.currentTarget.dataset.index;
  },
  //根据id获取plan
  _getPlanDetail:function(id){
    var that = this;
    wx.showLoading({
      title: 'loading',
    })
    app.admx.request({
      url: app.config.service.getplandetail,
      data: {
        planid: id
      },
      succ: function (res) {
        if (res.list[0]) {//如果返回了派出工
          that.setData({
            todolist: res.list
          });
        } else {
          wx.showModal({
            content: '该计划下还没有派工单',
            showCancel: false
          })
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  }

})