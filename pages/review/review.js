// pages/review/review.js
const app = getApp()  //获取应用实例
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 0,
    no_more: false,
    txt: {}
  },

  getFeedbackListFn(){
    let that = this;
    let prm = { "token": "", "page": this.data.page, "pagesize": "10" };
    http.Post("order/getAllComments", prm, function (res) {
      //console.log(res);
      if (res.errcode == 1) {
        if (res.data.length < 1) {
          that.setData({
            no_more: true
          });
        } else {
          let arr = that.data.list;
          let pg = that.data.page + 1;
          for (let i in res.data) {
            arr.push(res.data[i]);
          }
          that.setData({
            list: arr,
            page: pg
          });
        }
      } else {
        wx.showModal({
          title: '',
          content: res.errmsg
        })
      }
    }, function (err) {
      wx.showModal({
        title: '',
        content: err
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFeedbackListFn()
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
    this.setData({
      txt: app.globalData.cont.review
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
    if (!this.data.no_more) {
      this.getFeedbackListFn()
    }
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