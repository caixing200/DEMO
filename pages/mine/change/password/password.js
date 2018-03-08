var app = getApp();
Page({
  data: {
    focus: false,
    inputValue: ''
  },
  
  //修改密码
  chgPwd:function(e) {

    if (this.data.submitting) {
      return;
    }

    var oldpwd = e.detail.value.oldpwd;
    if (oldpwd.length == 0) {
      wx.showModal({
        content: "请输入原密码",
        showCancel: false
      });
      return
    }
    var newpwd = e.detail.value.newpwd;
    if (newpwd.length == 0) {
      wx.showModal({
        content: "请输入新密码",
        showCancel: false
      });
      return
    }
    this.setData({
      submitting: true
    })
    var that = this;
    app.admx.login.changePwd({
      data: {
        oldpwd: oldpwd,
        newpwd:newpwd
      },
      succ: function (res) {
        console.log(res);
        wx.showModal({
          content: "修改成功",
          showCancel: false
        });
        setTimeout(function () {
          wx.navigateBack()
        }, 1000);

      },
      complete: function (res) {
        that.setData({
          submitting: false
        })
      }
    })

  }

})