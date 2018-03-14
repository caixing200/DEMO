/**
 * 小程序配置文件
 */
var constants = require("./lib/admx-sdk/lib/constants.js");
var host = constants.ADMX_HOST;
//var host = 'http://localhost:8080/vmesrest';
var apiUrlBase = host + "/custom";

var config = {
  // 下面的地址配合云端 Demo 工作
  service: {
    host,
    apiUrlBase: `${apiUrlBase}`, 
    // 登录地址，用于建立会话,
    
    getToDoByqrcode: `${host}/newtodo/getToDoByqrcode`,
    //扫描子派工单获取派工单信息

    addworking: `${host}/newtodo/postSubtodo`,
    //填写子派工单信息并提交

    getTodoByState: `${host}/newtodo/getTodoByState`, 
    //根据state不同获取进行中、已取消派工单信息
    todo: `${host}/newtodo/getDetailBySubID/{subtodo_id}`,
    //通过子派工单ID获取子派工单详细信息、同时在报工时查询使用  
    getAllClaimed: `${host}/newtodo/getAllClaimed`,
    //获取已报工报工单信息 
    retreatClaim: `${host}/newtodo/retreatClaim`,
    //已报工报工单未审核前的撤回

    //郑燕03.09
    //报工单确认||全部确认 
    confirmClaim: `${host}/newtodo/confirmClaim`,
    //报工单修正 
    postAuditClaim: `${host}/newtodo/postAuditClaim`,


    PartnerList: `${host}/newtodo/getCurrentPartnerList`,
    //工友请求列表
    updatePartner: `${host}/newtodo/updatePartner`,
//请求列表中同意/拒绝选择PartnerList


    getPartenList:`${host}/newtodo/getPartenList`,
    //得到子派工多人的报工信息
    saveClaim: `${host}/newtodo/saveClaim`,
    //claim.js 报工   
    cancelClaim: `${host}/newtodo/cancelClaim`,
    //取消报工

    ReviewList: `${host}/newtodo/ReviewList`,
    //获取审核中和已审核的派工单主要信息
    rebackClaim: `${host}/newtodo/rebackClaim`,
    //反审核报工单
    ReviewDetail: `${host}/newtodo/ReviewDetail`,
    //获取审核报工单全部信息

  
    loginUrl: `${host}/auth/basic`,
    chgpwd: `${host}/auth/chgpwd`,
    //获取公司信息
    getcompinfo: `${apiUrlBase}/comp/get`,
    //检查是否已补全了派工单信息
    isfilledTodo: `${apiUrlBase}/todo/isfilled`,
    //根据state的不同获取进行中、已报工/已取消的派工单

    equiplist: `${apiUrlBase}/claim/equiplist`,
    //进行中的派工单相关物料
    materiallist: `${apiUrlBase}/claim/materiallist`,
    //当扫描或是手动输入派工单号时获取派工单信息
    getTodoByCode: `${apiUrlBase}/gettodobyqrcode`,
    //改变派工单状态,当扫描完成或输入完成派工单，点确定时
    chgTodoStatus: `${apiUrlBase}/chgTodoStatus`,
    //当扫描完成或输入完成派工单，点确定时

    //addworking: `${host}/newtodo/uploadsubtodoData`,
    //index.js 根据设备编号查设备信息

    getEquipByCode: `${apiUrlBase}/equip/getbycode`,
    //index.js 根据物料编号查物料信息
    getMaterialByCode: `${apiUrlBase}/material/getbycode`,
    //添加相关设备
    addEquip: `${host}/todo/addequip`,
    //添加相关物料
    addMaterial: `${host}/todo/addmaterial`,
    
    
    //查询报工详情
    getclaimdetail: `${apiUrlBase}/claim/getbyid`,
    queryclaimdetail: `${host}/tracing/claim/getbyid`,
    //根据派工单号查询生产计划
    getplanbytodocode: `${apiUrlBase}/plan/getbytodocode`,
    //结束生产计划
    finishplan: `${host}/plan/finish`,

    //2018.03.06增加(蔡星)
    //部门计划报工扫码后请求接口
    getDeptplan: `${host}/newtodo/getDeptplan`,
    //提交部门计划合格数以及不合格数
    updateDeptplan: `${host}/newtodo/updateDeptplan`,

    //--------leaderapp ------------
    //销售订单
    orderlist: `${host}/orders`,
    //生产计划
    planlist: `${host}/plan`,
    getplandetail: `${apiUrlBase}/plan/todolist`,
    //根据订单明细查生产计划
    getbyorderdeailid: `${apiUrlBase}/plan/getbyorderdeailid`,

    //追溯
    tracing: `${host}/tracing`,
    //由销售订单查询生产计划
    tracingPlan: `${host}/tracing/plan`,
    //根据生产计划查派工单
    tracingTodo: `${host}/tracing/plan/todolist`,
  //追溯相关设备
    tracingEquipment: `${host}/tracing/equipment/`,
    // 各部门绩效
    allDeptAc: `${host}/achievements/task`,
    //生产合格率
    allQlfAc: `${host}/achievements/quality`,
    //生产率
    allEfcAc: `${host}/achievements/efc`,

    //单部门绩效
    deptAchievements: `${host}/achievements/dept/{deptId}`,
    //单部门人员绩效
    deptEmpAchievements: `${host}/achievements/deptemp/{deptId}`,

    //单部门生产合格率
    deptQlfAc: `${host}/achievements/deptQlt/{deptId}`,
    //单部门人员生产合格率
    deptEmpQlfAc: `${host}/achievements/deptQltEmp/{deptId}`,
    
    //单部门生产效率
    deptEfcAc: `${host}/achievements/deptEfc/{deptId}`,
    //单部门人员生产效率
    deptEmpEfcAc: `${host}/achievements/deptEfcEmp/{deptId}`,
   
    //查询所有部门
    queryDept: `${host}/achievements/queryDept`,
    //查询所有人员
    queryDeptEmp: `${host}/achievements/queryEmp`,
    //设备状态
    equipruning: `${host}/equipstatus/runing`,
    equiprlist: `${host}/equipstatus/list/{status}`,
    equiprdetail: `${host}/equipstatus/detail/{id}`,

    //查询单个员工在某个时间段内的任务完成率饼图
    queryEmpTaskCompletionRatePie: `${host}/achievements/queryEmpTaskCompletionRatePie/{employeeId}`,
     //查询单个员工在某个时间段内的任务完成率饼图
    queryEmpTaskCompletionRateHistogram: `${host}/achievements/queryEmpTaskCompletionRateHistogram/{employeeId}`,
   
    // 查询单个员工在某个时间段内的生产合格率饼图
    queryEmpQualifiedProductionPie: `${host}/achievements/queryEmpQualifiedProductionPie/{employeeId}`,
    //查询单个员工在某个时间段内的生产合格率柱状图
    queryEmpQualifiedProductionHistogram: `${host}/achievements/queryEmpQualifiedProductionHistogram/{employeeId}`,
   
    // 查询单个员工在某个时间段内的生产效率饼图
    queryEmpEfcPie: `${host}/achievements/empProductionEfficiency/{employeeId}`,
    //查询单个员工在某个时间段内的生产效率柱状图
    queryEmpEfcHistogram: `${host}/achievements/empProductionEfficiencyHistogram/{employeeId}`,


  },
 

  /**
   * 销售订单的状态
   */
  OrdersState:{
    //1待排产 2生产中 3已完成 - 1已取消
    awaiting:1,  
    ongoing:2,
    finished:3,
    canceled:-1
  },
  //派工单状态
  TodoState:{
    //1待执行 2进行中 3已完成 - 1已取消
    awaiting: 1,
    ongoing: 2,
    finished:3,
    canceled: -1
  },
  //子派工单状态
  ClaimState:{
    //2进行中 3已完成 - 1已取消
    ongoing: 1,
    finished:2,
    canceled: -1
  },
  //子派工单审核状态
  ReviewState: {
    //1已审核，0待审核
    ongoing: '0',
    finished: '1',
  },
  /**
  * 生产计划的状态
  */
  PlanState: {
    //0待派工, 1待生产 2生产中 1已完成 -1已取消
    waitTodo:0,
    waitToproduce: 1,
    ongoing:2,
    finished: 3,
    canceled: -1
  },
  /**
   * 部门绩效状态
   */
  deptState:{
    //0任务完成率 1生产合格率 2生产效率
    task:0,
    quality:1,
    efc:2
  },
  equipmentStatus:{
    0:"待机",
    1:"故障",
    2:"运行",
    3:"关机"
  }

};

module.exports = config;