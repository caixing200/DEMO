//扫描派工单后，填写子派工单信息
var app = getApp();
var utils = app.admx.utils;

Page({
  data: {
    todo: '',// 存放获取的派工单所有信息
    subtodo: {}, //存放填写的子派工单信息 
    submitting: false,
    inNum: '',
    owner: '',
    isHistory: '',
    code: '',
    subTodoState: 0,
  },

  onLoad: function (options) {
    console.log(options);
    const that = this;
    that.setData({
      owner: options.owner,
      code: options.code
    }, () => {
      that._getTodo(options.code);
    })

  },

  //检测是否应用历史数据
  checkHistory: function (data) {
    const that = this;
    let isHistory = '';
    if ((data.subtodo_process != '') && (data.subtodo_taskname != '')) {
      isHistory = '1';
    } else {
      isHistory = '0';
    }
    return isHistory;
  },
  //根据子派工单号，得到派工单相关信息(getTodoByQrcode)2.0
  _getTodo: function (code) {
    var that = this;
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    app.admx.request({
      url: app.config.service.getToDoByqrcode,
      data: {
        "qrcode": code
      },
      succ: function (res) {
        console.log(res);
        if (that.data.subTodoState === 0) {
          if (res.length > 0) {
            var state = res[1].result;
            var showTxt = '';
            var userShowTxt = res[1].message;
            switch (state) {
              case '-1':
                showTxt = '';
                break;
              case '0':
                showTxt = '';
                break;
              case '1':
                if (that.data.owner === res[0].owner) {
                  showTxt = '你已经领取该子派工单';
                } else {
                  showTxt = userShowTxt;
                }
                break;
              case '2':
                showTxt = userShowTxt;
                break;
              case '3':
                showTxt = userShowTxt;
                break;
              case '4':
                //showTxt = '该子派工单已经被审核';
                showTxt = userShowTxt;
                break;
            }
            if (showTxt) {
              wx.showModal({
                content: showTxt,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                }
              })
            } else {
              if (res[0].owner) {
                if (res[0].owner != that.data.owner) {
                  wx.showModal({
                    content: '该子派工单正在由' + res[0].owner_name + '执行，是否加入？',
                    success: function (data) {
                      if (data.confirm) {
                        that.setData({
                          todo: res[0],//对象 包含所有信息  
                          todocode: code,//派工单号，将小程序的code直接传给todocode  
                          inNum: res[0].subtodo_plannumber,
                          isHistory: that.checkHistory(res[0]),
                          subTodoState: 1,
                        })
                      } else if (data.cancel) {
                        wx.navigateBack();
                      }
                    }
                  });
                }
              } else {
                that.setData({
                  todo: res[0],          //对象 包含所有信息  
                  todocode: code,          //派工单号，将小程序的code直接传给todocode  
                  inNum: res[0].subtodo_plannumber,
                  isHistory: that.checkHistory(res[0]),
                  subTodoState: 2,
                })
              }
            }

          } else {
            wx.showModal({
              content: '子派工单不存在或已失效',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack()
                }
              }
            })
          }
        } else if (that.data.subTodoState === 1){
          that._postSubtodo(false);
        } else if (that.data.subTodoState === 2){
          if (res.length > 0) {
            if (res[0].owner) {
              wx.showModal({
                content: '该子派工单已被领取，请重新扫码',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack();
                  }
                }
              })
            } else {
              that._postSubtodo(false);
            }
          }else {
            wx.showModal({
              content: '子派工单不存在或已失效',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack()
                }
              }
            })
          }
        }




        /////////////////////////////////////////////////////////////////////
        // if (that.data.subTodoState === 1) {
        //   if (res.length > 0) {
        //     if (res[0].owner) {
        //       wx.showModal({
        //         content: '请重新扫码',
        //         showCancel: false,
        //         success: function (res) {
        //           if (res.confirm) {
        //             wx.navigateBack();
        //           }
        //         }
        //       })
        //     } else {
        //       that._postSubtodo(false);
        //     }
        //   }
        // } else if (that.data.subTodoState === 0) {
        //   if (res.length > 1) {
        //     var state = res[1].result;
        //     var showTxt = '';
        //     var userShowTxt = res[1].message;
        //     switch (state) {
        //       case '-1':
        //         showTxt = '';
        //         break;
        //       case '0':
        //         showTxt = '';
        //         break;
        //       case '1':
        //         if (that.data.owner === res[0].owner) {
        //           showTxt = '你已经领取该子派工单';
        //         } else {
        //           showTxt = userShowTxt;
        //         }
        //         break;
        //       case '2':
        //         showTxt = userShowTxt;
        //         break;
        //       case '3':
        //         showTxt = userShowTxt;
        //         break;
        //       case '4':
        //         //showTxt = '该子派工单已经被审核';
        //         showTxt = userShowTxt;
        //         break;
        //     }
        //     if (showTxt) {
        //       wx.showModal({
        //         content: showTxt,
        //         showCancel: false,
        //         success: function (res) {
        //           if (res.confirm) {
        //             wx.navigateBack({
        //               delta: 1
        //             })
        //           }
        //         }
        //       })
        //     } else {
        //       if (res[0].owner) {
        //         if (res[0].owner != that.data.owner) {
        //           wx.showModal({
        //             content: '该子派工单正在由' + res[0].owner_name + '执行，是否加入？',
        //             success: function (res) {
        //               if (res.confirm) {
        //                 that.setData({
        //                   todo: res[0],          //对象 包含所有信息  
        //                   todocode: code,          //派工单号，将小程序的code直接传给todocode  
        //                   inNum: res[0].subtodo_plannumber,
        //                   isHistory: that.checkHistory(res[0]),
        //                 })
        //               } else if (res.cancel) {
        //                 wx.navigateBack();
        //               }
        //             }
        //           });
        //         }
        //       } else {
        //         that.setData({
        //           todo: res[0],          //对象 包含所有信息  
        //           todocode: code,          //派工单号，将小程序的code直接传给todocode  
        //           inNum: res[0].subtodo_plannumber,
        //           isHistory: that.checkHistory(res[0]),
        //         })
        //       }
        //     }
        //   } else {
        //     wx.showModal({
        //       content: '子派工单不存在或已失效',
        //       showCancel: false,
        //       success: function (res) {
        //         if (res.confirm) {
        //           wx.navigateBack()
        //         }
        //       }
        //     })
        //   }
        // }

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


    that.setData({
      'subtodo.subtodo_process': e.detail.value.process ? e.detail.value.process : that.data.todo.subtodo_process,
      'subtodo.subtodo_taskname': e.detail.value.taskname ? e.detail.value.taskname : that.data.todo.subtodo_taskname,
      'subtodo.subtodo_technology_id': e.detail.value.technologyid ? e.detail.value.technologyid : that.data.todo.subtodo_technology_id,
      'subtodo.subtodo_plannumber': e.detail.value.plannumber ? that._trimZero(e.detail.value.plannumber) : that.data.todo.subtodo_plannumber,
      'subtodo.todo_num': e.detail.value.num ? that._trimZero(e.detail.value.num) : that.data.todo.todo_num,
      'subtodo.subtodo_code': that.data.todo.subtodo_code,
      'subtodo.subtodo_id': that.data.todo.subtodo_id,
      // 'subtodo.ratio': e.detail.value.ratio ? e.detail.value.ratio : that.data.todo.ratio,
      'subtodo.isHistory': that.data.isHistory


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
    // var technologyid = that.data.subtodo.subtodo_technology_id || '';
    // if (technologyid.length == 0) {
    //   wx.showModal({
    //     content: "请输入工艺文件号",
    //     showCancel: false
    //   });
    //   return
    // }

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
        content: "请输入生产计划数量",
        showCancel: false
      });
      return
    }
    if (num === '0') {
      wx.showModal({
        content: "生产计划数量需大于0",
        showCancel: false
      });
      return
    }
    if (isNaN(num)) {
      wx.showModal({
        content: "生产计划数量只能输入数字",
        showCancel: false
      });
      return
    }





    this.setData({
      submitting: true
    })

    // var ownerName = that.data.todo.owner_name;
    // var ownerId = that.data.todo.owner;
    // if (ownerId != '') {
    //   if (ownerId != that.data.owner) {
    //     wx.showModal({
    //       content: '该子派工单正在由' + ownerName + '执行，是否加入？',
    //       success: function (res) {
    //         if (res.confirm) {
    //           that._postSubtodo(true);
    //         } else if (res.cancel) {
    //           wx.navigateBack({
    //             delta: 1
    //           });
    //         }
    //       }
    //     });
    //   } else {
    //     wx.showModal({
    //       content: '你已经领取了该子派工单',
    //       showCancel: false,
    //       success: function (res) {
    //         if (res.confirm) {
    //           wx.navigateBack();
    //         }
    //       }
    //     })
    //   }
    // } else {
    //   if (that.data.subTodoState === 0) {
    //     that.setData({
    //       subTodoState: 1
    //     }, () => {
    //       that._getTodo(that.data.code);
    //     })
    //   }
    // }

    that._getTodo(that.data.code);
  },
  _trimZero: function (num) {
    const that = this;
    const numTxt = num + '';
    let tempNum = '';
    for (let i = 0; i < numTxt.length; i++) {
      if (numTxt[i] == 0) {
        continue;
      } else {
        tempNum = numTxt.slice(i);
        return tempNum
      }
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
        if (res) {
          let status = parseInt(res);
          let titleTxt = res.split(':')[1] || '';
          if (status == 0) {
            wx.showToast({
              title: titleTxt,
              mask: true,
              duration: 1000,
              success: function () {
                setTimeout(function () {
                  wx.navigateBack()
                }, 1000)
              }
            })
          } else if (status == 1) {
            wx.showModal({
              content: titleTxt,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack()
                }
              }
            })
          }
        } else {
          wx.showModal({
            content: '信息发送失败，请返回！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack()
              }
            }
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

