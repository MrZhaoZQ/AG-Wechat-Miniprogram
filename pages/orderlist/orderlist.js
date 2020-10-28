// pages/orderlist/orderlist.js
const app = getApp()  //获取应用实例
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["All", "Waiting for \n payment", "Waiting for \n shipping", "Waiting to \n receive", "Submit \n feedback"],
    activeIndex: 0,
    all: [],
    dfk: [],
    dfh: [],
    dsh: [],
    dpj: [],
    txt: {}
  },

  //事件处理函数
  tabClick: function (e) {
    var ind = e.currentTarget.id;
    this.setData({
      activeIndex: ind
    })
    if (ind == 3) {
      ind = 4
    } else if (ind == 4) {
      ind = 5
    }
    this.getOrderListFn(ind);
  },
  toOrderDetailFn: function(e){
    console.log("toOrderDetail")
  },
  cancelFn: function (id) {
    var that = this;
    http.Post("Order/cancel", { token: app.globalData.token, orderno: id }, function (res) {
      //console.log(res);
      if (res.errcode == 0) {
        that.getOrderListFn(that.data.activeIndex)
      } else {
        console.log(res.errmsg)
      }
    }, function (err) {
      console.log(err)
    })
  },
  payFn: function (id) {
    var that = this;
    var param = {
      "wx_user_id": app.globalData.token,
      "token": app.globalData.token,
      "order_no": id
    };
    http.Post("order/wxPayConfirm", param, function (res) {
      //console.log(res);
      if (res.errcode == 1) {
        wx.showLoading({
          title: "",
          mask: true
        });
        wx.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.package,
          signType: 'MD5',
          paySign: res.paySign,
          success(res) {
            wx.hideLoading();
            wx.navigateTo({
              url: '../payresult/payresult?res=suc&orderNo=' + param.order_no,
            })
          },
          fail(res) {
            wx.hideLoading();
            wx.navigateTo({
              url: '../payresult/payresult?res=fail&orderNo=' + param.order_no,
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '../payresult/payresult?res=fail&orderNo=' + param.order_no,
        })
      }
    }, function (err) {
      console.log(err)
    });
  },
  remindFn: function (id) {
    var that = this;
    http.Post("Order/remind", { token: app.globalData.token, orderno: id }, function (res) {
      if (res.errcode == 1) {
        wx.showModal({
          title: '',
          content: ' You have successfully sent a reminder\r\n发货提醒已发送成功',
        })
      } else {
        console.log(res.errmsg)
      }
    }, function (err) {
      console.log(err)
    })
  },
  receivedFn: function (id) {
    var that = this;
    http.Post("Order/receive", { token: app.globalData.token, orderno: id }, function (res) {
      //console.log(res);
      if (res.errcode == 1) {
        var typeNum = that.data.activeIndex == 3 ? 4 : that.data.activeIndex;
        that.getOrderListFn(typeNum);
      } else {
        console.log(res.errmsg)
      }
    }, function (err) {
      console.log(err)
    })
  },
  deleteFn: function (id) {
    var that = this;
    http.Post("order/delete", { token: app.globalData.token, orderno: id }, function (res) {
      //console.log(res);
      if (res.errcode == 1) {
        that.getOrderListFn(that.data.activeIndex)
      } else {
        console.log(res.errmsg)
      }
    }, function (err) {
      console.log(err)
    })
  },
  btnFn: function (e) {
    var type = e.currentTarget.dataset.type, orderNo = e.currentTarget.dataset.id;
    //console.log(type, orderNo);
    if (type == "Cancel" || type == "取消订单") {
      this.cancelFn(orderNo)
    } else if (type == "Pay now" || type == "去付款") {
      this.payFn(orderNo)
    } else if (type == "Remind" || type == "提醒发货") {
      this.remindFn(orderNo)
    } else if (type == "Delete" || type == "删除订单") {
      this.deleteFn(orderNo)
    } else if (type == "Received" || type == "确认收货") {
      this.receivedFn(orderNo)
    } else if (type == "Feedback" || type == "去评价") {
      wx.navigateTo({
        url: '../feedback/feedback?orderno=' + orderNo
      })
    }
  },
  getOrderListFn: function (s) {
    var that = this;
    http.Post("Order/getOrderList", { token: app.globalData.token, type: s, lang: app.globalData.lang }, function (res) {
      //console.log(res);
      if (res.errcode == 1) {
        if (s == 0) {
          that.setData({
            all: res.data
          })
        } else if (s == 1) {
          that.setData({
            dfk: res.data
          })
        } else if (s == 2) {
          that.setData({
            dfh: res.data
          })
        } else if (s == 4) {
          that.setData({
            dsh: res.data
          })
        } else if (s == 5) {
          that.setData({
            dpj: res.data
          })
        }
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
    //console.log(options)
    var _s = Number(options.ordertype);
    if (_s == 4 || _s == 5) {
      _s -= 1
    }
    this.setData({
      activeIndex: _s
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
  onShow: function (options) {
    if (app.globalData.lang == "cn") {
      this.setData({
        tabs: ["所有订单", "待付款", "待发货", "待收货", "去评价"],
        txt: {
          "statusTxt": [
            "",
            "待付款",
            "待发货",
            "已取消",
            "待收货",
            "待评价",
            "已评价"
          ],
          "btnTxt": {
            "0": [],
            "1": ["取消订单", "去付款"],
            "2": ["提醒发货"],
            "3": ["删除订单"],
            "4": ["确认收货"],
            "5": ["去评价"],
            "6": ["去评价"]
          },
          "orderNo": "订单编号",
          "expressNo": "快递单号"
        }
      })
    } else {
      this.setData({
        tabs: ["All", "Waiting for \n payment", "Waiting for \n shipping", "Waiting to \n receive", "Submit \n feedback"],
        txt: {
          "statusTxt": [
            "",
            "waiting for \n payment",
            "waiting for \n shipping",
            "cancelled",
            "waiting to \n receive",
            "submit \n feedback",
            "received \n feedback"
          ],
          "btnTxt": {
            "0": [],
            "1": ["Cancel", "Pay now"],
            "2": ["Remind"],
            "3": ["Delete"],
            "4": ["Received"],
            "5": ["Feedback"],
            "6": ["Feedback"]
          },
          "orderNo": "Order Number",
          "expressNo": "Express Number"
        }
      })
    }

    //点击返回按钮到此页时需更新订单列表信息
    var ind = Number(this.data.activeIndex);
    if (ind == 3 || ind == 4) {
      ind += 1
    }
    this.getOrderListFn(ind);
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