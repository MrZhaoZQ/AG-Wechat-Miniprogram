// pages/coupon/coupon.js
const app = getApp()  //获取应用实例
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  //事件处理函数
  dateToEnFn(t){
    var dt = new Date(t);
    var m = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec");
    var w = new Array("Monday", "Tuseday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
    var d = new Array("st", "nd", "rd", "th"),
      mn = dt.getMonth(),
      wn = dt.getDay(),
      dn = dt.getDate();
    var dns;
    if (((dn % 10) < 1) || ((dn % 10) > 3)) {
      dns = d[3];
    } else {
      dns = d[(dn % 10) - 1];
      if ((dn == 11) || (dn == 12)) {
        dns = d[3];
      }
    }
    return m[mn] + " " + dn + dns + ", " + dt.getFullYear()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    http.Post("User/getUserCoupon", { token: app.globalData.token }, function (res) {
      if (res.errcode == 1) {
        var list = res.data;
        if (list.length > 0) {
          for (var i in list) {
            list[i].amount = Number(list[i].amount);
            list[i].start_time_en = that.dateToEnFn(list[i].start_time);
            list[i].end_time_en = that.dateToEnFn(list[i].end_time);
            list[i].start_time = list[i].start_time.substr(0,10);
            list[i].end_time = list[i].end_time.substr(0, 10);
          }
        }
        that.setData({
          list: list
        })
      } else {
        console.log(res.errmsg)
      }
    }, function (err) {
      console.log(err)
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