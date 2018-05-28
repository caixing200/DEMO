App       ({
  admx: require("./lib/admx-sdk/admx.js"),
  config: require("./config.js"),
  Session: require("./lib/admx-sdk/lib/session.js"),
  common: require("./util/common"),
  Array: require("./util/array"),
  wxCharts: require('./lib/wxcharts/wxcharts.js'),
  dateUtil: require('./util/dateUtil.js'),
  utils: function () {
    return this.admx.utils
  },


  refreshCofing: {
    //控制报工页中正在进行中的派工单刷新
    "todolist": false,
    //控制报工页中正在进行中的派工单相关设备刷新
    "equiplist": false,
    //控制报工页中正在进行中的派工单相关物料刷新
    "materiallist": false
  },
  //筛选条件
  filters:{
    //销售订单中正行中
    orders_ongoing:null,
    //销售订单已取消
    orders_canceled:null,
    //销售订单已完成
    orders_finished:null,
    //销售订单待排产
    orders_awaiting:null,

    //计划正行中
    plan_ongoing: null,
    //计划已完成
    plan_finished: null,
    //计划已取消
    plan_canceled: null,
  },
  search_result: [],
  search_history: [],
  globalData: {
    systemInfo: null,
    wxUserInfo: null,
    company: null,
    detailData: null,
    todoData: null,
  },
  onLaunch: function () {
    var that = this;
    //调用API从本地缓存中获取数据
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.globalData.systemInfo = res;
      },
    });

    this.getCompnayInfo();
  },
  onShow: function(){
    const that = this;

  },
  // lazy loading openid
  getUserInfo: function (cb) {
    var that = this
    if (that.globalData.userInfo) {
      typeof cb == "function" && cb(that.globalData.wxUserInfo);
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.wxUserInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.wxUserInfo)
            }
          })
        }
      })
    }
  },
  //获取公司信息
  getCompnayInfo: function () {
    var that = this;
    this.admx.request({
      url: this.config.service.getcompinfo,
      succ: function (res) {
        console.log("获取公司信息");
        console.log(res);
        if (res.list[0]) {
          that.globalData.company = res.list[0]
        }
      }
    });
  },

  //定期获取session
  getSession: function(){
    
  }

})