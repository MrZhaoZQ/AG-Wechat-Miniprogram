// components/authorize/authorize.js
const app = getApp(); //获取应用实例
const http = require("../../utils/http.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    authorizeHidden: {
      type: Boolean,
      value: true
    }, //这里定义了authorizeHidden属性，属性值可以在组件使用时指定.写法为authorize-hidden
    fromPage: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    authorizeHidden: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show: function () {
      this.setData({
        authorizeHidden: false
      })
    },
    hide: function () {
      this.setData({
        authorizeHidden: true
      })
    },
    getUserInfo: function (e) {
      //console.log(this.properties)
      if (!e.detail.userInfo) {
        console.log("拒绝授权")
        if (this.properties.fromPage == "index"){
          this.setData({
            authorizeHidden: true
          });
        }
        return false;
      }
      
      //app.globalData.userInfo = e.detail.userInfo;
      var param = {
        "signature": e.detail.signature,
        "raw_data": e.detail.rawData,
        "encrypted_data": e.detail.encryptedData,
        "md5_key": app.globalData.md5_key,
        "iv": e.detail.iv,
        "share_user_id": app.globalData.share_user_id
      };
      var that = this;
      http.Post("wx/saveUserInfo", param, function (res) { //更新userInfo到数据库
        console.log(res);
        if (res.errcode == 1) {
          //更新用户数据成功
          app.globalData.token = res.token;
          app.globalData.userInfo = res.data;
          app.globalData.userId = res.data.id;
          wx.setStorage({
            key: 'token',
            data: res.token
          });
          var myEventDetail = {
            userInfo: res.data
          };
          that.triggerEvent('myevent', myEventDetail);

          http.Post("user/notify", { "token": res.token }, function (res) {
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
        } else {
          //更新用户数据失败
        }
      }, function (err) {
        console.log(err);
      });
      
      this.setData({
        authorizeHidden: true
      }); 
    }
  }
})
