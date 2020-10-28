// pages/intro/intro.js
const app = getApp()  //获取应用实例
const http = require("../../utils/http.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    icons: [
      "https://athleticgreens.fugumobile.cn/imgs/IB-icon2.png", "https://athleticgreens.fugumobile.cn/imgs/IB-icon1.png", "https://athleticgreens.fugumobile.cn/imgs/IB-icon3.png", "https://athleticgreens.fugumobile.cn/imgs/IB-icon5.png", "https://athleticgreens.fugumobile.cn/imgs/IB-icon4.png"
    ],
    ingts: [],
    current: 0,
    interval: 5000,
    duration: 1000,
    ah: 0,  //autoHeight
    showPopup: false,
    ics: ["+", "+", "+", "+", "+"],
    txt: {}
  },

  showOrHideFn: function (e) {
    let i = e.currentTarget.dataset.id;
    let status = this.data.ics;
    status[i] = status[i] == "+" ? "-" : "+";
    this.setData({
      ics: status
    })
  },
  swiperChangeFn(e) {
    this.setData({
      current: e.detail.current
    })
    this.autoHeight()
  },
  autoHeight() {
    let that = this, ct = this.data.current;
    wx.createSelectorQuery().select('.swpList' + ct).boundingClientRect(rect => {
      //console.log(rect)
      that.setData({
        ah: rect.height
      })
    }).exec();
  },
  toggleFn(e) {
    let ct = this.data.current;
    let list = this.data.ingts;
    let i = Number(e.currentTarget.id);
    if (list[ct][i].mark == 0) {
      list[ct][i].mark = 1
    } else {
      list[ct][i].mark = 0
    }
    this.setData({
      ingts: list
    })
    this.autoHeight()
  },
  showPopupFn() {
    this.setData({
      showPopup: true
    })
  },
  closePopupFn() {
    this.setData({
      showPopup: false
    })
  },
  getIngtsFn: function (getUrl) {
    let that = this;
    http.Get(getUrl, {}, function (res) {
      //console.log(res)
      that.setData({
        ingts: res.swp
      })
      setTimeout(function(){
        that.autoHeight();
      }, 2000)
    }, function (err) {
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.lang == "cn") {
      this.getIngtsFn("https://athleticgreens.fugumobile.cn/uploads/ingredients_cn.json");
    } else {
      this.getIngtsFn("https://athleticgreens.fugumobile.cn/uploads/ingredients_en.json");
    }
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
      txt: app.globalData.cont.intro
    });
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