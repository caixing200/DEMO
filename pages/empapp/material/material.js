//派工单报工模块中，子派工单详细信息中扫描物料🐴后弹出的窗口
var app = getApp();
Page({
  data: {
    code: null,
    material: null,
    materialcode: 'W',
    claimid: null,
    batchno: null,
    peruse : null,
    submitting: false
  },
  onLoad: function (options) {
    console.log(options);
    if (options == null) {
      wx.showModal({
        showCancel: false,
        content: '页面加载错误',
      })
      return;
    }
    if (options.claimid) {
      this.setData({
        claimid: options.claimid
      })
    }
    if (options.code) {//如果是扫描过来的有code
      this.setData({
        materialcode: options.code
      })
      this._getMaterialByCode(options.code);
    }
  },
  //当手动输入设备编号时，自动设备信息
  autoFill: function (e) {
    var code = e.detail.value;
    if (code.length == 0) {
      this.setData({
        materialcode: 'W'
      })
    }
    console.log(code);
    if (code && code.length >= 7) {
      this.setData({
        inputCode: code
      })
      this._getMaterialByCode(code)
    }
  },
  //记录批次号信息
  batchnoInput:function(e){
    this.setData({
      batchno: e.detail.value
    });
  },

  //记录单件用量
  peruseInput:function(e){
    this.setData({
      peruse: e.detail.value
    });

  },
  //扫批次号
  scanBatchno: function () {
    console.log("--scanBatchno");
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res)
        that.setData({
          batchno: res.result
        });
      },
      fail: (res) => {
        wx.showModal({
          content: '请扫批次号',
          showCancel: false
        })
      }
    });
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
    if (that.data.material == null || that.data.material.id == null) {
      wx.showModal({
        content: "没有找到物料信息",
        showCancel: false
      });
      return
    }
    /**if (that.data.batchno == null) {
      wx.showModal({
        content: "请扫批次号",
        showCancel: false
      });
      return
    }**/

    this.setData({
      submitting: true
    })
    app.admx.request({
      url: app.config.service.addMaterial,
      data: {
        materialid: that.data.material.id,
        claimid: that.data.claimid,
        batchno: that.data.batchno
      },
      succ: function (res) {
        if (res.primarykey && res.primarykey > 0) {
          app.refreshCofing.materiallist = true;
          console.log("---back");
          console.log(app.refreshCofing);
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
  //根据设备物料查设备信息
  _getMaterialByCode: function (code) {
    var that = this;
    wx.showLoading({
      title: 'loading',
    })
    app.admx.request({
      url: app.config.service.getMaterialByCode,
      data: {
        code: code
      },
      succ: function (res) {
        if (res.list[0]) {//如果返回了派出工
          that.setData({
            material: res.list[0]
          });
        } else {
          wx.showModal({
            content: '没有找到物料信息,请确认编号' + that.data.inputCode + "是否正确",
          })
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  }

})