// pages/invoice/invoice.js
const app = getApp()  //获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIndividual: "circle",
    isCompany: "circle",
    gstt: "", //"公司抬头"
    qysh: "",  //"企业税号"
    txt: {}
  },

  //事件处理函数
  individualFn(e) {
    if (this.data.isIndividual != "success"){
      this.setData({
        isIndividual: "success",
        isCompany: "circle"
      })
    } else {
      this.setData({
        isIndividual: "circle"
      })
    }
  },
  companyFn() {
    if (this.data.isCompany != "success") {
      this.setData({
        isCompany: "success",
        isIndividual: "circle"
      })
    } else {
      this.setData({
        isCompany: "circle"
      })
    }
  },
  gsttBlurFn: function (e) {
    //console.log(e);
    this.setData({
      gstt: e.detail.value
    })
  },
  qyshBlurFn: function (e) {
    this.setData({
      qysh: e.detail.value
    })
  },
  saveFn() {
    if (this.data.isIndividual == "success") {
      wx.setStorageSync("invoice", "Individual invoice");
      wx.navigateBack({
        delta: 1
      });
      return false;
    } else if (this.data.isCompany == "success") {
      var _gstt = this.data.gstt, _qysh = this.data.qysh;
      if (_gstt == "") {
        wx.showModal({
          title: '',
          content: 'Please fill in your company title\r\n请输入公司抬头',
        });
        return false;
      } else if (_qysh == "") {
        wx.showModal({
          title: '',
          content: 'Please fill in your company tax number\r\n请输入企业税号',
        });
        return false;
      } else {
        var invoice = _gstt + ",;," +_qysh;
        wx.setStorageSync("invoice", invoice);
        wx.navigateBack({
          delta: 1
        });
      }
    } else {
      wx.setStorageSync("invoice", "no");
      wx.navigateBack({
        delta: 1
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _invoice = wx.getStorageSync("invoice");
    if (_invoice == "" || _invoice == "no") {
      return false
    } else if (_invoice == "Individual invoice") {
      this.setData({
        isIndividual: "success",
        isCompany: "circle"
      })
    } else {
      var _invoiceArr = _invoice.split(",;,");
      this.setData({
        isIndividual: "circle",
        isCompany: "success",
        gstt: _invoiceArr[0],
        qysh: _invoiceArr[1]
      });
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
          "person": "个人发票",
          "company": "企业发票",
          "gstt_ph": "公司抬头",
          "qysh_ph": "企业税号",
          "btn": "保存"
        }
      })
    } else {
      this.setData({
        txt: {
          "person": "Individual invoice",
          "company": "Enterprise invoice",
          "gstt_ph": "Company Name",
          "qysh_ph": "Enterprise Tax Number",
          "btn": "Save"
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