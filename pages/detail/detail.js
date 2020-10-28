// pages/detail/detail.js
const app = getApp()  //获取应用实例
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ix: false,
    prodId: "",
    skuId: "",
    prodInfo: {},
    selectArr: [],
    selectInd: 0,
    current: 0,
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    hide_animaImg: true,
    cartNum: 0,
    txt: {},
    uInfo: {},
    uId: ""
  },

  //事件处理函数
  swiperChange: function (e) {
    //console.log(e);
    this.setData({
      current: e.detail.current
    });
  },
  bindPickerChange: function (e) {
    //console.log(e);
    var ind = e.detail.value, info = this.data.prodInfo;
    this.setData({
      skuId: info.sku[ind].id,
      selectInd: ind,
      current: 0
    })
  },
  showOrHideFn: function(e) {
    let i = e.currentTarget.dataset.id;
    let tt = this.data.txt;
    tt.detail[i].sts = tt.detail[i].sts == "+" ? "-" : "+";
    this.setData({
      txt: tt
    })
  },
  toHomeFn: function() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  toProductFn: function () {
    wx.switchTab({
      url: '../product/product'
    })
  },
  toCartFn: function () {
    wx.navigateTo({
      url: '../cart/cart'
    });
  },
  toOrderFn: function () {
    wx.navigateTo({
      url: '../order/order?type=1&prodId=' + this.data.prodId + '&skuId=' + this.data.skuId
    });
  },
  moveFn: function (e) {
    var w = app.globalData.ww, h = app.globalData.wh;
    var half = app.globalData.ww / 750 * 127 / 2;
    var x = e.touches[0].clientX - half, y = e.touches[0].clientY - half;
    //console.log(half,x,y);
    if (x < 0) x = 0;
    if (x > w - 2 * half) x = w - 2 * half;
    if (y < 0) y = 0;
    if (y > h - 2 * half) y = h - 2 * half;
    this.setData({
      x: x + "px",
      y: y + "px"
    })
  },
  add2cartFn: function () {
    const query = wx.createSelectorQuery();
    var sX, sY, t, eX, eY, eW, eH, that = this;
    var param = {
      token: app.globalData.token,
      product_id: this.data.prodId,
      sku_id: this.data.skuId,
      product_num: 1,
      cart_type: 1,
      lang: app.globalData.lang
    };
    http.Post("User/addUserCart", param, function (res) {
      if (res.errcode == 1) {
        that.setData({
          hide_animaImg: false
        });
        let num = res.cart_count;
        query.select('.animaImg').boundingClientRect(function (rect) {
          //console.log(rect);
          sX = rect.left;
          sY = rect.top;
          t = rect.width / 10;
        }).select('.noBorder').boundingClientRect(function (rect) {
          //console.log(rect);
          eX = rect.left;
          eY = rect.top;
          eW = rect.width;
          eH = rect.height;
          var x = eX + (eW - t) / 2, y = eY + (eH - t) / 2;
          //console.log(x, y)
          that.animation.scale(0.1).left(x).top(y).step();
          that.setData({ animation: that.animation.export() });
          setTimeout(function () {
            that.setData({
              hide_animaImg: true,
              cartNum: num
            })
            that.animation.scale(1).left("50rpx").top("100rpx").step();
            that.setData({ animation: this.animation.export() });
          }.bind(that), 500);
        }).exec();
      } else {
        console.log(res.errmsg)
      }
    }, function (err) {
      console.log(err)
    })
  },
  getCartNumFn: function () {
    let that = this;
    http.Post("User/countUserCart", { token: app.globalData.token }, function (res) {
      if (res.errcode == 1) {
        //console.log(res)
        that.setData({
          cartNum: res.cart_count
        })
      } else {
        console.log(res.errmsg)
      }
    }, function (err) {
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pId = options.prodId;
    this.setData({
      prodId: pId
    })
    if (app.globalData.model.indexOf("iPhone X") > -1) {
      this.setData({
        ix: true
      })
    }
    let that = this, lg = app.globalData.lang, fromPage = options.fromPage ? options.fromPage : '';
    let param = { "token": app.globalData.token, "menuId": pId, "fromPage": fromPage, "lang": lg };
    http.Post("Product/getProductDetail", param, function (res) {
      if (res.errcode == 1) {
        var arr = [], list = res.data;
        if (list.sku.length > 1) {
          for (var i in list.sku) {
            arr.push(list.sku[i].title)
          }
        }
        that.setData({
          prodInfo: res.data,
          skuId: res.data.sku[0].id,
          selectArr: arr
        })
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
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.animation = wx.createAnimation({ duration: 500, transformOrigin: '0 0 0' })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      txt: app.globalData.cont.detail,
      uInfo: app.globalData.userInfo,
      uId: app.globalData.userId
    });
    this.getCartNumFn();
    let that = this;
    wx.getStorage({
      key: 'cart',
      success: function(res) {
        let num = Number(res.data)
        that.setData({
          cartNum: num
        });
        wx.removeStorage({ key: 'cart' });
      }
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
  onShareAppMessage: function (res) {
    return {
      title: "The Ultimate Daily all-in-one supplement",
      path: '/pages/index/index?scene=' + app.globalData.userId,
      imageUrl: 'https://athleticgreens.fugumobile.cn/imgs/share.jpg'
    }
  }
})