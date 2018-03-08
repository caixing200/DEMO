var app = getApp();
var utils = app.admx.utils;

Page({
  //初始化声明页面上用得上的对象
  data: {
    employeeId: null,
    orderslist: '',
    tabActive: ['active', null, null, null],
    beginDate: '',
    endDateFinishedRate: '',
    endDate: 0,
    employeeName: '',
  },
  onLoad: function (options) {
    console.log(options);
    //加载员工id
    if (options && options.empId) {
      this.setData({
        employeeId: options.empId
      })
    } else {
      wx.showModal({
        showCancel: false,
        content: '页面加载失败，员工Id不能为空'
      })
      return;
    }
    //加载开始时间结束时间
    console.log("----onLoad");
    console.log("开始时间======" + options.beginDate);
    console.log("结束时间======" + options.endDate);
    this.setData({
      beginDate: options.beginDate,
      endDate: options.endDate
    });

  },

  //设置名字
  setName(name) {
    this.setData({
      employeeName: name
    });
  },

  onShow: function () {
    this.queryEmpQualifiedProductionPie();
    this.queryEmpQualifiedProductionHistogram();
  },

  chartsUtil: {
    "dept": function (series) {
      var pieCharts = new app.wxCharts({
        animation: true,
        canvasId: 'pieCanvas',
        type: 'ring',
        series: series,
        dataLabel: false,
        width: 320,
        height: 180
      });
    },
    "deptemp": function (categories, series) {
      console.log("________depll");
      new app.wxCharts({
        canvasId: 'lineCanvas',
        type: 'column',
        categories: categories,
        series: series,
        yAxis: {
          format: function (val) {
            return val + '%';
          }
        },
        width: 300,
        height: 150
      });
    }
  },

  //人员生产效率饼图
  queryEmpQualifiedProductionPie: function () {
    var that = this;
    console.log("===========" + that.data.employeeId)
    app.admx.request({
      method: 'get',
      //写链接
      url: app.config.service.queryEmpEfcPie.replace("{employeeId}", that.data.employeeId),
      //设置时间
      data: {
        beginDate: this.data.beginDate,
        endDate: this.data.endDate
      },
      succ: function (res) {
        console.log(res)
        var series = new Array();
        var deptInfo = res;
        var wcl = parseFloat(deptInfo.productionHgl);
        var deptSeries = {
          "name": "完成率",
          data: wcl,
          color: '#04c38e'
        };
        series.push(deptSeries);
        var wwc = 100 - wcl;
        deptSeries = {
          name: "未完成率",
          color: "red",
          data: wwc
        };
        series.push(deptSeries);
        that.chartsUtil.dept(series);
        that.setName(deptInfo.name);
      },
      complete: function (res) {
      }
    })
  },

  //人员生产效率柱状图
  queryEmpQualifiedProductionHistogram() {
    var that = this;
    var orderBy = this.data.orderIndex;
    app.admx.request({
      method: 'get',
      url: app.config.service.queryEmpEfcHistogram.replace("{employeeId}", that.data.employeeId),
      //设置时间
      data: {
        beginDate: this.data.beginDate,
        endDate: this.data.endDate
      },
      succ: function (res) {
        var categories = [];
        var serie = {
          name: "完成率",
          data: [],
          format: function (val) {
            return val + "%";
          }
        };
        for (var i = 0; i < res.length; i++) {
          var c = res[i];
          categories.push(c.day);
          serie.data.push(c.empQualifiedProductionHistogram);
        }
        console.log(categories);
        console.log(serie);
        that.chartsUtil.deptemp(categories, [serie]);

      },
      complete: function (res) {
      }
    })

    this.chartsUtil.deptemp();
  },


  _createDeptEmpCompletionRate: function () {
    var that = this;
    var orderBy = this.data.orderIndex;
    app.admx.request({
      method: 'get',
      url: app.config.service.deptEmpAchievements.replace("{deptId}", that.data.dept.id),
      data: {
        orderBy: orderBy
      },
      succ: function (res) {
        var categories = [];
        var serie = {
          name: "完成量",
          data: [],
          format: function (val) {
            return val + "%";
          }
        };
        for (var i = 0; i < res.length; i++) {
          var c = res[i];
          categories.push(c.name);
          serie.data.push(c.wcl);
        }
        console.log(categories);
        console.log(serie);
        that.chartsUtil.deptemp(categories, [serie]);

      },
      complete: function (res) {
      }
    })

    this.chartsUtil.deptemp();
  },

  //任务完成 
  tabFinishRate: function (e, filter) {
    var that = this;
    // console.log(' that.data.dept:' + that.data.dept.id);
    wx.showLoading({
      title: 'loading',
    })
    wx.redirectTo({
      url: '../pepperform/pepperform?empId=' + this.data.employeeId + '&&beginDate=' + this.data.beginDate + '&&endDate=' + this.data.endDate,
    })
  },
  //生产合格
  tabPassRate: function (e, filter) {
    var that = this;
    wx.showLoading({
      title: 'loading',
    })
    wx.redirectTo({
      url: '../peppassedrate/pepperform?empId=' + this.data.employeeId + '&&beginDate=' + this.data.beginDate + '&&endDate=' + this.data.endDate,
    })
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    console.log(this.data.endDate);
    if (this.data.endDate < e.detail.value) {
      wx.showModal({
        showCancel: false,
        content: '开始时间不能大于结束时间',
      })
      return;
    }
    this.setData({
      beginDateFinishedRate: e.detail.value
    })
  },
  bindEndDateChange: function (e) {
    console.log(this.data.beginDate);
    console.log(e.detail.value);
    if (this.data.beginDate > e.detail.value) {
      wx.showModal({
        showCancel: false,
        content: '结束时间不能小于开始时间',
      })
      return;
    }
    this.setData({
      endDateFinishedRate: e.detail.value
    })
  },
  //前十后十
  orderPickChange: function (e) {
    this.setData({
      orderIndex: e.detail.value,
    });
    this._createDeptEmpCompletionRate();
  },
  //当点击筛选时跳转的页面
  filterOngoing: function () {
    wx.navigateTo({
      url: '../pepefficiencyrate/filter/filter?startDate=' + this.data.beginDate + ' &endDate=' + this.data.endDate + '&empName=' + this.data.employeeName + '&empId=' + this.data.employeeId,
    });
  },
})