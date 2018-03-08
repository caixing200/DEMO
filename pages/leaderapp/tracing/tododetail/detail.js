var app = getApp();
Page({
  data: {
    todo: null
  },
  onLoad: function (options) {
    console.log(options);
    console.log(options);
    if (options && options.todo) {
      this.setData({
        todo: JSON.parse(options.todo)
      })
      this._getClaim(this.data.todo.id);
    } else {
      wx.showModal({
        showCancel: false,
        content: '页面加载错误'
      })
    }
  },
  //获取正在进行中的派工单
  _getClaim: function (claimid) {
    var that = this;
    this._getClaimMainInfo(claimid,function(){
      that._getEquipList();
      that._getMaterialList();
    })
  },
  //只获取报工单主信息,不查设备、物料
  _getClaimMainInfo: function (claimid,succCallback) {
    var that = this;
    wx.showLoading({
      title: '正在加载',
    });
    app.admx.request({
       //url: app.config.service.getclaimdetail,
      url: app.config.service.queryclaimdetail,
      data: {
        claimid: claimid
      },
      succ: function (res) {
        console.log('cccc000...'+res[0].name);
        console.log('cssadas' + JSON.stringify(res[0].claim));
        if (res[0]) {
          //如果返回了派出单
          that.setData({
            username: res[0].name,
            claim: res[0].claim
          });
          if (succCallback){
            succCallback();
          }
        } else {
          that.setData({
            claim: null
          });
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },
  //获取正在进行中的派工单的相关设备
  _getEquipList: function () {
   
    var that = this;
    app.admx.request({
      url: app.config.service.equiplist,
      data: {
         claimid: that.data.claim.id
        //claimid:141
      },
      succ: function (res) {
        console.log('ppspspspps....' + JSON.stringify(res));
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
        claimid: that.data.claim.id
        //claimid:141
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
  tracingEquipment:function(e){
    //app.config.service.equiprdetail.replace("{id}", id)
    wx.redirectTo({
      url: '../equipment/equipment?id='+e.currentTarget.dataset.index
    })
  }
})