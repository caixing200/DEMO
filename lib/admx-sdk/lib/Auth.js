var constants = require("./constants.js");
var utils = require("./utils.js");
var Session = require("./session.js");
var Request = require("./request.js");
/**
 * 微信登录，获取 code 和 encryptData
 * callback(error, res)
 */
function getLoginCode(callback) {
  console.log('getLoginCode')
  wx.login({
    success: function (loginResult) {
      console.log('login success')
      wx.getUserInfo({
        success: function (userResult) {
          callback(null, {
            code: loginResult.code,
            encryptedData: userResult.encryptedData,
            iv: userResult.iv,
            userInfo: userResult.userInfo,
          });
        },

        fail: function (userError) {
          var error = {
            code: constants.ERR_WX_GET_USER_INFO,
            message: '获取微信用户信息失败，请检查网络状态',
            detail: userError
          };
          callback(error, null);
        },
      });
    },

    fail: function (loginError) {
      var error = {
        code: constants.ERR_WX_LOGIN_FAILED,
        message: '微信登录失败，请检查网络状态',
        detail: loginError
      };
      callback(error, null);
    },
  });
};

/**
 * 修改密码
 * @param {string} options.data.account 登录账号
 * @param {string} options.data.passwrod 登录密码
 */
function loginBasic(options){
  console.log(options);
  if (!options) {
    throw new Request.RequestError(constants.ERR_INVALID_PARAMS, "options参数缺失");
  }
  if (!options.data.account) {
    throw new Request.RequestError(constants.ERR_INVALID_PARAMS, "参数data.account缺失");
  }
  // if (!options.data.password) {
  //   throw new Request.RequestError(constants.ERR_INVALID_PARAMS, "参数data.password缺失");
  // }
  Request.request(utils.extend({}, options, {
    url: constants.SERVICE.loginbasic,
    succ: function (data) {
      if (data.session_token) {
        var userAuth = {};
        userAuth.account = options.data.account;
        userAuth.password = options.data.password;
        data.session_timestamp = new Date().getTime();
        data.userAuth = userAuth;
        Session.set(data);
        options.succ(data);
      } else {
        var errorMessage = '登录失败(' + data.code + ')：' + (data.error || '未知错误');
        var noSessionError = {
          code: constants.ERR_LOGIN_SESSION_NOT_RECEIVED,
          message: errorMessage
        };
        options.fail(noSessionError);
      }
    }
  }));
}

/**
 * 基本登录,使用账号密码方式登录
 * 进行服务器登录，以获得登录会话
 * @param {Object} options 登录配置
 * @param {string} options.data.oldpwd 旧密码
 * @param {string} options.data.newpwd 新密码
 *
 * @param {Object} options.header 请求头信息
 */
function changePwd(options) {
  console.log(options);
  if (!options){
    throw new Request.RequestError(constants.ERR_INVALID_PARAMS, "options参数缺失");
  }
  // if (!options.data.oldpwd){
  //   throw new Request.RequestError(constants.ERR_INVALID_PARAMS, "参数data.oldpwd缺失");
  // }
  // if (!options.data.newpwd){
  //   throw new Request.RequestError(constants.ERR_INVALID_PARAMS, "参数data.newpwd缺失");
  // }
  Request.request(utils.extend({}, options, {
    url: constants.SERVICE.changepwd,
    succ: function (data) {
      options.succ(data);
    }
  }));
}

/**
 * 使用微信授权方式登录
 * 进行服务器登录，以获得登录会话
 *
 * @param {Object} options 登录配置
 * @param {string} options.url 登录使用的 URL，服务器应该在这个 URL 上处理登录请求
 * @param {string} [options.method] 请求使用的 HTTP 方法，默认为 "GET"
 * @param {Function} options.succ(userInfo) 登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} options.fail(error) 登录失败后的回调函数，参数 error 错误信息
 * @param {Object} options.header 请求头信息
 */
function loginAuto(options) {
  console.log('api login called')
  getLoginCode(function (wxLoginError, wxLoginResult) {
    if (wxLoginError) {
      options.fail(wxLoginError);
      return;
    }

    var userInfo = wxLoginResult.userInfo;

    // 构造请求头，包含 code、encryptedData 和 iv
    var code = wxLoginResult.code;
    var encryptedData = wxLoginResult.encryptedData;
    var iv = wxLoginResult.iv;
    var header = {};
    console.log("code=" + code);
    console.log("encryptData=" + encryptedData);
    console.log("iv=" + iv);

    header[constants.WX_HEADER_CODE] = code;
    header[constants.WX_HEADER_ENCRYPTED_DATA] = encryptedData;
    header[constants.WX_HEADER_IV] = iv;

    Request.request(utils.extend({}, options, {
      header: header,
      url: constants.SERVICE.loginauto,
      succ: function (data) {
        if (data.session_token) {
          data.userInfo = userInfo;
          Session.set(data);
          options.succ(data);
        } else {
          var errorMessage = '登录失败(' + data.code + ')：' + (data.error || '未知错误');
          var noSessionError = {
            code: constants.ERR_LOGIN_SESSION_NOT_RECEIVED,
            message: errorMessage
          };
          options.fail(noSessionError);
        }
      }
    }));

  });

}

module.exports = {
  login: loginBasic,
  changePwd: changePwd
}





