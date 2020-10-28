// pages/order/order.js
const app = getApp()  //获取应用实例
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ix: false,
    buyType: "",
    address: {},
    addressId: "",
    invoiceType: "",
    individualOrNo: "",
    gstt: "", //公司抬头
    qysh: "", //企业税号
    prodlist: [],
    promolist: [],
    subedlist: [],
    msg: "",
    usePts: false,
    useCps: false,
    exNum: 0,
    points: 0,
    coupons: [],
    cpNum: 0,
    cpVal: 0, //优惠券的面值
    total: 0,
    giftNum: 0,
    code: "",
    showClause: true,
    checkedCluase: false,
    submitable: true,
    txt: {}
  },

  //事件处理函数
  toAddressFn: function () {
    wx.navigateTo({
      url: '../address/address?pageFrom=order'
    })
  },
  toInvoiceFn: function () {
    wx.navigateTo({
      url: '../invoice/invoice'
    })
  },
  blurFn: function () {
    if (this.data.code == "") {
      return false
    }
    this.setData({
      submitable: false
    });
    let prm = {
      "token": app.globalData.token,
      "promo_code": this.data.code,
      "lang": app.globalData.lang
    };
    let that = this;
    http.Post("Coupon/promoCode", prm, function (res) {
      console.log(res);
      let num = that.data.giftNum;
      if (res.errcode == 0) {
        num += 1
      } else {
        wx.showModal({
          title: '',
          content: res.errmsg,
        });
        //num = 0;
      }
      that.setData({
        giftNum: num,
        submitable: true
      })
    }, function (err) {
      console.log(err)
    });
  },
  minusFn(e){
    //console.log(e.target.dataset.type)
    if (e.target.dataset.type=="buy"){
      var id = e.currentTarget.dataset.id, list = this.data.prodlist, t = this.data.total;
      for (var i in list) {
        if (list[i].sku.id == id) {
          t -= list[i].price;
          //t = t < 0 ? 0 : t;
          if (list[i].product_num <= 1) {
            list.splice(i, 1)
          } else {
            list[i].product_num -= 1;
          }
        }
      }
      var prlist = this.data.promolist;
      for (let j in prlist) {
        for (let k in prlist[j].target_sku_id) {
          if (prlist[j].target_sku_id[k] == id) {
            prlist[j].product_num -= prlist[j].promo_num[k]
          }
        }
      }
      this.setData({
        prodlist: list,
        promolist: prlist,
        total: t
      })
    } else if (e.target.dataset.type == "subed") {
      var id = e.currentTarget.dataset.id, list = this.data.subedlist, t = this.data.total;
      for (var i in list) {
        if (list[i].sku.id == id) {
          t -= list[i].price;
          //t = t < 0 ? 0 : t;
          if (list[i].product_num <= 1) {
            list.splice(i, 1)
          } else {
            list[i].product_num -= 1;
          }
        }
      }
      this.setData({
        subedlist: list,
        total: t
      })
    } else if (e.target.dataset.type == "exchange") {
      var num = this.data.exNum;
      if (num > 1) {
        num--;
        this.setData({
          exNum: num
        });
      } else {
        this.setData({
          usePts: false,
          exNum: 0
        })
      }
    } else if (e.target.dataset.type == "useCps") {
      var num = this.data.cpNum, t = this.data.total, cv = this.data.cpVal;
      if (!this.data.useCps) {
        num >= 1 ? num-- : num = 0;
        this.setData({
          useCps: false,
          cpNum: num,
        });
        return false;
      }
      if (num > 1) {
        num--;
        t += cv;
        this.setData({
          cpNum: num,
          total: t
        })
      } else if(num==1) {
        num--;
        t += cv;
        this.setData({
          useCps: false,
          cpNum: num,
          total: t
        })
      } else {
        this.setData({
          useCps: false,
          cpNum: 0
        })
      }
    }
  },
  addFn(e){
    if (e.target.dataset.type == "buy") {
      var id = e.currentTarget.dataset.id, list = this.data.prodlist, t = this.data.total;
      for (var i in list) {
        if (list[i].sku.id == id) {
          t += list[i].price;
          list[i].product_num += 1;
        }
      }
      var prlist = this.data.promolist;
      for (let j in prlist) {
        for (let k in prlist[j].target_sku_id) {
          if (prlist[j].target_sku_id[k] == id) {
            prlist[j].product_num += prlist[j].promo_num[k]
          }
        }
      }
      this.setData({
        prodlist: list,
        promolist: prlist,
        total: t
      })
    } else if (e.target.dataset.type == "subed") {
      var id = e.currentTarget.dataset.id, list = this.data.subedlist, t = this.data.total;
      for (var i in list) {
        if (list[i].sku.id == id) {
          if (list[i].product_num >= list[i].max_num) {
            console.log("max is " + list[i].max_num)
            // wx.showModal({
            //   title: '',
            //   content: '',
            // })
          } else {
            t += list[i].price;
            list[i].product_num += 1;
          }
        }
      }
      this.setData({
        subedlist: list,
        total: t
      })
    } else if (e.target.dataset.type == "exchange") {
      var num = this.data.exNum, max = parseInt(this.data.points / 100);
      if (num < max) {
        num++;
        this.setData({
          usePts: true,
          exNum: num
        })
      }
    } else if (e.target.dataset.type == "useCps") {
      var num = this.data.cpNum, cps = this.data.coupons.length, t = this.data.total, cv = this.data.cpVal;
      if (num < cps) {
        num++;
        t -= cv;
        this.setData({
          useCps: true,
          cpNum: num,
          total: t
        })
      }
    }
  },
  usePtsFn: function () {
    var uPts = this.data.usePts;
    uPts = uPts ? false : true;
    this.setData({
      usePts: uPts
    })
  },
  useCpsFn: function () {
    var uCps = this.data.useCps, t = this.data.total, cn = this.data.cpNum, cv = this.data.cpVal;
    if (uCps) {
      uCps = false;
      t += cn * cv;
    } else {
      uCps = true;
      t -= cn * cv;
    }
    this.setData({
      useCps: uCps,
      total: t
    })
  },
  codeIptFn: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  msgIptFn: function (e) {
    this.setData({
      msg: e.detail.value
    })
  },
  changeFn: function () {
    let check = this.data.checkedCluase;
    check = check ? false : true;
    this.setData({
      checkedCluase: check
    })
  },
  submitFn: function () {
    if (!this.data.submitable) {
      return false
    }
    if (this.data.prodlist.length < 1 && this.data.subedlist.length < 1) {
      wx.showModal({
        title: '',
        content: 'Please first add products\r\n请先添加商品',
      })
      return false
    }
    var that = this, dt = this.data, invTp = 1;
    if (!dt.addressId){
      wx.showModal({
        title: '',
        content: 'Please first save your shipping address\r\n请先添加收货地址',
      })
      return false
    }
    if (!dt.checkedCluase && dt.showClause) {
      wx.showModal({
        title: '',
        content: 'Please read and agree with the Order Notice\r\n请先阅读并同意购买须知',
      })
      return false
    }
    wx.showLoading({
      title: "",
      mask: true
    });
    if (dt.invoiceType == "individual") {
      invTp = 1
    } else if (dt.invoiceType == "company") {
      invTp = 2
    }
    var prods = {}, subeds = [];
    for (var i in dt.prodlist) {
      prods[dt.prodlist[i].sku.id] = dt.prodlist[i].product_num
    }
    for (var j in dt.promolist) {
      prods[dt.promolist[j].product_sku_id] = dt.promolist[j].product_num
    }
    for (let k in dt.subedlist) {
      let obj = {}
      obj.sub_detail_id = dt.subedlist[k].sub_detail_id;
      obj.product_num = dt.subedlist[k].product_num;
      obj.product_type = dt.subedlist[k].product_type;
      obj.price = dt.subedlist[k].price;
      subeds.push(obj)
    }
    var param = {
      "token": app.globalData.token,
      "product_info": prods,
      "subscribed_product": subeds,
      "address_id": dt.addressId,
      "invoic_type": invTp,
      "order_type": dt.buyType,
      "company": dt.gstt,
      "tax": dt.qysh,
      "use_point": dt.exNum,
      "use_coupon": dt.cpNum,
      "gift": dt.giftNum,
      "promo_code": dt.code,
      "msg": dt.msg
    };
    http.Post("order/saveOrderInfo", param, function (res) {
      //console.log(res);
      if (res.errcode == 1) {
        var prm = {
          "wx_user_id": app.globalData.token,
          "token": app.globalData.token,
          "order_no": res.data
        };
        checkPayFn(prm);
        wx.removeStorage({ key: 'addressId' });
        wx.removeStorage({ key: 'invoice' });
      } else if (res.errcode == 0) {
        var prm = {
          "wx_user_id": app.globalData.token,
          "token": app.globalData.token,
          "order_no": res.data
        };
        wx.hideLoading();
        wx.showModal({
          title: '',
          content: res.hint_msg,
          showCancel: false,
          success(res) {
            wx.showLoading({
              title: "",
              mask: true
            });
            checkPayFn(prm);
            wx.removeStorage({ key: 'addressId' });
            wx.removeStorage({ key: 'invoice' });
          }
        });
      } else if (res.errcode == 100) {
        wx.hideLoading();
        wx.navigateTo({
          url: '../payresult/payresult?res=suc&orderNo=' + res.data
        })
      } else if (res.errcode == -100) {
        wx.hideLoading();
        wx.showModal({
          title: '',
          content: 'Insufficient stock...\r\n库存不足...',
        })
      } else if (res.errcode == -200) {
        wx.hideLoading();
        wx.showModal({
          title: '',
          content: 'Welcome Pack can only be bought one \r\n Welcome Pack的购买数量不能超过1',
        })
      } else if (res.errcode == -300) {
        wx.hideLoading();
        wx.showModal({
          title: '',
          content: 'Please provide your ID Card / Passport Number to proceed order. \r\n 请提供收货人的身份证号码／护照号码，以继续下单。',
        })
      } else {
        wx.hideLoading();
        wx.showModal({
          title: '',
          content: 'Network failure, please try later\r\n网络故障，请稍后重试',
        })
      }
    }, function (err) {
      console.log(err);
    });

    function checkPayFn(prm){
      http.Post("order/wxPayConfirm", prm, function (res) {
        //console.log(res);
        if (res.errcode == 1) {
          wx.requestPayment({
            timeStamp: res.timeStamp,
            nonceStr: res.nonceStr,
            package: res.package,
            signType: 'MD5',
            paySign: res.paySign,
            success(res) {
              wx.hideLoading();
              wx.navigateTo({
                url: '../payresult/payresult?res=suc&orderNo=' + prm.order_no
              })
            },
            fail(res) {
              wx.hideLoading();
              wx.navigateTo({
                url: '../payresult/payresult?res=fail&orderNo=' + prm.order_no
              })
            }
          })
        } else {
          wx.navigateTo({
            url: '../payresult/payresult?res=fail&orderNo=' + prm.order_no
          })
        }
      }, function (err) {
        console.log(err)
      });
    }
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
    this.setData({
      "buyType": options.type
    });
    var param = {
      "token": app.globalData.token,
      "product_id": options.prodId,
      "sku_id": options.skuId,
      "order_type": options.type,
      "lang": app.globalData.lang
    }, that = this;
    http.Post("User/orderConfirm", param, function (res) {
      if (res.errcode == 1) {
        var t = 0, prods = res.data.product_info, subscProds = res.data.subscribed_product, addr = {}, addrId = "", cps = [], val = 0;
        if (res.data.address_info) {
          addr = res.data.address_info;
          addrId = res.data.address_info.id;
        }
        if (res.data.coupon_info.length > 0) {
          cps = res.data.coupon_info;
          val = Number(res.data.coupon_info[0].amount);
        }
        for (let i in prods) {
          t += prods[i].product_num * prods[i].price
        }
        for (let j in subscProds) {
          t += subscProds[j].product_num * subscProds[j].price
        }
        if (that.data.useCps) {
          t -= val
        }
        that.setData({
          address: addr,
          addressId: addrId,
          prodlist: prods,
          promolist: res.data.promo_gift_info,
          subedlist: subscProds,
          points: res.data.point_info,
          coupons: cps,
          cpVal: val,
          total: t,
          giftNum: res.data.gift
        })
      } else {
        console.log(res.errmsg)
      }
    }, function (err) {
      console.log(err)
    });
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
        individualOrNo: "发票信息",
        txt: {
          "noAddr": "添加收货地址",
          "giftName": "Ultimate Daily 旅行装 (20 天)",
          "free": "活动赠品",
          "exchange": "积分兑换品",
          "remain": "余",
          "usePt": "使用积分 ",
          "pTip": "100分可以兑换Ultimate Daily 20天旅行装",
          "useCp": "使用优惠券 ",
          "leaveMsg": "留言: ",
          "codeName": "折扣码",
          "codeTip": "请输入折扣码",
          "clauseTxt": "我已阅读并同意该条款",
          "cTip": "每次购买AG（订购以外）的时候都能获赠一张价值120元的优惠券，您可以在下次购买的时候使用"
        }
      })
    } else {
      this.setData({
        individualOrNo: "Details on the invoice",
        txt: {
          "noAddr": "Please add your shipping address",
          "giftName": "Ultimate Daily Travel Pack (20-Days)",
          "free": "Promotional Gift",
          "exchange": "Points Reward Gift",
          "remain": "remains",
          "usePt": "Use points ",
          "pTip": "100 points for a FREE Ultimate Daily 20-Day Travel Pack",
          "useCp": "Use voucher ",
          "leaveMsg": "Leave your message here: ",
          "codeName": "Discount Code",
          "codeTip": "Please enter your Discount Code",
          "clauseTxt": "I have read and agree to the Terms & Condition",
          "cTip": "Upon every perchase (excluding Subscription) you will receive a ￥120 voucher to be used on your next purchase"
        }
      })
    }
    var _addressId = wx.getStorageSync("addressId");
    var _invoice = wx.getStorageSync("invoice");
    var that = this;
    if(_addressId){
      var param = {
        "token": app.globalData.token,
        "address_id": _addressId
      };
      http.Post("User/getAddressDetail", param, function (res) {
        //console.log(res);
        if (res.errcode == 1) {
          that.setData({
            address: res.data,
            addressId: _addressId
          })
        } else {
          console.log(res.errmsg)
        }
      }, function (err) {
        console.log(err)
      });
    }
    if (_invoice == "") {
      return false
    } else if (_invoice == "no") {
      this.setData({
        invoiceType: "no",
        individualOrNo: app.globalData.lang == "cn" ? "不开发票" : "Not invoicing",
        gstt: "",
        qysh: ""
      })
    } else if (_invoice == "Individual invoice") {
      this.setData({
        invoiceType: "individual",
        individualOrNo: app.globalData.lang == "cn" ? "个人发票" : "Individual invoice",
        gstt: "",
        qysh: ""
      })
    } else {
      var _invoiceArr = _invoice.split(",;,");
      this.setData({
        invoiceType: "company",
        gstt: _invoiceArr[0],
        qysh: _invoiceArr[1]
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
    //console.log("here")
    wx.removeStorage({ key: 'addressId' });
    wx.removeStorage({ key: 'invoice' });
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