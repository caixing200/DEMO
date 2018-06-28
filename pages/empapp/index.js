//派工单报工页面（进行中、已报工、已取消）
var app = getApp()
var utils = app.admx.utils;

Page({
  data: {
    //微信用户信息
    wxUserInfo: null,
    //app用存储的员工信息
    appuserinfo: null,
    //进行中的派工单信息
    doinglist: [],
    //已报工的派工单信息 
    donelist: [],
    //存已完成/已取消的报工单列表    
    scrollViewHeight: 400,
    tabActiveClass: ['active', '', ''],
    pageIndex: 1,
    isUserInfo: true,
    socketTimer: null,
    personNum: 0,
    userid: null,
    userState: true,
    modelState: true
  },

  //数据赋值
  onLoad: function (options) {
    console.log("---onLoad:" + options);
    var that = this;

    app.getUserInfo(function (wxUserInfo) {
      var session = app.Session.get();
      session.wxUserInfo = wxUserInfo;
      app.Session.set(session);
      //更新数据
      that.setData({
        wxUserInfo: wxUserInfo,
        appuserinfo: app.Session.get().user
      })
    });
  },

  //展示页面
  onShow: function (options) {
    const that = this;
    console.log("---onshow:" + app.refreshCofing);
    if(!that.data.userid){
      const session = app.Session.get();
      that.data.userid = session.user.id;
    }
    that.createSocket();
    that.tabShowOnGoing(null, app.config.ClaimState.ongoing);
    wx.onNetworkStatusChange(function(res){
      console.log('change');
      if(res.isConnected){
        that.data.userState = true;
        that.createSocket();
      }
    })
  },
  //获取用户信息
  _setUserInfo: function (data) {
    const that = this;
    console.log(data);
    app.globalData.wxUserInfo = data.detail.userInfo;
    app.getUserInfo(function (wxUserInfo) {
      var session = app.Session.get();
      session.wxUserInfo = wxUserInfo;
      app.Session.set(session);
    });
    that.setData({
      isUserInfo: true
    })
  },
  onHide: function () {
    const that = this;
    that.data.userState = false;
    wx.closeSocket();
    clearTimeout(that.data.socketTimer);
  },
  onUnload: function () {
    const that = this;
    that.data.userState = false;
    wx.closeSocket();
    clearTimeout(that.data.socketTimer);
  },
  //下拉刷新
  lower: function () {
    const that = this;
    let isGetList = null;
    let index = null;
    for (let i = 0; i < that.data.tabActiveClass.length; i++) {
      if (that.data.tabActiveClass[i]) {
        index = i;
        break;
      }
    }
    switch (index) {
      case 0:
        if (that.data.doinglist.length > 9) {
          isGetList = (that.data.doinglist.length % 10) > 0 ? false : true;
          if (isGetList) {
            that._getTodolistByState(utils.extend({
              state: app.config.ClaimState.ongoing,
              currentPage: that.data.pageIndex
            }));
          } else {
            wx.showToast({
              title: '没有更多数据',
              mask: true,
              duration: 1000
            })
          }
        }
        break;
      case 1:
        if (that.data.donelist.length > 9) {
          isGetList = (that.data.donelist.length % 10) > 0 ? false : true;
          if (isGetList) {
            wx.showLoading({
              title: '正在加载',
              mask: true
            });
            app.admx.request({
              url: app.config.service.getAllClaimed,
              data: {
                currentPage: that.data.pageIndex
              },
              succ: function (res) {
                console.log(res);
                if (res.list[0]) {//如果返回了派出工
                  that.setData({
                    donelist: that.data.donelist.concat(res.list),
                    pageIndex: that.data.pageIndex + 1,
                    doinglist: []
                  });
                } else {
                  wx.showToast({
                    title: '没有更多数据',
                    mask: true,
                    duration: 1000
                  })
                }
              },
              complete: function (res) {
                wx.hideLoading();
              }
            });
          } else {
            wx.showToast({
              title: '没有更多数据',
              mask: true,
              duration: 1000
            })
          }
        }
        break;
      case 2:
        if (that.data.doinglist.length > 9) {
          isGetList = (that.data.doinglist.length % 10) > 0 ? false : true;
          if (isGetList) {
            that._getTodolistByState(utils.extend({
              state: app.config.ClaimState.canceled,
              currentPage: that.data.pageIndex
            }));
          } else {
            wx.showToast({
              title: '没有更多数据',
              mask: true,
              duration: 1000
            })
          }
        }
        break;
    }
  },
  //进行中tab
  tabShowOnGoing: function (e, filter) {
    const that = this;
    that.setData({
      tabActiveClass: ['active', '', ''],
      pageIndex: 1,
      doinglist: [],
      donelist: []
    }, () => {
      that._getTodolistByState(utils.extend({
        state: app.config.ClaimState.ongoing,
        currentPage: that.data.pageIndex
      }, filter));
    });
  },

  //已取消TAB
  tabShowCanncel: function (e, filter) {
    const that = this;
    that.setData({
      tabActiveClass: ['', '', 'active'],
      pageIndex: 1,
      doinglist: [],
      donelist: []
    }, () => {
      that._getTodolistByState(utils.extend({
        state: app.config.ClaimState.canceled,
        currentPage: that.data.pageIndex
      }, filter));
    });
  },

  //已报工TAB（不传值获取所有已报工派工单信息）
  tabShowFinished: function (options) {
    const that = this;
    that.setData({
      tabActiveClass: ['', 'active', ''],
      pageIndex: 1,
      doinglist: [],
      donelist: []
    }, () => {
      wx.showLoading({
        title: '正在加载',
        mask: true
      });
      app.admx.request({
        url: app.config.service.getAllClaimed,
        data: {
          //claim_id:"0be2e827-85a6-4c24-aece-11eaeaeaf072"
          currentPage: that.data.pageIndex
        },
        succ: function (res) {
          console.log(res);
          if (res.list[0]) {//如果返回了派出工
            that.setData({
              donelist: res.list,
              pageIndex: that.data.pageIndex + 1,
              doinglist: []
            }, () => {
              console.log(that.data.pageIndex);
            });
          } else {
            that.setData({
              donelist: [],
              doinglist: []
            });
          }
        },
        complete: function (res) {
          wx.hideLoading();
        }
      })
    });
  },

  //获取所有正在进行中的派工单主要信息，同时可获取已取消信息（根据option不同） 
  _getTodolistByState: function (option) {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    app.admx.request({
      url: app.config.service.getTodoByState,
      data: option,
      succ: function (res) {
        console.log("success fasong");
        console.log(option);
        console.log(res);
        if (res.list[0]) {//如果返回了派出工
          that.setData({
            doinglist: that.data.doinglist.concat(res.list),
            pageIndex: that.data.pageIndex + 1,
            donelist: []
          }, () => {
            console.log(that.data.pageIndex);
          });
        } else {
          if (that.data.pageIndex !== 1) {
            wx.showToast({
              title: '没有更多数据',
              mask: true,
              duration: 800,
              icon: 'loading'
            })
          }
          that.setData({
            donelist: []
          });
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },



  //扫描派工单(得到Qrcode即派工单号)
  scanTodo: function () {
    const that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res)
        if (res.scanType == 'QR_CODE') {
          //得到派工单号
          var todocode = res.result;        //子派工单号
          that.data.modelState = false
          //todocode = "Z18032200006";
          wx.navigateTo({
            url: './todo/todo?code=' + todocode + '&owner=' + that.data.appuserinfo.serialNo//         code +'&owner=' + that.data.appuserinfo.serialNo + '&owner_name=' + that.data.appuserinfo.name //测试用
          })
        } else {
          wx.showModal({
            content: '请扫派工单二维码',
            showCancel: false
          })
        }
      },

      fail: (res) => {
        // wx.showModal({
        //   content: '请扫派工单二维码',
        //   showCancel: false
        // })
      }
    });

  },
  //查看工友请求列表
  partner: function () {
    wx.navigateTo({
      url: './partner_list/partner_list'
    })
  },
  //socket
  createSocket: function () {
    const that = this;
    clearTimeout(that.data.socketTimer);
    const wsurl = 'ws://192.168.0.112:8889/ws?userid=' + that.data.userid + '&type=undo';
    console.log(wsurl);
    wx.connectSocket({
      url: wsurl,
      success: function (res) {
        that.listenSocket();
        that.data.modelState = true;
      },
      fail: function (res) {
        clearTimeout(that.data.socketTimer);
        that.data.socketTimer = setTimeout(function () {
          that.createSocket();
        }, 10000)
      }
    });

  },
  listenSocket: function () {
    const that = this;
    wx.onSocketOpen(function () {
      console.log('socket连接打开')
    });
    wx.onSocketError(that.socketErr);
    wx.onSocketClose(that.socketClose);
    wx.onSocketMessage(function (res) {
      const data = JSON.parse(res.data);
      console.log(data);
      //data.undo = 22;
      if (data.undo) {
        const num = data.undo - that.data.personNum;
        that.setData({
          personNum: data.undo
        }, () => {
          if(that.data.modelState && num>0){
            // wx.showModal({
            //   content: '有' + num + '人新申请加入你的派工单，是否进入审核列表',
            //   success: function (res) {
            //     if (res.confirm) {
            //       that.data.modelState = false;
            //       wx.navigateTo({
            //         url: './partner_list/partner_list'
            //       })
            //     }
            //   }
            // })
          }
        })
      }else {
        that.setData({
          personNum: data.undo
        })
      }
    });
  },
  socketErr: function () {
    const that = this;
    console.log('socket出错')
    clearTimeout(that.data.socketTimer);
    if (that.data.userState){
      that.data.socketTimer = setTimeout(function () {
        wx.closeSocket();
        that.createSocket();
      }, 10000)
    }
  },
  socketClose: function () {
    const that = this;
    console.log('socket关闭')
    clearTimeout(that.data.socketTimer);
    if(that.data.userState){
      that.data.socketTimer = setTimeout(function () {
        that.createSocket();
      }, 10000)
    }
  },


});