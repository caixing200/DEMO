//子派工单详细信息
var app = getApp()

Page({
  data: {
    //微信用户信息
    wxUserInfo: null,
    //app用存储的员工信息
    appuserinfo: null,
    //进行中的派工单信息
    doinglist: {},
    //前端存子派工单ID
    subtodo_id: '',
    //前端存该报工单的本次计划数,带到报工页面中
    plannum: '',
    //存子派工单详细信息
    todo: {},
    //存已完成/已取消的报工单列表
    todolist: {},
    materiallist: [],
    scrollViewHeight: 400,
    equiplist: [],
  },

  onLoad: function (options) {

    console.log("---onshow:" + options);
    var that = this;
    that.setData({
      subtodo_id: options.code,
    })
    console.log(app.Session.get());
    console.log(options.code);
    app.getUserInfo(function (wxUserInfo) {
      var session = app.Session.get();
      session.wxUserInfo = wxUserInfo;
      app.Session.set(session);
      //更新数据
      that.setData({
        wxUserInfo: wxUserInfo,
        appuserinfo: app.Session.get().user
      })
    })
    //重置
    if (that.data.todo == null) {
      this.setData({
        materiallist: [],
        equiplist: []
      });
    }
    this._getTodo();
  },


  onShow: function (options) {
    console.log("---onshow:" + app.refreshCofing);
    console.log(app.refreshCofing);                     //全局变量，如果手动输入信息
    if (app.refreshCofing.todolist) {
      this._getDetailBySubid();
      app.refreshCofing.todolist = false;
    }
    if (app.refreshCofing.equiplist) {
      app.refreshCofing.equiplist = false;
      this._getEquipList();
    }
    if (app.refreshCofing.materiallist) {
      app.refreshCofing.materiallist = false;
      this._getMaterialList();
    }
  },

  //扫设备
  scanEquip: function () {
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res)
        if (res.scanType == 'QR_CODE') {
          //得到设备编号
          var code = res.result;
          that._getEquipByCode(code, that.addEquipment);
        }
      },
      fail: (res) => {
        wx.showModal({
          content: '请扫设备二维码',
          showCancel: false
        })
      }
    });
  },

  //扫物料
  scanMaterial: function () {
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res)
        if (res.scanType == 'QR_CODE') {
          //得到物料编号
          var code = res.result;
          wx.navigateTo({
            url: './material/material?code=' + code + "&claimid=" + that.data.todo.claimid
          })
        }
      },
      fail: (res) => {
        wx.navigateTo({
          url: './material/material'
        })
      }
      /*
        success: (res) => {
        console.log(res)
        if (res.scanType == 'QR_CODE') {
          //得到物料编号
          var code = res.result;
          wx.navigateTo({
            url: './material/material?code=' + code + "&claimid=" + that.data.todo.claimid
          })
        }
      },
      fail: (res) => {
        wx.showModal({
          content: '请扫物料二维码',
          showCancel: false
        })
      }
      */
    });
  },

  //点“报工按扭”（将子派工单ID，以及填写的本次计划数传给报工页面）
  claim: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../claim/claim?code=' + that.data.subtodo_id     // + '&plannum=' + that.data.plannum  先放着这个问题
    })
  },

  //查看物料清单
  look: function () {
    wx.navigateTo({
      url: '../material_list/material_list'
    })
  },
  //查看工友请求列表
  partner: function () {
    wx.navigateTo({
      url: '../partner_list/partner_list'
    })
  },

  //点击取消报工按扭 (cancelClaim)
  cancel: function () {
    var that = this;
    wx.showModal({
      content: '确定要取消本次派工单?',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '操作中...',
          })
          app.admx.request({
            url: app.config.service.cancelClaim,
            data: {
              subtodo_id: that.data.subtodo_id,
            },
            succ: function (res) {
              if (res.effect > 0) {
                wx.showToast({
                  title: '取消成功'
                })
                that.setData({
                  todo: null,
                  materiallist: [],
                  equiplist: []
                });
              }
            },
            complete: function () {
              wx.navigateTo({
                url: '../index',
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  //获取子报工单详细信息,但是不查设备、物料(getDetailBySubID)
  _getDetailBySubid: function (succCallBack) {
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
        if (res) {
          console.log(res[0]);
          //如果返回了派出单
          that.setData({
            todo: res[0],
            todolist: null
          });
          if (succCallBack) {
            succCallBack();
          }
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

  //获取正在进行中的派工单
  _getTodo: function () {
    var that = this;
    this._getDetailBySubid(function () {
      console.log("----call back..........")
      //that._getEquipList();
     // that._getMaterialList();
    })
  },

  //获取正在进行中的派工单的相关设备
  _getEquipList: function () {
    var that = this;
    app.admx.request({
      url: app.config.service.equiplist,
      data: {
        claimid: that.data.todo.claimid
      },
      succ: function (res) {
        if (res.list) {//如果返回了派出工
          that.setData({
            equiplist: res.list
          });
        }
      }
    })
  },

  //获取正在进行中的派工单的物料列表
  _getMaterialList: function () {
    console.log("-------------_getMaterialList");
    var that = this;
    app.admx.request({
      url: app.config.service.materiallist,
      data: {
        claimid: that.data.todo.claimid
      },
      succ: function (res) {
        if (res.list) {//如果返回了派出工
          that.setData({
            materiallist: res.list
          });
        }
      }
    })
  },

  //根据设备编号查设备
  _getEquipByCode: function (code, succCallBack) {
    if (code.indexOf("E") != 0) {
      wx.showToast({
        title: '请扫正确的设备二维码'
      })
      return;
    }
    var that = this;
    wx.showLoading({
      title: '加载中...'
    })
    app.admx.request({
      url: app.config.service.getEquipByCode,
      data: {
        code: code
      },
      succ: function (res) {
        if (res.list[0]) {//如果返回了派出工
          succCallBack(res.list[0]);
        } else {
          wx.showModal({
            content: '设备信息不存在',
            showCancel: false
          })
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },

  //添加相关设备
  addEquipment: function (equip) {
    console.log("----addEquipment");
    console.log(equip);
    var that = this;
    app.admx.request({
      url: app.config.service.addEquip,
      data: {
        equipid: equip.id,
        claimid: that.data.todo.claimid
      },
      succ: function (res) {
        if (res.primarykey && res.primarykey > 0) {
          var equiplistTemp = that.data.equiplist;
          console.log(equiplistTemp);
          equiplistTemp.push(equip);
          that.setData({
            equiplist: equiplistTemp
          });
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

  //手动输入物料
  inputMaterial: function () {
    var that = this;
    wx.navigateTo({
      url: '../material/material?claimid=' + that.data.todo.claimid
    })
  },
  //手动输入设备
  inputEquip: function () {
    var that = this;
    wx.navigateTo({
      url: '../equipment/equipment?claimid=' + that.data.todo.claimid
    })
  },

})