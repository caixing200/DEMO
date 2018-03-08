var app = getApp();
var utils = app.admx.utils;

Page({
  data: {
    dept: null,
    orderslist: '',
    tabActive: ['active', null, null, null],
    beginDateFinishedRate: '',
    endDateFinishedRate: '',
    order: ["前十名", "后十名"],
    orderIndex: 0,
    deptName: '',
  },
  onLoad: function (options) {
    console.log("start:" + options.dept);
    //console.log("start:" + options.start);
    if (options && options.dept) {
      this.setData({
        dept: JSON.parse(options.dept)
      });
      this.setData({
        deptName: this.data.dept.name,
        deptId: this.data.dept.id
      });
      this.setData({
        beginDateFinishedRate: options.start,
        endDateFinishedRate: options.end
      })
    } else {
      wx.showModal({
        showCancel: false,
        content: '页面加载出错'
      })
      return;
    }
    console.log("----onLoad");
    if (!options.start){
      var endDate = app.common.dateFormat("yyyy-MM-dd", new Date());
      var beginDate = app.dateUtil.getPreMonth(endDate);
      this.setData({
        beginDateFinishedRate: beginDate,
        endDateFinishedRate: endDate
      });
    }
  },

  onShow: function () {
    this._createDeptCompletionRate();
    this._createDeptEmpCompletionRate();
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
  //部门完成率
  _createDeptCompletionRate: function () {
    var that = this;
    app.admx.request({
      method: 'get',
      url: app.config.service.deptAchievements.replace("{deptId}", that.data.dept.id),
      data: {
        beginDate: this.data.beginDateFinishedRate,
        endDate: this.data.endDateFinishedRate
      },
      succ: function (res) {
        var series = new Array();
        var deptInfo = res;
        console.log("deptInfo:" + deptInfo);
        var wcl = parseFloat(deptInfo.wcl);
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
      },
      complete: function (res) {
      }
    })

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

  //部门生产合格率 
  tabPassedRate: function (e, filter) {
    var that = this;
    // console.log(' that.data.dept:' + that.data.dept.id);
    this.setData({
      tabActive: [null, 'active', null]
    })
    wx.showLoading({
      title: 'loading',
    })
    wx.redirectTo({
       url: '../passedrate/passedrate?dept=' + JSON.stringify(that.data.dept),
     })
  },
  //部门生产效率
  tabEfficiency: function (e, filter) {
    var that = this;
    this.setData({
      tabActive: [null,null, 'active']
    })
    wx.showLoading({
      title: 'loading',
    })
    wx.redirectTo({
      url: '../efficiency/efficiency?dept=' + JSON.stringify(that.data.dept),
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
      url: '../finishedrate/filter/filter?startDate=' + this.data.beginDateFinishedRate + '&endDate=' + this.data.endDateFinishedRate + '&deptName=' + this.data.deptName + '&deptId=' + this.data.deptId,
    });
  },
})