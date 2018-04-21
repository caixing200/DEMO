// pages/empapp/finishplan/finishList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnState: 1,
    useData: null,
    finishList: [],
    cuser: '',
    pageIndex: 1,
  },
  _getAuditDeptplanList: function (id, index) {
    const that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    app.admx.request({
      url: app.config.service.getAuditDeptplanList,
      data: {
        deptplan_id: id,
        currentPage: index || that.data.pageIndex
      },
      succ: function (res) {
        console.log(res);
        if(index){
          if (res.list && res.list.length > 0) {
            that.setData({
              finishList: res.list,
              pageIndex: index
            })
          } else {
            that.setData({
              finishList: [],
              pageIndex: index
            },()=>{
              wx.showModal({
                content: '没有已审核信息',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 1
                    });
                  }
                }
              })
            })
          }
        }else {
          if (res.list && res.list.length > 0) {
            that.setData({
              finishList: that.data.finishList.concat(res.list),
              pageIndex: that.data.pageIndex + 1
            })
          } else {
            if (that.data.finishList.length > 0) {
              wx.showToast({
                title: '没有更多数据',
                mask: true,
                duration: 700,
                icon: 'loading'
              })
            } else {
              wx.showModal({
                content: '没有已审核信息',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack();
                  }
                }
              })
            }
          }
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },
  _unExamine: function (e) {
    const that = this;
    console.log(e);
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    app.admx.request({
      url: app.config.service.cancelAuditDeptplan,
      data: {
        deptplan_id: e.target.dataset.deptplan_id,
        qualitycheck_id: e.target.dataset.qualitycheck_id
      },
      succ: function (res) {
        console.log(res);
        if (!res) {
          that.data.finishList.splice(e.target.dataset.index, 1);
          that.setData({
            finishList: that.data.finishList
          },()=>{
            wx.showModal({
              content: '反审核成功',
              showCancel: false,
            })
          })
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },
  getFinishList: function () {
    const that = this;
    if (that.data.finishList.length > 9) {
      if ((that.data.finishList.length % 10) === 0) {
        that._getAuditDeptplanList()
      } else {
        wx.showToast({
          title: '没有更多数据',
          mask: true,
          duration: 700,
          icon: 'loading'
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.data.btnState = 1;
    that.setData({
      useData: app.Session.get(),
      cuser: app.Session.get().user.name
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this._getAuditDeptplanList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})