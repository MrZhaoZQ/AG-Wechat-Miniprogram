//index.js
const app = getApp()  //获取应用实例
const http = require("../../utils/http.js")
Page({
  data: {
    lang: "",
    is_authorize_hidden: true,
    page_name: "index",
    cartNum: 0,
    indicatorDots: true,
    autoplay: false,
    current: 0,
    interval: 5000,
    duration: 1000,
    prods: [],
    benefitSwiper: {
      imgUrls: [
        'https://athleticgreens.fugumobile.cn/imgs/v2020/kb1.png',
        'https://athleticgreens.fugumobile.cn/imgs/v2020/kb2.png',
        'https://athleticgreens.fugumobile.cn/imgs/v2020/kb3.png',
        'https://athleticgreens.fugumobile.cn/imgs/v2020/kb4.png',
        'https://athleticgreens.fugumobile.cn/imgs/v2020/kb5.png'
      ],
      current: 0,
      circular: true,
      interval: 5000,
      duration: 1000
    },
    recommendSwiper: {
      imgUrls: [
        'https://athleticgreens.fugumobile.cn/imgs/v2020/cust1.png',
        'https://athleticgreens.fugumobile.cn/imgs/v2020/cust2.png',
        'https://athleticgreens.fugumobile.cn/imgs/v2020/cust3.png',
        'https://athleticgreens.fugumobile.cn/imgs/v2020/cust4.png',
        'https://athleticgreens.fugumobile.cn/imgs/v2020/cust5.png'
      ],
      current: 0,
      circular: true,
      interval: 5000,
      duration: 1000,
    },
    txt: {},
    uInfo: {},
    uId: ""
  },
  
  //事件处理函数
  changeLangFn: function(){
    var lg = this.data.lang, that = this;
    lg = lg == "cn" ? "en" : "cn";
    http.Get("index/text", { "lang": lg, "token": app.globalData.token }, function (res) {
      //console.log(res);
      if (res.code == 1) {
        app.globalData.lang = lg;
        app.globalData.cont = res.data.txt;
        that.setData({
          lang: lg,
          txt: res.data.txt.home
        });
        var bars = lg == "cn" ? ["首页", "产品", "我的"] : ["HOME", "PRODUCT", "ME"];
        for (let i = 0; i < bars.length; i++) {
          wx.setTabBarItem({
            index: i,
            text: bars[i]
          })
        }
        that.getProdsFn(lg);
      } else {
        console.log(res.errmsg)
      }
    }, function (err) {
      console.log(err)
    });
  },
  getProdsFn: function (lg) {
    let that = this;
    http.Post("Product/getProductList", { token: app.globalData.token, lang: lg, userId: app.globalData.share_user_id }, function (res) {
      //console.log(res);
      if (res.errcode == 1) {
        that.setData({
          prods: res.data
        })
      } else {
        console.log(res.errmsg)
      }
    }, function (err) {
      console.log(err)
    })
  },
  specBtnFn: function () {
    if (app.globalData.token) {
      this.confirmlinktoFn("order_button")
    } else {
      this.setData({
        is_authorize_hidden: false
      })
    }
  },
  confirmlinktoFn(type) {
    let that = this;
    http.Post("User/linkUserToProduct", { "token": app.globalData.token, "type": type }, function (res) {
      //console.log(res);
      if (res.errcode == 1) {
        if (res.data.menuId) {
          wx.navigateTo({
            url: '../detail/detail?prodId=' + res.data.menuId
          })
        } else {
          wx.switchTab({
            url: '../product/product'
          })
        }
      } else if (res.errcode == -1001) {
        that.setData({
          is_authorize_hidden: false
        });
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
  toFn: function () {
    //console.log(this.data.current);
    let crt = this.data.current, that = this;
    if (crt == 0) {
      if (app.globalData.token) {
        this.confirmlinktoFn("banner")
      } else {
        that.setData({
          is_authorize_hidden: false
        })
      }
    } else if (crt==1) {
      wx.navigateTo({
        url: '../intro/intro'
      })
    } else if (crt == 2) {
      wx.navigateTo({
        url: '../review/review'
      })
    }
  },
  toDetailFn: function (e) {
    if (app.globalData.token){
      var prodId = e.currentTarget.id, that = this;
      http.Post("User/checkUserIsNew", { token: app.globalData.token, menu_id: prodId }, function (res) {
        //console.log(res);
        if (res.errcode == 1) {
          var dt = res.data;
          if (dt.new_user == 1) {
            if (dt.pop == 1) {
              wx.showModal({
                title: '',
                content: 'New customers can enjoy a special Welcome Pack discount. Would you prefer to choose this?\r\n您可以享受新用户优惠大礼包，点击确定了解详情',
                success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../detail/detail?prodId=' + dt.menu_id
                    })
                  } else if (res.cancel) {
                    wx.navigateTo({
                      url: '../detail/detail?prodId=' + prodId
                    })
                  }
                }
              })
            } else {
              wx.navigateTo({
                url: '../detail/detail?prodId=' + prodId
              })
            }
          } else {
            if (dt.alert == 1) {
              wx.showModal({
                title: '',
                content: 'This product is for new customers only\r\n该产品仅限新用户购买',
              })
            } else {
              wx.navigateTo({
                url: '../detail/detail?prodId=' + prodId
              })
            }
          }
        } else if (res.errcode == -1001) {
          that.setData({
            is_authorize_hidden: false
          });
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
    } else {
      this.setData({
        is_authorize_hidden: false
      });
    }
  },
  toIBFn: function () {
    wx.navigateTo({
      url: '../intro/intro'
    })
  },
  bannerSwiperChange: function (e) {
    //console.log(e);
    this.setData({
      current: e.detail.current
    });
  },
  benefitSwiperChange: function (e) {
    //console.log(e);
    var swiper = this.data.benefitSwiper;
    swiper.current = e.detail.current;
    this.setData({
      benefitSwiper: swiper
    });
  },
  recommendSwiperChange: function (e) {
    //console.log(e.detail.current);
    var swiper = this.data.recommendSwiper;
    swiper.current = e.detail.current;
    this.setData({
      recommendSwiper: swiper
    });
  },
  prevFn: function (e) {
    var swiperName = e.currentTarget.dataset.name, swiper={};
    if (swiperName=="benefit"){
      swiper = this.data.benefitSwiper;
    }else{
      swiper = this.data.recommendSwiper;
    }
    var current = swiper.current;
    swiper.current = current > 0 ? current - 1 : swiper.imgUrls.length - 1;
    if (swiperName == "benefit") {
      this.setData({
        benefitSwiper: swiper
      })
    } else {
      this.setData({
        recommendSwiper: swiper
      })
    }
  },
  nextFn: function (e) {
    var swiperName = e.currentTarget.dataset.name, swiper = {};
    if (swiperName == "benefit") {
      swiper = this.data.benefitSwiper;
    } else {
      swiper = this.data.recommendSwiper;
    }
    var current = swiper.current;
    swiper.current = current < (swiper.imgUrls.length - 1) ? current + 1 : 0;
    if (swiperName == "benefit") {
      this.setData({
        benefitSwiper: swiper
      })
    } else {
      this.setData({
        recommendSwiper: swiper
      })
    }
  },
  moveFn: function(e) {
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
  moveCartFn: function (e) {
    var w = app.globalData.ww, h = app.globalData.wh;
    var half = app.globalData.ww / 750 * 127 / 2;
    var x = e.touches[0].clientX - half, y = e.touches[0].clientY - half;
    //console.log(half,x,y);
    if (x < 0) x = 0;
    if (x > w - 2 * half) x = w - 2 * half;
    if (y < 0) y = 0;
    if (y > h - 2 * half) y = h - 2 * half;
    this.setData({
      cartx: x + "px",
      carty: y + "px"
    })
  },
  toShopCartFn() {
    if (app.globalData.token) {
      wx.navigateTo({
        url: '../cart/cart',
      })
    } else {
      this.setData({
        is_authorize_hidden: false
      })
    }
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
  onMyEvent: function (e) {
    this.setData({
      uInfo: e.detail.userInfo
    })
  },

  onLoad: function () {
    var lg = app.globalData.lang, that = this;
    //请求对应语言的文字内容
    http.Get("index/text", { "lang": lg, "token": app.globalData.token }, function (res) {
      //console.log(res);
      if (res.code == 1) {
        app.globalData.cont = res.data.txt
        that.setData({
          lang: lg,
          txt: res.data.txt.home
        });
      } else {
        console.log(res.errmsg)
      }
    }, function (err) {
      console.log(err)
    });

    var barTxts = ["HOME", "PRODUCT", "ME"];
    if (lg == "cn") {
      barTxts = ["首页", "产品", "我的"]
    }
    for (let i = 0; i < barTxts.length; i++) {
      wx.setTabBarItem({
        index: i,
        text: barTxts[i]
      })
    }
  },
  onReady: function () {
    // Do something when page ready.
  },
  onShow: function () {
    // Do something when page show.
    this.getProdsFn(app.globalData.lang);
    this.getCartNumFn();
    if (this.data.uInfo == {}) {
      if (app.globalData.userInfo) {
        this.setData({
          uInfo: app.globalData.userInfo,
          uId: app.globalData.userId
        });
        return false;
      }
      if (app.globalData.token) {
        var that = this;
        http.Post("User/getUserInfo", { token: app.globalData.token }, function (res) {
          if (res.errcode == 1) {
            that.setData({
              uInfo: res.data,
              uId: app.globalData.userId
            });
            app.globalData.userInfo = res.data;
          }
        }, function (err) {
          console.log(err)
        });
      }
    }
  },
  onHide: function () {
    // Do something when page hide.
  },
  onUnload: function () {
    // Do something when page close.
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
  },
  onReachBottom: function () {
    // Do something when page reach bottom.
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
    return {
      title: "The Ultimate Daily all-in-one supplement",
      path: '/pages/index/index?scene=' + app.globalData.userId,
      imageUrl: 'https://athleticgreens.fugumobile.cn/imgs/share.jpg'
    }
  },
  onPageScroll: function () {
    // Do something when page scroll
  },
  onResize: function () {
    // Do something when page resize
  },
  onTabItemTap(item) {
    
  }
})
