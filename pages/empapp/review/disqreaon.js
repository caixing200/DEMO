//审核人修改派工单合格数量以及不合格原因
var app = getApp();

Page({
  data: {
    submitting: false,
    disqnum: '',
    qnum: '',
    reason: [{
      value: "不合格原因1",
      checked: false,
      color: "#b9dd08"
    }, {
      value: "不合格原因2",
      checked: false,
      color: "#b9dd08"
    }, {
      value: "不合格原因3",
      checked: false,
      color: "#b9dd08"
    }, {
      value: "不合格原因4",
      checked: false,
      color: "#b9dd08"
    }, {
      value: "不合格原因5",
      checked: false,
      color: "#b9dd08"
    }],

  },

  onLoad: function (e) {

    /*console.log(options);
    if (options == null || options.todo == null) {
      wx.showModal({
        showCancel: false,
        content: '页面加载错误'
      })
    }*/
    this.setData({
      qnum: e.qnum
    });
    this.setData({
      disqnum: e.disqnum

    });
  },
  onShow: function () {

  },


  /*addreason: function () {

    var lists = this.data.lists;
    var newData = {};
    lists.push(newData);//实质是添加lists数组内容，使for循环多一次  
    this.setData({
      lists: lists,
      
  })  

  },*/




})