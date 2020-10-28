// pages/help/help.js
const app = getApp()  //获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: ["+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+"],
    txt: {}
  },

  //事件处理函数
  showOrHideFn: function (e) {
    var i = e.currentTarget.dataset.id;
    var s = this.data.status;
    s[i] = s[i] == "+" ? "-" : "+";
    this.setData({
      status: s
    })
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
    this.setData({
      txt: app.globalData.cont.faq
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