//派工单报工模块中，子派工单详细信息中扫描物料🐴后弹出的窗口
var app = getApp();
Page({
  data: {
    code: null,
    material: null,
    materialcode: '',
    subtodo_id: null,
    batchno: null,
    peruse: null,
    submitting: false
  },
  onLoad: function (options) {
    console.log(options);
    const that = this;
    if (options.code) {//如果是扫描过来的有code
      that.setData({
        subtodo_id: options.subtodo_id,
        isCode: true,
        subtodo_plannumber: options.subtodo_plannumber
      }, () => {
        that._getMaterialByCode(options.code);
      })
    } else {
      const data = {};
      data.material_code = options.material_code;
      data.material_name = options.material_name;
      data.m_model = options.m_model;
      data.subtodo_m_id = options.subtodo_m_id;
      that.setData({
        material: data,
        isCode: false
      });
      console.log(that.data.material)
    }
  },
  //当手动输入设备编号时，自动设备信息
  // autoFill: function (e) {
  //   var code = e.detail.value;
  //   if (code.length == 0) {
  //     this.setData({
  //       materialcode: ''
  //     })
  //   }
  //   console.log(code);
  //   if (code && code.length >= 7) {
  //     this.setData({
  //       inputCode: code
  //     })
  //     this._getMaterialByCode(code)
  //   }
  // },
  //记录批次号信息
  batchnoInput: function (e) {
    this.setData({
      batchno: e.detail.value.batchno
    });
  },

  //记录单件用量
  peruseInput: function (e) {
    this.setData({
      peruse: e.detail.value.peruse
    });

  },
  //扫批次号
  // scanBatchno: function () {
  //   console.log("--scanBatchno");
  //   var that = this;
  //   wx.scanCode({
  //     success: (res) => {
  //       console.log(res)
  //       that.setData({
  //         batchno: res.result
  //       });
  //     },
  //     fail: (res) => {
  //       wx.showModal({
  //         content: '请扫批次号',
  //         showCancel: false
  //       })
  //     }
  //   });
  // },
  //点击确定
  doSubmit: function (e) {
    console.log(e);
    var that = this;
    if (this.data.submitting) {
      return;
    }
    const batchno = e.detail.value.batchno;
    // if (batchno === '') {
    //   wx.showModal({
    //     content: "请填写批次号",
    //     showCancel: false
    //   });
    //   return
    // }
    const peruse = e.detail.value.peruse;
    if (peruse === '') {
      wx.showModal({
        content: "请填写单件用量",
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
    if (that.data.isCode) {
      // const ratio = ((that.data.subtodo_plannumber - 0) / (peruse - 0)).toFixed(3);
      const ratio = ((peruse - 0)/1).toFixed(3);
      // console.log(that.data.subtodo_plannumber);
      // console.log(peruse);
      // console.log(ratio);
      app.admx.request({
        url: app.config.service.addMaterial,
        data: {
          batchno: batchno,
          m_model: that.data.material.m_model,
          subtodo_id: that.data.subtodo_id,
          m_id: that.data.material.m_id,
          m_num: peruse,
          m_ratio: ratio
        },
        succ: function (res) {
          console.log(res);
          if (!res) {
            wx.showModal({
              content: '物料添加成功',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  app.refreshCofing.materiallist = true;
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          } else {
            wx.showModal({
              content: '物料添加失败，请重试',
              showCancel: false
            })
          }
          // if (res.primarykey && res.primarykey > 0) {
          //   app.refreshCofing.materiallist = true;
          //   console.log("---back");
          //   console.log(app.refreshCofing);
          //   wx.navigateBack();
          // } else {
          //   wx.showModal({
          //     content: "操作失败",
          //     showCancel: false
          //   })
          // }
        },
        complete: function (res) {
          that.setData({
            submitting: false
          })
        }
      })
    } else {
      app.admx.request({
        url: app.config.service.updateMaterial,
        data: {
          subtodo_m_id: that.data.material.subtodo_m_id,
          batchno: batchno,
          m_num: peruse
        },
        succ: function (res) {
          console.log(res);
          if (!res) {
            wx.showModal({
              content: '物料修改成功',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  app.refreshCofing.materiallist = true;
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          } else {
            wx.showModal({
              content: '物料修改失败，请重试',
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
    }

  },
  //获取物料信息
  _getMaterialByCode: function (code) {
    var that = this;
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    app.admx.request({
      url: app.config.service.getMaterialBySubcode,
      data: {
        m_code: code
      },
      succ: function (res) {
        console.log(res);
        if (res[0]) {
          that.setData({
            material: res[0]
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