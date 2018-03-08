var app = getApp();
var utils = app.admx.utils;

Page({
  //初始化声明页面上用得上的对象
  data: {
    //员工id
    employeeId: null,
    orderslist: '',
    //头部选中状态
    tabActive: ['active', null, null],
    //开始时间
    beginDate: '',
    //结束时间
    endDate: '',
    //人员名称
    employeeName: '',
  },
  //进入当前页面要执行的方法
  onLoad: function (options) {
    //判断上一个页面传过来的是否有员工id
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
    //给开始设置的date里面的开始时间，结束时间设置数据
    this.setData({
      //开始时间
      beginDate: options.beginDate,
      //结束时间
      endDate: options.endDate
    });

  },
  //设置名字
  setName(name){
    this.setData({
      employeeName: name
    });
  },
  //继续执行方法
  onShow: function () {
    //查询人员任务完成率饼图
    this.queryEmpTaskCompletionRatePie();
    //查询人员任务完成率柱状图
    this.queryEmpTaskCompletionRateHistogram();
  },
  //插件
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

  //人员完成率饼图方法
  queryEmpTaskCompletionRatePie: function () {
    //初始化
    var that = this;
    app.admx.request({
      method: 'get',
      //写链接
      url: app.config.service.queryEmpTaskCompletionRatePie.replace("{employeeId}", that.data.employeeId),
      //设置时间（ajav写法）
      data: {
        beginDate: this.data.beginDate,
        endDate: this.data.endDate
      },
      succ: function (res) {
        var series = new Array();
        var deptInfo = res;
        var wcl = parseFloat(deptInfo.taskWcl);
        var deptSeries = {
          "name": "完成",
          data: wcl,
          color: '#04c38e'
        };
        series.push(deptSeries);
        var wwc = 100 - wcl;
        deptSeries = {
          name: "未完成",
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

  //人员完成率柱状图
  queryEmpTaskCompletionRateHistogram(){
    var that = this;
    var orderBy = this.data.orderIndex;
    app.admx.request({
      method: 'get',
      url: app.config.service.queryEmpTaskCompletionRateHistogram.replace("{employeeId}", that.data.employeeId),
      //设置时间
      data: {
        beginDate: this.data.beginDate,
        endDate: this.data.endDate
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
          categories.push(c.day);
          serie.data.push(c.empTaskCompletionRateHistogram);
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
  

  //人员生产合格率
  tabPassedRate: function (e, filter) {
    var that = this;
    wx.showLoading({
      title: 'loading',
    })
    wx.redirectTo({
      url: '../peppassedrate/pepperform?empId=' + that.data.employeeId + '&&beginDate=' + that.data.beginDate + '&&endDate=' + that.data.endDate,
    })
  },
  //人员生产效率
  tabEfficiency: function (e, filter) {
    var that = this;
    wx.showLoading({
      title: 'loading',
    })
    wx.redirectTo({
      url: '../pepefficiencyrate/pepperform?empId=' + that.data.employeeId + '&&beginDate=' + that.data.beginDate + '&&endDate=' + that.data.endDate,
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

  //当点击筛选时跳转的页面
  filterOngoing: function () {
    wx.navigateTo({
      url: '../pepperform/filter/filter?startDate=' + this.data.beginDate + '&endDate=' + this.data.endDate + '&empName=' + this.data.employeeName + '&empId=' + this.data.employeeId,
    });
  },
})