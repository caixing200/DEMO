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
    //存派工单号
    //code
    todo: null,
    //存已完成/已取消的报工单列表
    todolist: {},
    materiallist: [],
    scrollViewHeight: 400,
    equiplist: [],
    tabActiveClass: ['active', '', '']
  },


  //点“同意”按钮
  agree: function () {
    wx.showModal({
      content: '确定同意王一加入生产?',
    })
  },

  //点“同意”按钮
  refuse: function () {
    wx.showModal({
      content: '确定拒绝王一加入生产?',
    })
  },
 

})