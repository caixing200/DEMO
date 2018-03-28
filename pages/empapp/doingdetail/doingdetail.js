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
    equiplistBox: [],
    isOwner: true,
    moveX: 0,
    isImage: true,
  },

  // 设备相关功能
  //扫设备
  scanEquip: function () {
    var that = this;
    if(that.data.state === '1'){
      wx.scanCode({
        success: (res) => {
          console.log(res)
          if (res.scanType == 'QR_CODE') {
            //得到设备编号
            var code = res.result;
            //code = 'E000112';//测试用
            that._getEquipByCode(code, that.data.todo.subtodo_id);
          }else {
            wx.showModal({
              content: '不是正确的二维码',
               showCancel: false
            })
          }
        },
        fail: (res) => {
          wx.showModal({
            content: '请扫设备二维码',
            showCancel: false
          })
        }
      });
    }else {
      wx.showToast({
        title: '无法操作',
        mask: true,
        icon: 'loading',
        duration: 1000
      })
    }
  },
  //获取正在进行中的派工单的相关设备
  // _getEquipList: function () {
  //   var that = this;
  //   app.admx.request({
  //     url: app.config.service.equiplist,
  //     data: {
  //       claimid: that.data.todo.claimid
  //     },
  //     succ: function (res) {
  //       if (res.list) {//如果返回了派出工
  //         that.setData({
  //           equiplist: res.list
  //         });
  //       }
  //     }
  //   })
  // },
  //根据设备编号查设备
  _getEquipByCode: function (code, id) {
    if (code.indexOf("E") != 0) {
      wx.showToast({
        title: '请扫正确的设备二维码',
        mask: true,
        icon: 'loading',
        duration: 2000
      })
      return;
    }
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    console.log(code);
    app.admx.request({
      url: app.config.service.getEquipByCode,
      data: {
        equip_code: code,
        subtodo_id: id
      },
      succ: function (res) {
        console.log(res);
        if (!res) {//
          //succCallBack(res.list[0]);
          wx.showModal({
            content: '已成功添加设备',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.resetEquipList()
              }
            }
          })
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
  //获取设备列表
  getEquipList: function () {
    const that = this;
    if (that.data.equiplist.length > 0) {
      that.setData({
        equiplist: []
      })
    } else {
      that.resetEquipList()
    }
  },
  //刷新设备列表
  resetEquipList: function () {
    const that = this;
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    app.admx.request({
      url: app.config.service.getEquipListBySubtodoId,
      data: {
        subtodo_id: that.data.subtodo_id
      },
      succ: function (res) {
        console.log(res);
        if (res) {//如果返回了派出工
          that.setData({
            equiplist: res,
            moveX: 0
          });
        }
        if (res.length == 0) {
          // wx.showToast({
          //   title: '没有设备',
          //   icon: 'loading',
          //   duration: 800
          // })
          that.setData({
            equiplist: []
          })
        }
      }
    })
  },
  //删除设备
  deleteEquip: function (e) {
    const that = this;
    console.log(e);
    if(that.data.state === '1'){
      app.admx.request({
        url: app.config.service.removeEquip,
        data: {
          subtodo_equip_id: e.target.dataset.equipid
        },
        succ: function (res) {
          console.log(res);
          if (!res) {//如果返回了派出工
            wx.showModal({
              content: '成功删除设备',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.resetEquipList()
                }
              }
            })
          } else {
            wx.showModal({
              content: '删除设备失败',
              showCancel: false
            })
          }
        }
      })
    }else {
      wx.showToast({
        title: '无法操作',
        mask: true,
        icon: 'loading',
        duration: 1000
      })
    }
  },

  //物料相关功能
  //扫物料
  scanMaterial: function () {
    var that = this;
    if(that.data.state === '1'){
      wx.scanCode({
        success: (res) => {
          console.log(res)
          if (res.scanType == 'QR_CODE') {
            //得到物料编号
            var code = res.result;
            if (code.indexOf("W") != 0) {
              wx.showToast({
                title: '请扫正确的设备二维码',
                mask: true,
                icon: 'loading',
                duration: 2000
              })
              return;
            }
            //code = 'W000142';
            wx.navigateTo({
              url: '../material/material?code=' + code + "&subtodo_id=" + that.data.todo.subtodo_id + '&subtodo_plannumber=' + that.data.todo.subtodo_plannumber
            })
          } else {
            wx.showModal({
              content: '不是正确的二维码',
              showCancel: false
            })
          }
        },
        fail: (res) => {
          // wx.navigateTo({
          //   url: './material/material'
          // })
        }
      });
    }else {
      wx.showToast({
        title: '无法操作',
        mask: true,
        icon: 'loading',
        duration: 1000
      })
    }
  },
  //获取正在进行中的派工单的物料列表
  _getMaterialList: function () {
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
  //获取物料列表
  getMaterialList: function () {
    const that = this;
    if (that.data.materiallist.length > 0) {
      that.setData({
        materiallist: []
      })
    } else {
      that.resetMateriallist()
    }
  },
  //刷新物料列表
  resetMateriallist: function () {
    const that = this;
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    app.admx.request({
      url: app.config.service.getMaterialListBySubcode,
      data: {
        subtodo_id: that.data.subtodo_id
      },
      succ: function (res) {
        console.log(res);
        if (res) {//如果返回了派出工
          that.setData({
            materiallist: res,
            moveX: 0
          });
        }
        if (res.length == 0) {
          // wx.showToast({
          //   title: '没有物料',
          //   icon: 'loading',
          //   duration: 800
          // })
          that.setData({
            materiallist: []
          })
        }
      }
    })
  },
  //删除物料
  deleteMaterial: function (e) {
    const that = this;
    console.log(e);
    if(that.data.state === '1'){
      app.admx.request({
        url: app.config.service.removeMaterial,
        data: {
          subtodo_m_id: e.target.dataset.mid
        },
        succ: function (res) {
          console.log(res);
          if (!res) {//如果返回了派出工
            wx.showModal({
              content: '成功删除物料',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.resetMateriallist()
                }
              }
            })
          } else {
            wx.showModal({
              content: '删除物料失败',
              showCancel: false
            })
          }
        }
      })
    }else {
      wx.showToast({
        title: '无法操作',
        mask: true,
        icon: 'loading',
        duration: 1000
      })
    }
  },
  //更新物料
  updateMaterial: function (e) {
    const that = this;
    if (that.data.state === '1'){
      wx.navigateTo({
        url: '../material/material?material_code=' + e.target.dataset.m_code + '&subtodo_m_id=' + e.target.dataset.subtodo_m_id + '&material_name=' + e.target.dataset.m_name + '&m_model=' + e.target.dataset.m_model,
      })
    }else {
      wx.showToast({
        title: '无法操作',
        mask: true,
        icon: 'loading',
        duration: 1000
      })
    }
    
  },

  //二维码功能
  createQRcode: function (e) {
    const that = this;
    that.setData({
      isImage: false,
      imagePath: app.config.service.getSubtodoQrcode + '/' + that.data.todo.subtodo_code,
    })
  },
  closeImage: function(){
    const that = this;
    that.setData({
      isImage: true
    })
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      subtodo_id: options.code,
      owner: options.owner,
      state: options.state
    },()=>{
      that.resetEquipList();
      that.resetMateriallist();
    })
    console.log(options);
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
    const that = this;
    if (app.refreshCofing.materiallist) {
      that.resetMateriallist();
      app.refreshCofing.materiallist = false;
    }
    // if (that.data.equiplist.length > 0 && that.data.todo.subtodo_id) {
    //   // that.resetEquipList()
    // }
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
  cancel: function (e) {
    var that = this;
    if (e.target.dataset.state === '1') {
      wx.showModal({
        content: '确定要取消本次派工单?',
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '操作中...',
              mask: true
            })
            app.admx.request({
              url: app.config.service.cancelClaim,
              data: {
                subtodo_id: that.data.subtodo_id,
              },
              succ: function (res) {
                if (!res) {
                  wx.showToast({
                    title: '取消成功',
                    mask: true,
                    duration: 1000,
                    success: function(){
                      setTimeout(function(){
                        wx.navigateBack({
                          delta: 1
                        })
                      },1000)
                    }
                  })
                }else {
                  wx.showModal({
                    content: '操作失败，请重试',
                    showCancel: false
                  })
                }
              },
              // complete: function () {
              //   wx.navigateTo({
              //     url: '../index',
              //   })
              // }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },


  //获取子报工单详细信息,但是不查设备、物料(getDetailBySubID)
  _getDetailBySubid: function (succCallBack) {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    app.admx.request({
      method: 'get',
      url: app.config.service.todo.replace("{subtodo_id}", that.data.subtodo_id),
      succ: function (res) {
        if (res) {
          console.log(res[0]);
          //如果返回了派出单
          that.setData({
            todo: res[0],
            todolist: null,
            isOwner: res[0].owner === that.data.owner ? false : true,//测试用
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
    this._getDetailBySubid()
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