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
    // if (oldpwd.length == 0) {
    //   wx.showModal({
    //     content: "请输入原密码",
    //     showCancel: false
    //   });
    //   return
    // }
    var newpwd1 = e.detail.value.newpwd1;
    // if (newpwd.length == 0) {
    //   wx.showModal({
    //     content: "请输入新密码",
    //     showCancel: false
    //   });
    //   return
    // }
    var newpwd2 = e.detail.value.newpwd2;
    // if (newpwd.length == 0) {
    //   wx.showModal({
    //     content: "请输入新密码",
    //     showCancel: false
    //   });
    //   return
    // }

    if (newpwd1 !== newpwd2){
      wx.showToast({
        title: '新密码不一致',
        mask: true,
        icon: 'loading',
        duration: 1000
      })
      return
    }
    this.setData({
      submitting: true
    })
    var that = this;
    app.admx.login.changePwd({
      data: {
        oldpwd: oldpwd,
        newpwd:newpwd1
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