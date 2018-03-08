//报工有不合格产品时，弹出填写不合格原因页面
var app = getApp();

Page({
  data: {
    submitting: false,
    disqnum:'',
    qnum: '',
    subtodo_id:'',
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
    this.setData({
      subtodo_id: e.subtodo_id

    });
  },
  onShow: function () {

  },

  claim: function (e) {
    console.log("----claim");
    var that = this;

    
    wx.showModal
    ({
      content: '是否确认提交?',
      success: function (res) 
      {
        if (res.confirm) 
        {
          console.log('用户点击确定')
          that._dosubmit(that.data.disqnum, that.data.qnum);
        } else if (res.cancel) 
        {
          console.log('用户点击取消')
        }
      }
    })
  },

  //内部方法，提交报工单
  _dosubmit: function (disqualifiedNum, qualifiedNum) {
    var that = this;
    this.setData({
      submitting: true
    })
    app.admx.request({
      url: app.config.service.claim,
      data: {
        subtodo_id: that.data.subtodo_id,
        claim_ok: disqualifiedNum,
        claim_ng: qualifiedNum
      },
      succ: function (res) {
        if (res.effect > 0) {
          app.refreshCofing.todolist = true;
          wx.showToast({
            title: '报工成功'
          })
          wx.navigateBack();
        } else {
          wx.showModal({
            content: "操作失败",
            showCancel: false
          })
        }
      },
      complete: function (res) {
        that.setData({
          submitting: false
        });
        wx.navigateTo({
          url: '/pages/empapp/index'
        });
      }
    })
  },

      /*if (!that.data.todo){
      wx.showModal({
        showCancel: false,
        content: '页面加载错误'
      })
    }调试删*/

})







  /*addreason: function () {

    var lists = this.data.lists;
    var newData = {};
    lists.push(newData);//实质是添加lists数组内容，使for循环多一次  
    this.setData({
      lists: lists,
      
  })  

  },*/





// pages/warn/index.js
//Page({

  /**
   * 页面的初始数据
   */
 /* data: {
    inputValue: {
      num: 0,
      desc: ""
    },
    actionText: "拍摄/相册",
    picUrls: [],
    checkboxValues: [],
    
    btnColor: "#f2f2f2"
  },

  checkboxChange: function (e) {
    var _value = e.detail.value;
    if (_value.length == 0) {
      this.setData({
        checkboxValues: [],
        btnColor: "#f2f2f2"
      })
    } else {
      this.setData({
        checkboxValues: _value,
        btnColor: "#b9dd08"
      })
    }
  },

  clickPhoto: function () {
    wx.chooseImage({
      success: (res) => {
        console.log(res);
        var _picUrls = this.data.picUrls;
        var tfs = res.tempFilePaths;
        for (let temp of tfs) {
          _picUrls.push(temp);
        }
        this.setData({
          picUrls: _picUrls,
          actionText: "+"
        })
      },
    })
  },

  delPhoto: function (e) {
    console.log(e);
    let index = e.target.dataset.index;
    let _picUrls = this.data.picUrls;
    _picUrls.splice(index, 1);
    this.setData({
      picUrls: _picUrls
    })
    if (_picUrls.length == 0) {
      this.setData({
        actionText: "拍摄/相册"
      })
    }
  },
  changeNum: function (e) {
    this.setData({
      inputValue: {
        num: e.detail.value,
        desc: this.data.inputValue.desc
      }
    })
  },

  changeDesc: function (e) {
    this.setData({
      inputValue: {
        num: this.data.inputValue.num,
        desc: e.detail.value
      }
    })
  },

  submit: function () {
    if (this.data.checkboxValues.length > 0
      && this.data.picUrls.length > 0) {
      wx.request({
        url: 'https://www.easy-mock.com/mock/5963172d9adc231f357c8ab1/ofo/submitSuccess',
        success: (res) => {
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          })
          setTimeout(() => {
            wx.redirectTo({
              url: '../index/index',
            })
          }, 1000)
        }
      })
    } else {
      wx.showModal({
        title: '请填写完整的反馈信息',
        content: '你瞅啥？赶紧填',
        confirmText: '填、我填',
        cancelText: '老子不填',
        success: (res) => {
          if (res.confirm) {
            console.log(res);
          } else {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  }*/