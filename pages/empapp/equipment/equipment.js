var app = getApp();
Page({
  data: {
    equip: null,
    equipcode:"E",
    claimid:null,
    submitting: false
  },
  onLoad:function(options){
    console.log(options);
    if (options== null || options.claimid == null){
      wx.showModal({
        showCancel: false,
        content: '页面加载错误',
      })
    }else{
      this.setData({
        claimid: options.claimid
      })
    }
  },
  //当手动输入设备编号时，自动设备信息
  equipCodeInput: function (e) {
    var code = e.detail.value;
    if(code.length == 0){
      this.setData({
        equipcode:'E'
      }) 
    }
    console.log(code);
    if (code && code.length >= 7) {
      this.setData({
        inputCode: code
      })
      this._getEquipByCode(code)
    }
  },
  //点击确定
  doSubmit: function (e) {
    var that = this;
    if (this.data.submitting) {
      return;
    }
    if (that.data.claimid == '' || that.data.claimid == null) {
      wx.showModal({
        content: '页面加载错误',
        showCancel: false
      });
      return
    }
    if (that.data.equip == null || that.data.equip.id == null) {
      wx.showModal({
        content: "没有找到设备信息",
        showCancel: false
      });
      return
    }
    
    this.setData({
      submitting: true
    })
    app.admx.request({
      url: app.config.service.addEquip,
      data: {
        equipid: that.data.equip.id,
        claimid:that.data.claimid
      },
      succ: function (res) {
        if (res.primarykey && res.primarykey > 0) {
          app.refreshCofing.equiplist = true;
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
        })
      }
    })
  },
  //根据设备编号查设备信息
  _getEquipByCode:function(code){
    var that = this;
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    app.admx.request({
      url: app.config.service.getEquipByCode,
      data: {
        code: code
      },
      succ: function (res) {
        if (res.list[0]) {//如果返回了派出工
          that.setData({
            equip: res.list[0]
          });
        } else {
          wx.showModal({
            content: '没有找到设备信息,请确认编号' + that.data.inputCode + "是否正确",
          })
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  }

})