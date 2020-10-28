// pages/payresult/payresult.js
const app = getApp()  //获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: "suc",
    orderNo: "",
    txt: {}
  },

  //事件处理函数
  toIndexFn: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  toCheckFn: function () {
    wx.navigateTo({
      url: '../orderlist/orderlist?ordertype=2',
    })
  },
  toPayFn: function () {
    wx.navigateTo({
      url: '../orderlist/orderlist?ordertype=1',
    })
  },
  orderMsgFn: function () {
    if (wx.requestSubscribeMessage) {
      wx.requestSubscribeMessage({
        tmplIds: [
          'qgF4NbOqWgtPTElc_igTaQSKuX_oEnQMbRH4nPGbA-c',
          //'u-oLA_ZONIw-9RJ_k27poFwfzkmzpT4pTrgvB64WvLo',
          'OT8KU1LlePTL5w5spdvJF7CSrXrGGh4iJqG9J53lmtQ',
          'uY3tJV3ugRDVvwqLIfL8pvVlPodCrgcohAmpt1K9h1I'
        ],
        success(res) {
          //console.log(res)
          //res.qgF4NbOqWgtPTElc_igTaQSKuX_oEnQMbRH4nPGbA-c => "accept"
          //res.qgF4NbOqWgtPTElc_igTaQSKuX_oEnQMbRH4nPGbA-c => "reject"
        },
        fail(err) {
          console.log(err)
        }
      })
    } else {
      wx.showModal({
        title: '',
        content: 'The current wechat version is too low to use this function. Please upgrade to the latest wechat version and try again.\r\n当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      result: options.res,
      orderNo: options.orderNo
    })
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
    if (app.globalData.lang == "cn") {
      this.setData({
        txt: {
          "suc": "支付成功",
          "fail": "支付失败",
          "toHome": "返回首页",
          "toPay": "重新付款",
          "toOrder": "查看订单",
          "msgBtn": "担心错过120元优惠券？一键订阅到期提醒"
        }
      })
    } else {
      this.setData({
        txt: {
          "suc": "Payment Successful",
          "fail": "Payment Not Successful",
          "toHome": "Go back to homepage",
          "toPay": "Retry payment",
          "toOrder": "Check your order",
          "msgBtn": "Remind me before my 120 voucher expires"
        }
      })
    }
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