var app = getApp();

Page({
  data: {
    startDate: '',
    endDate: '',
    filter: null,
    objectArray:'',
    empObjectArray:'',
    deptId:'',
    empId:''  
  },
  onLoad: function (options) {
    this.setData({
      startDate: options.startDate,
      endDate: options.endDate,
      empId: options.empId,
      empName: options.empName
    })
  },
  onShow: function () {
    this._createDept();
    this._createDeptEmp();
  },
  bindDeptChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var index = e.detail.value;
    var currentId = this.data.objectArray[index]; // 这个id就是选中项的id
    this.setData({
      deptIndex: e.detail.value,
      deptId:currentId
    })
  },
  bindEmpChange: function (e) {
    var index = e.detail.value;
    var currentId = this.data.empObjectArray[index]; // 这个id就是选中项的id
    console.log('emppicker发送选择改变，携带值为', e.detail.value)
    this.setData({
      empIndex: e.detail.value,
      empId: currentId.id
    })
  },
  _createDept: function () {
    var that = this;
    app.admx.request({
      method: 'get',
      url: app.config.service.queryDept,
      succ: function (res) {
        var series = new Array();
        var deptInfo = res;
        console.log(JSON.stringify(deptInfo))
        that.setData({
          objectArray: deptInfo,
        })
      },
      complete: function (res) {
      }
    })
  },
  _createDeptEmp: function () {
    var that = this;
    app.admx.request({
      method: 'get',
      url: app.config.service.queryDeptEmp,
      succ: function (res) {
        var series = new Array();
        var deptInfo = res;
        that.setData({
          empObjectArray: deptInfo
        })
      },
      complete: function (res) {
      }
    })
  },
  endDateChange: function (e) {
    console.log(this.data.startDate > e.detail.value);
    if (this.data.startDate && this.data.startDate > e.detail.value) {
      wx.showModal({
        showCancel: false,
        content: '结束时间不能小于开始时间',
      })
      return;
    }
    this.setData({
      endDate: e.detail.value
    })
  },
  startDateChange: function (e) {
    console.log(this.data.endDate > e.detail.value);
    if (this.data.endDate && this.data.endDate < e.detail.value) {
      wx.showModal({
        showCancel: false,
        content: '开始时间不能大于结束时间',
      })
      return;
    }
    this.setData({
      startDate: e.detail.value
    })
  },
  //点击确定时
  search: function (e) {
    var formData = e.detail.value;
    formData.finishedEnd = this.data.endDate;
    formData.formData = this.data.startDate;
    formData.deptId=this.data.deptId;
    formData.empId=this.data.empId;
    console.log(JSON.stringify(formData));
    wx.showLoading({
      title: 'loading',
    })
    if(formData.empId!=''){
      wx.redirectTo({//跳转人员
        url: '../../pepperform/pepperform?empId=' + formData.empId + '&&beginDate=' + this.data.startDate + '&&endDate=' + this.data.endDate,
      })
    }else{
      wx.redirectTo({//跳转部门
        url: '../../finishedrate/finishedrate?dept=' + JSON.stringify(formData.deptId) + '&&start=' + this.data.startDate + '&&end=' + this.data.endDate,
      })
    }
    return false;
  },
  reset: function (e) {
    this.setData({
      startDate: '',
      endDate: '',
      filter: null, 
    })
    app.filters.orders_awaiting = null;
  }

})