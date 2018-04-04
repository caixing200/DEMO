//派工单报工模块中，选择报工后的弹出窗口
var app = getApp();
Page({
  data: {
    submitting: false,
    //报工单信息
    todo: '',
    //存报工人信息
    partner: [],
    //存储报工内容字符串形式 z123|202|10|5
    claimListStr: '',
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      subtodo_id: options.code,
      partner_id: options.partner_id
    });
  },
  onShow: function () {

    this._getDetailBySubid();
    this._getPartenList();
  },

  //点击报工提交   
  claim: function (e) {
    console.log("----claim");
    console.log(e);
    var that = this;
    if (that.data.submitting) {
      return;
    }

    if (!that.data.todo) {
      wx.showModal({
        showCancel: false,
        content: '页面加载错误'
      })
    }

    if (!that.checkInput(e.detail.value)) {
      return
    }

    var claimListStr = getList(e.detail.value);

    function getList(data) {
      var tempArr = [];
      var partner = that.data.partner;
      var qualifiedNum = 'qualifiedNum';
      var disqualifiedNum = 'disqualifiedNum';
      for (var i = 0; i < partner.length; i++) {
        var tempStr = '';
        var qualifiedNumIndex = qualifiedNum + i;
        var disqualifiedNumIndex = disqualifiedNum + i;
        tempStr += that.data.subtodo_id
          + '|'
          + partner[i].user_id
          + '|'
          + data[qualifiedNumIndex]
          + '|'
          + data[disqualifiedNumIndex]
          + '|'
          + that.data.todo.subtodo_plannumber
          + '|'
          + partner[i].partner_id;
        tempArr.push(tempStr);
      }
      return tempArr.join(';')
    }

    console.log("-----")
    console.log(claimListStr);

    wx.showModal({
      content: '是否确认报工?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that._dosubmit(claimListStr);
        }
        if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

    // wx.showModal({
    //   content: '是否确认报工?',
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //       if (parseInt(disqualifiedNum) > 0) {
    //         wx.navigateTo({
    //           url: 'disqreaon?disqnum=' + disqualifiedNum + '&qnum=' + qualifiedNum + '&subtodo_id=' + that.data.subtodo_id
    //         })
    //       } else if (parseInt(disqualifiedNum) == 0) {
    //         that._dosubmit(disqualifiedNum, qualifiedNum);
    //       }
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
  },
  //输入验证
  checkInput: function (data) {
    const that = this;
    if (typeof data === 'object') {
      let qualifiedNum = 'qualifiedNum';
      let disqualifiedNum = 'disqualifiedNum';
      for (let i = 0; i < that.data.partner.length; i++) {
        const qk = qualifiedNum + i;
        const dk = disqualifiedNum + i;
        if (data[qk] == '') {
          wx.showModal({
            content: '请输入合格数',
            showCancel: false
          })
          return
        }
        if (isNaN(data[qk])) {
          wx.showModal({
            content: '合格数只能输入数字',
            showCancel: false
          })
          return
        }
        if (data[dk] == '') {
          wx.showModal({
            content: '请输入不合格数',
            showCancel: false
          })
          return
        }
        if (isNaN(data[dk])) {
          wx.showModal({
            content: '不合格数只能输入数字',
            showCancel: false
          })
          return
        }
      }
      return true
    } else {
      return false
    }
  },

  //获取要报工子派工单信息（复用）
  _getDetailBySubid: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true
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
          });
        } else {
          that.setData({
            todo: null
          });
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },

  //获取报工单的多人报工信息
  _getPartenList: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    app.admx.request({
      url: app.config.service.getPartenList,
      data: {
        subtodo_id: that.data.subtodo_id,
        partner_id: that.data.partner_id
      },
      succ: function (res) {
        wx.hideLoading();
        console.log(res);
        if (res[0]) {
          that.setData({
            partner: res,
          });
        } else {
          that.setData({
            partner: null
          });
        }
      },
      // complete: function (res) {
      //   wx.hideLoading();
      // }
    })
  },


  //内部方法，提交报工单
  _dosubmit: function (option) {
    var that = this;
    this.setData({
      submitting: true
    })
    app.admx.request({
      url: app.config.service.saveClaim,
      data: {
        claimListStr: option
      },
      succ: function (res) {
        console.log(res);
        if (!res) {
          app.refreshCofing.todolist = true;
          wx.showToast({
            title: '报工成功'
          })
          setTimeout(function () {
            // wx.redirectTo({
            //   url: '/pages/empapp/index',
            // });
            wx.navigateBack({
              delta: 2
            })
          }, 1000)

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

      }
    })
  }
})