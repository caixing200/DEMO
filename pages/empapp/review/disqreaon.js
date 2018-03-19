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
      qnum: e.claim_ok,
      claim_id: e.claim_id,
      disqnum: e.claim_ng
    });
  },
  onShow: function () {

  },

  bindOkInput: function(e){
    const that = this;
    that.setData({
      qnum: e.detail.value
    })
  },
  bindNgInput: function (e) {
    const that = this;
    that.setData({
      disqnum: e.detail.value
    })
  },
  //点击提交按钮
  sendSubmit: function (e) {
    var that = this;
    //输入验证
    if (that.data.qnum.length == 0){
      wx.showModal({
        content: "请输入合格数量",
        showCancel: false
      });
      return
    }
    if (that.data.disqnum.length == 0) {
      wx.showModal({
        content: "请输入不合格数量",
        showCancel: false
      });
      return
    }
    if (isNaN(that.data.qnum)) {
      wx.showModal({
        content: "合格数量只能输入数字",
        showCancel: false
      });
      return
    }
    if (isNaN(that.data.disqnum)) {
      wx.showModal({
        content: "不合格数量只能输入数字",
        showCancel: false
      });
      return
    }
    console.log(that.data.claim_id);
    console.log(that.data.qnum);
    console.log(that.data.disqnum);
    wx.showLoading({ //弹出消息框-操作中
      title: '操作中...',
      mask: true
    })
    app.admx.request({  //发起请求
      url: app.config.service.postAuditClaim, //把请求传到后端，地址
      data: {
        claim_id: that.data.claim_id,//报工单id
        exam_ok: that.data.qnum,  //审核合格数
        exam_ng: that.data.disqnum   //审核不合格数
      },
      succ: function (res) {
        console.log(res);
        if(!res){
          wx.showModal({ //弹出消息提示框
            content: '提交成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }else {
          wx.showModal({
            content: '提交失败，请重试',
            showCancel: false,
          })
        }
        
      }
    })
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