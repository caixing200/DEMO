var ADMX_HOST = 'https://vmes.deecoop.cn';//20180525提交审核用URL

//var ADMX_HOST = 'http://192.168.0.106:8080/vmesrest';

//var ADMX_HOST = 'https://vmes.deecoop.cn/rest';

module.exports = {
  ADMX_HOST: `${ADMX_HOST}`,
  WX_HEADER_CODE: 'X-WX-Code',
  WX_HEADER_ENCRYPTED_DATA: 'X-WX-Encrypted-Data',
  WX_HEADER_IV: 'X-WX-IV',
  WX_HEADER_ID: 'X-WX-Id',
  HEADER_SKEY: 'session_token',
  HEADER_APPKEY: 'appkey',
  APPKEY: '8a1ce306148608c8880cf516060c2e3a',
  ERR_INVALID_PARAMS: 'ERR_INVALID_PARAMS',
  ERR_WX_LOGIN_FAILED: 'ERR_WX_LOGIN_FAILED',
  ERR_WX_GET_USER_INFO: 'ERR_WX_GET_USER_INFO',
  ERR_LOGIN_TIMEOUT: 'ERR_LOGIN_TIMEOUT',
  ERR_LOGIN_FAILED: 'ERR_LOGIN_FAILED',
  ERR_LOGIN_SESSION_NOT_RECEIVED: 'ERR_LOGIN_MISSING_SESSION',
  ERR_INVALID_SESSION: '1001',
  ERR_CHECK_LOGIN_FAILED: 'ERR_CHECK_LOGIN_FAILED',
  /**
   * 接口服务
   */
  SERVICE:{
    loginbasic: `${ADMX_HOST}/auth/basic`,
    //文件上传
    uploadFile:`${ADMX_HOST}/file/multipartUpload`,
    //账号密码方式登录
    loginBasic: `${ADMX_HOST}/auth/wxapp/basic`,
    //微信授权自动登录
    login: `${ADMX_HOST}/auth/wxapp`,
    changepwd: `${ADMX_HOST}/auth/chgpwd`
  }
};