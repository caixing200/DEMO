101 //扫描派工单后，填写子派工单信息
var app = getApp();
var utils = app.admx.utils;

Page({
  data: {
    todo: '',// 存放获取的派工单所有信息
    subtodo: {}, //存放填写的子派工单信息 
    submitting: false,
    inNum: '',
    owner: '',
    ownerName: '',
  },

  onLoad: function (options) {
    console.log(options);
    const that = this;
    that.setData({
      owner: options.owner,
      ownerName: options.owner_name
    }, () => {
      that._getTodo(options.code);
    })

  },


  //根据子派工单号，得到派工单相关信息(getTodoByQrcode)2.0
  _getTodo: function (code) {
    var that = this;
    wx.showLoading({
      title: 'loading',
    })
    app.admx.request({
      url: app.config.service.getToDoByqrcode,
      data: {
        "qrcode": code
      },
      succ: function (res) {
        console.log(res);
        if (res[0]) {
          that.setData({
            todo: res[0],          //对象 包含所有信息  
            todocode: code,          //派工单号，将小程序的code直接传给todocode  
            inNum: res[0].subtodo_plannumber
          })
        } else {
          wx.showModal({
            content: '派工单不存在或已失效',
            showCancel: false
          })
        }
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },

  //点击确定（将子派工单信息进行提交）2.0
  todo: function (e) {
    var that = this;
    if (this.data.submitting) {
      return;
    }
    /*
   if (that.data.todo == '' || that.data.todo == null){
      wx.showModal({
        content: '没有找到派工单',
        showCancel: false
      });
      return
    }*/
    let isHistory = '';
    if ((that.data.todo.subtodo_process != '') && (that.data.todo.subtodo_taskname != '') && (that.data.todo.subtodo_technology_id != '')) {
      isHistory = '0';
    } else {
      isHistory = '0';
    }

    that.setData({
      'subtodo.subtodo_process': e.detail.value.process ? e.detail.value.process : that.data.todo.subtodo_process,
      'subtodo.subtodo_taskname': e.detail.value.taskname ? e.detail.value.taskname : that.data.todo.subtodo_taskname,
      'subtodo.subtodo_technology_id': e.detail.value.technologyid ? e.detail.value.technologyid : that.data.todo.subtodo_technology_id,
      'subtodo.subtodo_plannumber': e.detail.value.plannumber ? e.detail.value.plannumber : that.data.todo.subtodo_plannumber,
      'subtodo.todo_num': e.detail.value.num ? e.detail.value.num : that.data.todo.todo_num,
      'subtodo.subtodo_code': that.data.todo.subtodo_code,
      'subtodo.subtodo_id': that.data.todo.subtodo_id,
      // 'subtodo.ratio': e.detail.value.ratio ? e.detail.value.ratio : that.data.todo.ratio,
      'subtodo.isHistory': isHistory


    })
    console.log("---submit subtodo working");
    console.log(that.data.subtodo);

    var process = that.data.subtodo.subtodo_process || '';
    if (process.length == 0) {
      wx.showModal({
        content: "请输入工序名称",
        showCancel: false
      });
      return
    }
    var taskname = that.data.subtodo.subtodo_taskname || '';
    if (taskname.length == 0) {
      wx.showModal({
        content: "请输入生产任务",
        showCancel: false
      });
      return
    }
    var technologyid = that.data.subtodo.subtodo_technology_id || '';
    if (technologyid.length == 0) {
      wx.showModal({
        content: "请输入工艺文件号",
        showCancel: false
      });
      return
    }

    var sum = that.data.subtodo.todo_num || '';
    if (sum.length == 0) {
      wx.showModal({
        content: "请输入总生产计划数量",
        showCancel: false
      });
      return
    }
    if (isNaN(sum)) {
      wx.showModal({
        content: "总生产计划数量只能输入数字",
        showCancel: false
      });
      return
    }

    var num = that.data.subtodo.subtodo_plannumber || '';
    if (num.length == 0) {
      wx.showModal({
        content: "请输入本次生产计划数量",
        showCancel: false
      });
      return
    }
    if (isNaN(num)) {
      wx.showModal({
        content: "本次生产计划数量只能输入数字",
        showCancel: false
      });
      return
    }





    this.setData({
      submitting: true
    })

    var ownerName = that.data.todo.owner_name;
    var ownerId = that.data.todo.owner;
    if (ownerId != '' && ownerId != that.data.owner) {
      wx.showModal({
        content: '该派工单正在由' + ownerName + '执行，是否加入？',
        success: function (res) {
          if (res.confirm) {
            that._postSubtodo(true);
          } else if (res.cancel) {
            wx.navigateBack({
              delta: 1
            });
          }
        }
      });
    } else {
      that._postSubtodo(false);
    }
  },
  _postSubtodo: function (state) {
    const that = this;
    //发送子派工单信息（postSubtodo）
    app.admx.request({
      url: app.config.service.addworking,
      data: that.data.subtodo,
      succ: function (res) {
        console.log(res);
        app.refreshCofing.todolist = true;       //标志位：已经生成一条子派工单信息
        if (!res) {
          let titleTxt = '';
          if(state){
            titleTxt = '加入申请已发送';
          }else {
            titleTxt = '派工单成功添加';
          }
          wx.showToast({
            title: titleTxt,
            duration: 800,
            mask: true,
            success: function () {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 800)
            }
          })
        } else {
          wx.showModal({
            content: '信息发送失败，请重试',
            showCancel: false
          })
        }
      },
      complete: function (res) {
        that.setData({
          submitting: false
        })
        // wx.navigateTo({ 
        //   url: "/pages/empapp/index"
        // });  //将子派工ID、本次计划数传入子派工单详细信息界面改为回到index界面  （+ '&plannum=' +that.data.plannumber ）
      }
    })
  },
  userInput: function (e) {
    const that = this;
    console.log(e);
    switch (e.target.dataset.id) {
      case '1':
        that.setData({
          'todo.subtodo_process': e.detail.value.process
        })
        break;
      case '2':
        that.setData({
          'todo.subtodo_taskname': e.detail.value.taskname
        })
        break;
      case '3':
        that.setData({
          'todo.subtodo_technology_id': e.detail.value.technologyid
        })
        break;
      case '4':
        that.setData({
          'todo.todo_num': e.detail.value.num
        })
        break;
      case '5':
        that.setData({
          'todo.subtodo_plannumber': e.detail.value.plannumber
        })
        break;
    }
  }
})
  //点击确定（将子派工单信息进行提交）
 /* todo: function (e) {
    var that = this;
    if (this.data.submitting) {
      return;
    }
    if (that.data.todo == '' || that.data.todo == null) {
      wx.showModal({
        content: '没有找到派工单',
        showCancel: false
      });
      return
    }
    var todo = utils.extend(that.data.todo, e.detail.value);  //封装好的
    console.log("---submit todo working");
    console.log(todo);

    var process = todo.process;
    if (process.length == 0) {
      wx.showModal({
        content: "请输入工序名",
        showCancel: false
      });
      return
    }
    var todo_plan_num = todo.todo_plan_num;
    if (todo_plan_num.length == 0) {
      wx.showModal({
        content: "请输入总生产计划数量",
        showCancel: false
      });
      return
    }
    if (isNaN(todo_plan_num)) {
      wx.showModal({
        content: "总生产计划数量只能输入数字",
        showCancel: false
      });
      return
    }
    console.log(todo_plan_num < that.data.todo.plannum);
    console.log(todo_plan_num % that.data.todo.plannum);
    //如果总生产计划数量不是计划完成数量的整数倍不可以提交
    if ((parseInt(todo_plan_num) < parseInt(that.data.todo.plannum)) || (parseInt(todo_plan_num) % parseInt(that.data.todo.plannum) > 0))
    {
      wx.showModal({
        showCancel: false,
        content: '总生产计划数量必须为计划完成数量的整数倍'
      });
      return;
    }
    var pnum = todo.pnum;
    if (pnum.length == 0) {
      wx.showModal({
        content: "请输入今日计划",
        showCancel: false
      });
      return
    }
    if (isNaN(pnum)) {
      wx.showModal({
        content: "今日计划数量只能输入数字",
        showCancel: false
      });
      return
    }
    this.setData({
      submitting: true
    })

    app.admx.request({
      url: app.config.service.addworking,
      data: todo,
      succ: function (res) {
        if (res.primarykey && res.primarykey > 0) {
          app.refreshCofing.todolist = true;
          wx.navigateBack();
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
  }*/

