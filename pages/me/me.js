// pages/me/me.js
const app = getApp()  //获取应用实例
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    uId: "",
    is_authorize_hidden: true,
    page_name: "me",
    toSign: false,
    signStatus: [0, 0, 0, 0, 0],
    signedDays: 0,
    canSign: true,
    signBtnTxt: "",
    showPoster: false,
    cvs: { "cw": 0, "ch": 0 },
    bgSrc: "",
    codeSrc: "",
    avatarSrc: "",
    posterSrc: "",
    showPR: false,
    txt: {}
  },

  //事件处理函数
  handleContact(e) {
    console.log(e.path)
    console.log(e.query)
  },
  showPRFn: function () {
    this.setData({
      showPR: true
    });
  },
  closePRFn: function () {
    this.setData({
      showPR: false
    });
  },
  showPosterFn: function () {
    var cvs = this.data.cvs, ctx = wx.createCanvasContext('canvasPoster');
    this.setData({
      showPoster: true
    });
    ctx.clearRect(0, 0, cvs.cw, cvs.ch);
    ctx.draw();
    wx.showLoading();
    this.getPosterBgFn();
  },
  preventFn: function () {},
  closePosterFn: function () {
    wx.hideLoading();
    this.setData({
      showPoster: false
    });
  },
  toCartFn: function () {
    wx.navigateTo({
      url: '../cart/cart'
    })
  },
  toAddressFn: function() {
    wx.navigateTo({
      url: '../address/address'
    })
  },
  toCouponFn: function () {
    wx.navigateTo({
      url: '../coupon/coupon'
    })
  },
  toHelpFn: function () {
    wx.navigateTo({
      url: '../help/help'
    })
  },
  toSignFn: function(){
    var that = this, thisLg = app.globalData.lang;
    http.Post("User/checkUserSign", { token: app.globalData.token }, function (res) {
      if (res.errcode == 1) {
        var _siTxt = thisLg == "cn" ? "点击签到" : "Click here to sign in";
        var siStatus = [0, 0, 0, 0, 0], can = res.data.can_sign;
        var siDays = res.data.sign_days.length;
        if (!can) {
          if (siDays == 5) {
            _siTxt = thisLg == "cn" ? "分享你的Athletic Greens" : "Share your Athletic Greens"
          } else {
            _siTxt = thisLg == "cn" ? "今日已签" : "Signed in today"
          }
        }       
        for (var i = 0; i < siDays; i++) {
          siStatus[i] = 1
        }
        //wx.hideTabBar();
        that.setData({
          toSign: true,
          signStatus: siStatus,
          signedDays: siDays,
          canSign:can,
          signBtnTxt: _siTxt
        });
      } else {
        console.log(res.errmsg)
      }
    }, function (err) {
      console.log(err)
    })
  },
  signInFn: function () {
    var that = this, siStatus = this.data.signStatus, _siDays = this.data.signedDays, _can = this.data.canSign;
    if(!_can){
      if (_siDays == 5) {
        var cvs = this.data.cvs, ctx = wx.createCanvasContext('canvasPoster');
        this.setData({
          showPoster: true
        });
        ctx.clearRect(0, 0, cvs.cw, cvs.ch);
        ctx.draw();
        wx.showLoading();
        this.getPosterBgFn();
      }
    } else {
      http.Post("User/userSignIn", { token: app.globalData.token }, function (res) {
        console.log(res);
        if (res.errcode == 1) {
          siStatus[_siDays] = 1;
          _siDays += 1;
          var sbtDone = "Share your Athletic Greens", sbt = "Signed in today";
          if (app.globalData.lang == "cn") {
            sbtDone = "分享你的Athletic Greens", sbt = "今日已签";
          }
          that.setData({
            signStatus: siStatus,
            signedDays: _siDays,
            canSign: false,
            signBtnTxt: _siDays >= 5 ? sbtDone : sbt
          });
        } else {
          console.log(res.errmsg)
        }
      }, function (err) {
        console.log(err)
      })
    }
  },
  closeSignFn: function () {
    this.setData({
      toSign: false
    });
    //wx.showTabBar();
  },

  onMyEvent: function (e) {
    this.setData({
      userInfo: e.detail.userInfo
    })
  },

  getPosterBgFn: function () {
    if (this.data.bgSrc) {
      this.getQrCodeFn(this.data.bgSrc);
    } else {
      var that = this;
      wx.downloadFile({
        url: 'https://athleticgreens.fugumobile.cn/imgs/posterBg.png',
        success: function (res) {
          if (res.statusCode === 200) {
            var _bgSrc = res.tempFilePath;
            that.getQrCodeFn(_bgSrc);
            that.setData({
              bgSrc: _bgSrc
            });
          } else {
            console.log("download fail")
          }
        }
      })
    }
  },
  getQrCodeFn: function (bgSrc) {
    if (this.data.codeSrc) {
      this.getAvatarFn(bgSrc, this.data.codeSrc);
    } else {
      var that = this;
      wx.downloadFile({
        url: that.data.userInfo.user_qr_url,
        success: function (res) {
          if (res.statusCode === 200) {
            var _codeSrc = res.tempFilePath;
            that.getAvatarFn(bgSrc, _codeSrc);
            that.setData({
              codeSrc: _codeSrc
            });
          } else {
            console.log("download fail")
          }
        }
      })
    }
  },
  getAvatarFn: function (bgSrc, codeSrc) {
    if (this.data.avatarSrc) {
      this.createPosterFn(bgSrc, codeSrc, this.data.avatarSrc);//真正的绘图方法
    } else {
      var that = this;
      wx.downloadFile({
        url: that.data.userInfo.head_img_url,
        success: function (res) {
          if (res.statusCode === 200) {
            var _avatarSrc = res.tempFilePath;
            that.createPosterFn(bgSrc, codeSrc, _avatarSrc);//真正的绘图方法
            that.setData({
              avatarSrc: _avatarSrc
            });
          } else {
            console.log("download fail")
          }
        }
      })
    }
  },
  createPosterFn: function (bgSrc, codeSrc, avatarSrc) {
    var that = this;
    const ctx = wx.createCanvasContext('canvasPoster');
    wx.createSelectorQuery().select('#canvasPoster').boundingClientRect(function (rect) {
      //console.log(rect);
      var w = rect.width;
      var h = rect.height;
      that.setData({
        cvs: { "cw": w, "ch": h }
      });
      var oX = w * 0.14;
      var oY = h * 0.72;

      //画圆角矩形
      ctx.beginPath();//创建一个路径
      ctx.save();//使用 clip 方法前通过使用 save 方法对当前画布区域进行保存
      ctx.setLineWidth(1)
      ctx.setStrokeStyle('#fff')
      ctx.moveTo(5, 0);
      ctx.lineTo(w-5, 0);
      ctx.arcTo(w, 0, w, 5, 6);
      ctx.lineTo(w, h-5);
      ctx.arcTo(w, h, w-5, h, 6);
      ctx.lineTo(5, h);
      ctx.arcTo(0, h, 0, h-5, 6);
      ctx.lineTo(0, 5);
      ctx.arcTo(0, 0, 5, 0, 6);
      ctx.closePath();
      ctx.clip(); //剪切了该圆角矩形区域
      ctx.fillStyle = '#fff';
      ctx.stroke();
      ctx.setFillStyle('#fff');
      ctx.fillRect(0, 0, w, h);

      ctx.restore(); //通过restore方法对保存的画布进行恢复
      ctx.beginPath();//创建一个新路径

      if (bgSrc) {  //画背景图
        ctx.drawImage(bgSrc, 0, 0, w, h * 0.72)
      }

      if (codeSrc) {  //画小程序码
        ctx.drawImage(codeSrc, w * 0.65, h * 0.75, w * 0.32, w * 0.32)
      }

      if (that.data.userInfo.nick_name) {  //填充昵称文字
        ctx.setFontSize(14);
        ctx.setFillStyle('#000');
        ctx.setTextAlign('left');
        ctx.fillText(that.data.userInfo.nick_name, w * 0.05, h * 0.72 + w * 0.15);
      }

      //填充说明文字
      ctx.setFontSize(12);
      ctx.setFillStyle('#666');
      ctx.setTextAlign('left');
      if (app.globalData.lang == "cn") {
        ctx.fillText("把AG推荐给您的朋友", w * 0.05, h * 0.72 + w * 0.15 + 32);
        ctx.fillText("来传递健康的生活方式吧", w * 0.05, h * 0.72 + w * 0.15 + 48);
      } else {
        ctx.fillText("Spread your love for AG and", w * 0.05, h * 0.72 + w * 0.15 + 32);
        ctx.fillText("a healthy lifestyle with a friend", w * 0.05, h * 0.72 + w * 0.15 + 48);
      }

      //画圆形头像
      ctx.save();
      ctx.setLineWidth(3);
      ctx.setStrokeStyle('rgba(255,255,255,1)');
      ctx.arc(oX, oY, w * 0.09, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.clip();  //画完之后执行clip()方法，否则不会出现圆形效果
      if (avatarSrc) {
        ctx.drawImage(avatarSrc, w * 0.05, h * 0.72 - w * 0.09, w * 0.18, w * 0.18)
        ctx.restore
      }

    }).exec();

    setTimeout(function(){
      ctx.draw(false, function () {
        wx.hideLoading();
        wx.canvasToTempFilePath({
          canvasId: 'canvasPoster',
          success: (res) => {
            that.setData({
              posterSrc: res.tempFilePath
            })
          }
        });
      });
    },1000)
  },
  save2AlbumFn: function () {
    if (this.data.posterSrc) {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.posterSrc,
        success: (result) => {
          wx.showModal({
            title: '',
            content: 'Successfully saved\r\n图片保存成功',
          })
        },
        fail: (err) => {
          wx.showModal({
            title: '',
            content: 'save failed\r\n图片保存失败',
          })
        }
      })
    }
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
    var signBT = app.globalData.lang == "cn" ? "点击签到" : "Click here to sign in";
    this.setData({
      uId: app.globalData.userId,
      signBtnTxt: signBT,
      txt: app.globalData.cont.me
    });
    if (app.globalData.token) {
      var that = this;
      //获取更新用户信息
      http.Post("User/getUserInfo", { token: app.globalData.token }, function (res) {
        //console.log(res);
        if (res.errcode == 1) {
          that.setData({
            userInfo: res.data
          });
          app.globalData.userInfo = res.data;
        } else if (res.errcode == -1001) {
          that.setData({  //获取token 授权获取用户信息
            is_authorize_hidden: false
          });
        } else {
          console.log(res.errmsg)
        }
      }, function (err) {
        console.log(err)
      });
    } else {
      //获取token 授权获取用户信息
      this.setData({
        is_authorize_hidden: false
      });
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
  },
})