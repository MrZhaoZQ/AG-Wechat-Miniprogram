//配置域名
const REMOTE_HOST = "https://athleticgreens.fugumobile.cn/api/";

/**
 * 请求
 */
function request(url, data, method, success, fail) {
  //url = REMOTE_HOST + url;
  url = url.indexOf("http") > -1 ? url : REMOTE_HOST + url;
  wx.request({
    url: url,
    data: data,
    method: method,
    header: {
      'content-type': "application/json; charset=utf-8",
    },
    dataType: "json",
    success: function (res) {
      success(res.data);
    },
    fail: function (res) {
      fail(res.data);
    },
  })
}


/**
 * get
 */
function Get(url, data, success, fail) {
  request(url, data, "GET", success, fail);
}

/**
 * post
 */
function Post(url, data, success, fail) {
  request(url, data, "POST", success, fail);
}

module.exports = {
  REMOTE_HOST: REMOTE_HOST,
  Get: Get,
  Post: Post,
}