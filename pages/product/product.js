// pages/product/product.js
const app = getApp()  //获取应用实例
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prods: [],
    is_authorize_Hidden: true
  },

  //事件处理函数
  toDetailFn: function (e) {
    if (app.globalData.token) {
      var prodId = e.currentTarget.id, that = this;
      http.Post("User/checkUserIsNew", { token: app.globalData.token, menu_id: prodId }, function (res) {
        //console.log(res);
        if (res.errcode == 1) {
          var dt = res.data;
          if (dt.new_user == 1) {
            if (dt.pop == 1) {
              wx.showModal({
                title: '',
                content: 'New customers can enjoy a special Welcome Pack discount. Would you prefer to choose this?\r\n您可以享受新用户优惠大礼包，点击确定了解详情',
                success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../detail/detail?prodId=' + dt.menu_id
                    })
                  } else if (res.cancel) {
                    wx.navigateTo({
                      url: '../detail/detail?prodId=' + prodId
                    })
                  }
                }
              })
            } else {
              wx.navigateTo({
                url: '../detail/detail?prodId=' + prodId
              })
            }
          } else {
            if (dt.alert == 1) {
              wx.showModal({
                title: '',
                content: 'This product is for new customers only\r\n该产品仅限新用户购买',
              })
            } else {
              wx.navigateTo({
                url: '../detail/detail?prodId=' + prodId
              })
            }
          }
        } else if (res.errcode == -1001) {
          that.setData({
            is_authorize_hidden: false
          });
        } else {
          console.log(res.errmsg)
        }
      }, function (err) {
        console.log(err)
      })
    } else {
      this.setData({  //获取token 授权获取用户信息
        is_authorize_Hidden: false
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this, lg = app.globalData.lang;
    http.Post("Product/getProductList", { token: app.globalData.token, lang: lg, userId: app.globalData.share_user_id }, function (res) {
      if (res.errcode == 1) {
        that.setData({
          prods: res.data
        })
      } else {
        console.log(res.errmsg)
      }
    }, function (err) {
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "The Ultimate Daily all-in-one supplement",
      path: '/pages/index/index?scene=' + app.globalData.userId,
      imageUrl: 'https://athleticgreens.fugumobile.cn/imgs/share.jpg'
    }
  }
})