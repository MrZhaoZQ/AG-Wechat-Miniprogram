// pages/address/address.js
const app = getApp()  //获取应用实例
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageFrom: "",
    addrlist: [],
    txt: {}
  },
  
  //事件处理函数
  clickFn: function (e) {
    var _from = this.data.pageFrom;
    if(_from == "order"){
      var addressId = e.currentTarget.id;
      wx.setStorageSync("addressId", addressId);
      wx.navigateBack({
        delta: 1
      });
    }else{
      var addressId = e.currentTarget.id;
      wx.navigateTo({
        url: '../editAddress/editAddress?addressId=' + addressId
      })
    }
  },
  setDefaultFn: function (e) {
    var addrId = e.currentTarget.dataset.id, that = this, list = this.data.addrlist, def = 1;
    for (var i in list) {
      if (addrId == list[i].id) {
        def = list[i].default == 1 ? 2 : 1;
        list[i].default = def;
      } else {
        list[i].default = 2;
      }
    }
    var param = {
      token: app.globalData.token,
      address_id: addrId,
      default: def
    };
    http.Post("User/saveUserAddress", param, function (res) {
      if (res.errcode == 1) {
        that.setData({
          addrlist: list
        })
      } else {
        console.log(res.errmsg)
      }
    }, function (err) {
      console.log(err)
    });
  },
  editAddrFn: function (e) {
    var addrId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../editAddress/editAddress?addressId=' + addrId
    })
  },
  deleteAddrFn: function (e) {
    var addrId = e.currentTarget.dataset.id, that = this;
    http.Post("User/delUserAddress", { token: app.globalData.token, address_id: addrId }, function (res) {
      if (res.errcode == 1) {
        var _addrlist = that.data.addrlist;
        for (var i in _addrlist) {
          if(addrId==_addrlist[i].id){
            _addrlist.splice(i, 1); 
          }
        }
        that.setData({
          addrlist: _addrlist
        })
      } else {
        console.log(res.errmsg)
      }
    }, function (err) {
      console.log(err)
    });
  },
  toEditAddressFn: function () {
    wx.navigateTo({
      url: '../editAddress/editAddress'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _from = options.pageFrom;
    if(_from){
      this.setData({
        pageFrom: _from
      })
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
    if (app.globalData.lang == "cn") {
      this.setData({
        txt: {
          "def": "默认",
          "addNew": "添加收货地址"
        }
      })
    } else {
      this.setData({
        txt: {
          "def": "default",
          "addNew": "Add new address"
        }
      })
    }
    var that = this;
    getAddrList();
    function getAddrList() {  //获取地址信息列表
      http.Post("User/getAddressList", { token: app.globalData.token }, function (res) {
        //console.log(res);
        if (res.errcode == 1) {
          that.setData({
            addrlist: res.data
          })
        } else {
          console.log(res.errmsg)
        }
      }, function (err) {
        console.log(err)
      });
    };
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