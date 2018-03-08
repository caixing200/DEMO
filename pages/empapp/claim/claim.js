//派工单报工模块中，选择报工后的弹出窗口

var app = getApp();


Page({
  data: {
    submitting: false,
    //报工单信息
    todo:'',
    //前端存子派工单ID
    subtodo_id: '',

  },
  onLoad:function(options){
    console.log(options);

    this.setData({
      subtodo_id:options.code,
    });
  },
  onShow:function(){

    this._getDetailBySubid();
  },



  //点击报工提交
  claim: function (e) {
    console.log("----claim");
    var that = this;
    if (this.data.submitting) {
      return;
    }
    /*if (!that.data.todo){
      wx.showModal({
        showCancel: false,
        content: '页面加载错误'
      })
    }调试删*/
    var disqualifiedNum = e.detail.value.disqualifiedNum;
    if (disqualifiedNum.length == 0) {
      wx.showModal({
        content: "请输入不合格数量",
        showCancel: false
      });
      return
    }
    var qualifiedNum = e.detail.value.qualifiedNum;
    if (qualifiedNum.length == 0) {
      wx.showModal({
        content: "请输入合格数量",
        showCancel: false
      });
      return
    }
    if (isNaN(disqualifiedNum)) {
      wx.showModal({
        content: "不合格数量只能输入数字",
        showCancel: false
      });
      return
    }
    if (isNaN(qualifiedNum)) {
      wx.showModal({
        content: "合格数量只能输入数字",
        showCancel: false
      });
      return
    }
            
      wx.showModal({
        content: '是否确认报工?',
        success: function (res)
        {
          if (res.confirm) 
          {
            console.log('用户点击确定')
            if (parseInt(disqualifiedNum) > 0)
            {
              wx.navigateTo({
                url: 'disqreaon?disqnum=' + disqualifiedNum + '&qnum=' + qualifiedNum + '&subtodo_id=' + that.data.subtodo_id
              })
            } else if (parseInt(disqualifiedNum) == 0)
            {
               that._dosubmit(disqualifiedNum, qualifiedNum);
            }
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
  },
  
  //获取要报工子派工单信息（复用）
  _getDetailBySubid: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载',
    });
    app.admx.request({
      method: 'get',
      url: app.config.service.todo.replace("{subtodo_id}", that.data.subtodo_id),
      data: {
      },
      succ: function (res) {
        if (res[0]) {
          //如果返回了派出单
          that.setData({
            todo: res[0],
            todolist: null
          });
        } else {
          that.setData({
            todolist: null,
            todo: null
          });
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },


  //内部方法，提交报工单
  _dosubmit: function (disqualifiedNum, qualifiedNum ){
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
  }
})