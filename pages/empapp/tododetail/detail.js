//已报工派工单详情
var app = getApp();
Page({
  data: {
    focus: false,
    claim: null,
    equiplist:null,
    username:'',
    materiallist:null,
    isOwner: false,
    owner: '',
  },
  onLoad: function (options) {
    console.log(options);
    if (options) {
      this.setData({
        username: options.user,
        claim_id: options.claimid,
        owner: options.owner
      })
      this._getClaim(options.claimid);
    } else {
      wx.showModal({
        showCancel: false,
        content: '页面加载错误',
        success: function(res){
          if(res.confirm){
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  },
  //获取正在进行中的派工单
  _getClaim: function (claim_id) {
    var that = this;
    this._getClaimMainInfo(claim_id,function () {
      //console.log("----call back..........")
      //that._getEquipList();
      //that._getMaterialList();
    })
  },
  //只获取报工单主信息,不查设备、物料
  _getClaimMainInfo: function (claim_id,succCallBack) {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    app.admx.request({
      url: app.config.service.getAllClaimed,
      data: {
        claim_id: claim_id
      },
      succ: function (res) {
        wx.hideLoading();
        console.log(res);
        if (res.list[0]) {
          //如果返回了派出单
          that.setData({
            claim: res.list,
            isOwner: res.list[0].owner === that.data.owner?true:false
          });
          if (succCallBack) {
            succCallBack();
          }
        } else {
          wx.showModal({
            content: '没有已报工信息，点击返回上一页',
            showCancel: false,
            success: function(res){
              if(res.confirm){
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
          that.setData({
            claim: null
          });
        }
      },
      // complete: function (res) {
      //   wx.hideLoading();
      // }
    })
  },
  //获取正在进行中的派工单的相关设备
  // _getEquipList: function () {
  //   var that = this;
  //   app.admx.request({
  //     url: app.config.service.equiplist,
  //     data: {
  //       claimid: that.data.claim.claim_id
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
  //获取正在进行中的派工单的物料列表
  // _getMaterialList: function () {
  //   console.log("-------------_getMaterialList");
  //   var that = this;
  //   app.admx.request({
  //     url: app.config.service.materiallist,
  //     data: {
  //       claimid: that.data.claim.claim_id
  //     },
  //     succ: function (res) {
  //       if (res.list) {//如果返回了派出工
  //         that.setData({
  //           materiallist: res.list
  //         });
  //       }
  //     }
  //   })
  // },
  //点击撤回按钮
  withdraw: function (e) {
    var that = this;
    wx.showModal({
      content: '确定要撤回本次报工单?',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '操作中...',
            mask: true
          })
          app.admx.request({
            url: app.config.service.retreatClaim,
            data: {
              claim_id: e.target.dataset.claim_id,
              subtodo_id: e.target.dataset.subtodo_id
            },
            succ: function (res) {
              console.log(res);
              if (!res) {
                wx.showToast({
                  title: '取消成功',
                  mask: true,
                  duration: 1000,
                  success: function(){
                    that._getClaimMainInfo(that.data.claim_id)
                  }
                })
                // that.setData({
                //   todo: null,
                //   materiallist: [],
                //   equiplist: []
                // });
              }
            },
            // complete: function () {
            //   wx.hideLoading();
            //   wx.navigateTo({
            //     url: '/pages/empapp/index'
            //   });
            // }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

})