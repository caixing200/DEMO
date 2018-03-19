//子派工单详细信息
var app = getApp();
Page({
  data:{
    //微信用户信息
    wxUserInfo: null,
    //app用存储的员工信息
    appuserinfo: null,
    //存工友信息
    PartnerList: {},
    // PartnerList: [{partner_id:202, partner_name: '王五', partner_subtodo: 'Z1234567', partner_state: 0 },
    //               {partner_id:101, partner_name: '张三', partner_subtodo: 'Z1234567', partner_state: 1}, 
    //               {partner_id:303, partner_name: '李四', partner_subtodo: 'Z1234567', partner_state: 2}],
    scrollViewHeight: 400,
  },
  onShow: function () {

     this._getCurrentPartnerList();

  },


  //点“同意”按钮 同意为1，拒绝为0
  agree: function (e) {
    const that = this;
    console.log(e.target)
    wx.showModal({
      content: '确定同意' + e.target.dataset.partner_name+'加入生产?',   
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '操作中...',
            mask: true
          })
          app.admx.request({
            url: app.config.service.updatePartner,
            data: {
              partner_id: e.target.dataset.partner_id,
              answer:'1'
            },
            succ: function (res) {
              if(!res){
                that._getCurrentPartnerList();
              }else {
                wx.showModal({
                  content: '未能将对方加入订单身产，请重试',
                  showCancel: false
                })
              }
            },
          })   
        }
        if (res.cancel) {
        }
      }
    })
  },

  //点“拒绝”按钮
  refuse: function (e) {
    const that = this;
    wx.showModal({
      content: '确定拒绝' + e.target.dataset.partner_name +'加入生产?',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '操作中...',
            mask: true
          })
          app.admx.request({
            url: app.config.service.updatePartner,
            data: {
              partner_id: e.target.dataset.partner_id,
              answer: '-1'
            },
            succ: function (res) {
              console.log(res)
              if(!res){
                that._getCurrentPartnerList();
              }else {
                wx.showModal({
                  content: '未能拒绝对方，请重试',
                  showCancel: false
                })
              }
            }
          })      
        }
        if (res.cancel) {
        }
      }
    })
  },

  //打开工友请求列表
  _getCurrentPartnerList: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    app.admx.request({
      url: app.config.service.PartnerList,//辅工的请求列表输出为主工的
      data: {
      },
      succ: function (res) {
        console.log(res);//
        if (res[0]) {
          //如果返回了派出单
          that.setData({
            PartnerList: res,
          });
        } else {
          that.setData({
            PartnerList: []
          });
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },
 
})