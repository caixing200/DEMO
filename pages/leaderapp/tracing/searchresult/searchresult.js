var app = getApp();
var utils = app.admx.utils;

Page({
  data: {
    filter: null,
    submitting: false,
    result:null,
    opened: {}//保存展开的产品
  },
  onLoad: function (options) {
    console.log("----onLoad");
    console.log(options);
    if (options && options.filter) {
      this._tracing(options.filter)
    } else {
      wx.showModal({
        showCancel: false,
        content: '页面加载错误'
      })
    }
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
  //查询
  _tracing:function(filter){
    var that = this;
    if (this.data.submitting) {
      return;
    }
    this.setData({
      submitting: true
    })
    app.admx.request({
      url: app.config.service.tracing,
      data: utils.extend(JSON.parse(filter), { 
        state: app.config.OrdersState.finished
        }),
      succ: function (res) {
        console.log('cssff..' + JSON.stringify(res));
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
  },
  // //展开产品
  // unflodProds: function (e) {
  //   console.log(e.currentTarget.dataset);
  //   var id = e.currentTarget.dataset.id;
  //   var opened = this.data.opened;
  //   opened[id] = id;
  //   this.setData({
  //     opened: opened
  //   })
  //   console.log(this.data.opened)
  // },
  // //收起产品
  // flodProds: function (e) {
  //   console.log(e.currentTarget.dataset)
  //   var id = e.currentTarget.dataset.id;
  //   var opened = this.data.opened;
  //   delete opened[id];
  //   this.setData({
  //     opened: opened
  //   })
  // },

})