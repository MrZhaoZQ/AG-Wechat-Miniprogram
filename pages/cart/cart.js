// pages/cart/cart.js
const app = getApp()  //获取应用实例
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ix: false,
    prodsOfCart: [],  //购物车商品列表
    total: 0,
    txt: {}
  },

  //事件处理函数
  deleteFn: function () {
    var that = this;
    if (this.data.prodsOfCart.length < 1) return false;
    wx.showModal({
      title: '',
      content: 'Are you sure you want to delete all your cart products?\r\n确定要删除购物车的所有商品吗？',
      success (res) {
        if (res.confirm) {
          //console.log('yes')
          http.Post("User/emptyUserCart", {token: app.globalData.token}, function (res) {
            //console.log(res);
            if (res.errcode == 1) {
              that.setData({
                prodsOfCart: [],
                total: 0,
              })
            } else {
              console.log(res.errmsg)
            }
          }, function (err) {
            console.log(err)
          })
        } else if (res.cancel) {
          //console.log('no')
        }
      }
    })
  },
  toDetailFn : function(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../detail/detail?prodId=' + id + '&fromPage=cart'
    });
  },
  toOrderFn: function () {
    var prods = this.data.prodsOfCart, idsArr = [], skuIdsArr = [];
    if (prods.length < 1) {
      wx.showModal({
        title: '',
        content: 'Please first add products to your cart\r\n请先添加商品到购物车',
      })
    } else {
      for (var i = 0; i < prods.length; i++) {
        idsArr.push(prods[i].product_id);
        skuIdsArr.push(prods[i].sku.id);
      }
      var ids = idsArr.join(","), skuIds = skuIdsArr.join(",");
      wx.navigateTo({
        url: '../order/order?type=2&prodId=' + ids + '&skuId=' + skuIds
      });
    }
  },
  minusFn: function (e) {
    var id = e.currentTarget.dataset.id, skuId = e.currentTarget.dataset.skuid, that = this;
    var param = {
      token: app.globalData.token,
      product_id: id,
      sku_id: skuId,
      product_num: 1,
      cart_type: 2,
      lang: app.globalData.lang
    };
    http.Post("User/addUserCart", param, function (res) {
      //console.log(res);
      if (res.errcode == 1) {
        var list = that.data.prodsOfCart, t = that.data.total;
        for (var i in list) {
          if (list[i].sku.id == skuId) {
            t -= list[i].price;
            list[i].product_num <= 1 ? list.splice(i, 1) : list[i].product_num -= 1;
            that.setData({
              prodsOfCart: list,
              total: t
            })
          }
        }
      } else {
        wx.showModal({
          title: '',
          content: res.errmsg
        })
      }
    }, function (err) {
      console.log(err)
    })
  },
  addFn: function (e) {
    var id = e.currentTarget.dataset.id, skuId = e.currentTarget.dataset.skuid, that = this;
    var param = {
      token: app.globalData.token,
      product_id: id,
      sku_id: skuId,
      product_num: 1,
      cart_type: 1,
      lang: app.globalData.lang
    };
    http.Post("User/addUserCart", param, function (res) {
      //console.log(res);
      if (res.errcode == 1) {
        var list = that.data.prodsOfCart, t = that.data.total;
        for (var i in list) {
          if (list[i].sku.id == skuId) {
            t += list[i].price;
            list[i].product_num += 1;
            that.setData({
              prodsOfCart: list,
              total: t
            })
          }
        }
      } else {
        wx.showModal({
          title: '',
          content: res.errmsg
        })
      }
    }, function (err) {
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.model.indexOf("iPhone X") > -1) {
      this.setData({
        ix: true
      })
    }
    var that = this, lg = app.globalData.lang;
    http.Post("User/getUserCart", { token: app.globalData.token, lang: lg }, function (res) {
      //console.log(res);
      if (res.errcode == 1) {
        var t = 0;
        for (var j in res.data) {
          t += res.data[j].product_num * res.data[j].price
        }
        that.setData({
          prodsOfCart: res.data,
          total: t
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
    if (app.globalData.lang == "cn") {
      this.setData({
        txt: {
          "title": "已添加",
          "del": "清空",
          "total": "合计",
          "inc": "含税和运费",
          "btn": "下单",
          "gift": "赠品"
        }
      })
    } else {
      this.setData({
        txt: {
          "title": "Selected Product",
          "del": "Delete",
          "total": "Total",
          "inc": "inc.shipping & taxes",
          "btn": "ORDER NOW",
          "gift": "promotional gift"
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
    let num = this.data.prodsOfCart.length;
    wx.setStorage({
      key: 'cart',
      data: num
    })
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