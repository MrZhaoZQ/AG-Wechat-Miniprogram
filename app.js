//app.js
const http = require("./utils/http.js");
const ald = require('./utils/ald-stat.js');
App({
  onLaunch: function (options) {
    //console.log(options)
    var res = wx.getSystemInfoSync();
    this.globalData.model = res.model;
    this.globalData.ww = res.windowWidth;
    this.globalData.wh = res.windowHeight;
    if (res.language == "zh_CN") {
      this.globalData.lang = "cn"
    } else {
      this.globalData.lang = "en"
    }
  },
  onShow(options) {
    // Do something when show.
    //console.log(options)
    var suId = options.query.scene ? options.query.scene : "";
    this.globalData.share_user_id = suId;
    var that = this;
    wx.login({  //获取md5_key，然后在交互时再换取token
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        http.Post("wx/saveUserCode", { "code": res.code, "share_user_id": suId }, function (res) {
          //console.log(res);
          if (res.errcode == 1) {
            that.globalData.md5_key = res.md5_key;
            that.globalData.userId = res.id;
          } else {
            console.log(res.errmsg)
          }
        }, function (err) {
          console.log(err)
        });
      }
    });
    wx.getStorage({
      key: 'token',
      complete: function (res) {
        if (res.data) {
          that.globalData.token = res.data;
          http.Post("user/notify", { "token": res.data }, function (res) {
            //console.log(res);
            if (res.errcode == 1 && res.data > 0) {
              wx.showModal({
                title: '',
                content: 'Our Ultimate Daily formula works best if use consistently over the long-term. You have a 120¥ voucher that expires very soon, please make sure to buy your next pack soon for the best results. \r\n 我们的Ultimate Daily全面健康饮品在持续使用效果最佳，您价值120元的优惠券即将过期，为了获得最好的效果，请及时购买下个月的产品。',
                success(rs) {
                  if (rs.confirm) {
                    wx.navigateTo({
                      url: '../coupon/coupon'
                    })
                  }
                }
              })
            }
          }, function (err) {
            console.log(err)
          });
        }
      }
    });
  },
  onHide() {
    // Do something when hide.
  },
  onError(msg) {
    console.log(msg)
  },
  globalData: {
    md5_key: "",
    token: "",
    userInfo: null,
    share_user_id: "",
    userId: "",
    lang: "",
    cont: {},
    model: "",//设备型号
    ww: 0,//可使用窗口宽度
    wh: 0,//可使用窗口高度
  }
})