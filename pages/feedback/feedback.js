// pages/feedback/feedback.js
const app = getApp()  //获取应用实例
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: "",
    submitted: false,
    stars: [0, 0, 0, 0, 0],
    msg: "",
    imgs: [],
    upldedImgs: [],
    vds: [],
    upldedVds: [],
    txt: {}
  },

  //事件处理函数
  starNumFn: function (e) {
    var id = e.currentTarget.id, s = [0, 0, 0, 0, 0];
    for (var i in s) {
      if(i <= id){
        s[i] = 1
      }
    }
    this.setData({
      stars: s
    })
  },
  msgIptFn: function (e) {
    this.setData({
      msg: e.detail.value
    })
  },
  upldImgFn: function (img, that) {
    wx.uploadFile({
      url: 'https://athleticgreens.fugumobile.cn/api/tools/uploadImage',
      filePath: img,
      name: 'image',
      success(res) {
        //console.log(res)
        var data = JSON.parse(res.data);
        var imgsArr = that.data.upldedImgs;
        imgsArr.push(data.url);
        that.setData({
          upldedImgs: imgsArr
        });
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  chooseImgFn: function () {
    var that = this;
    wx.chooseImage({
      success: function(res) {
        var paths = res.tempFilePaths;
        for (var i in paths) {
          that.upldImgFn(paths[i], that)
        }
        that.setData({
          imgs: res.tempFilePaths
        })
      }
    })
  },
  upldVdFn: function (vd, that) {
    wx.uploadFile({
      url: 'https://athleticgreens.fugumobile.cn/api/tools/uploadVideo',
      filePath: vd,
      name: 'video',
      success(res) {
        //console.log(res)
        var data = JSON.parse(res.data);
        var vdsArr = that.data.upldedVds;
        vdsArr.push(data.url);
        that.setData({
          upldedVds: vdsArr
        });
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  chooseVdFn: function () {
    var that = this, _vds = this.data.vds;
    wx.chooseVideo({
      success: function (res) {
        that.upldVdFn(res.tempFilePath, that)
        _vds.push(res.tempFilePath)
        that.setData({
          vds: _vds
        })
      }
    })
  },
  submitFn : function () {
    var that = this, dt = this.data;
    var s = 0, sArr = this.data.stars;
    for (var i = 0; i < sArr.length; i++) {
      if (sArr[i] > 0) {
        s += 1
      }
    }
    if (s == 0 && dt.msg == "") {
      wx.showModal({
        title: '',
        content: 'Please fill in your feedback content\r\n请先填写评价内容',
      })
      return false
    }
    var param = {
      "token": app.globalData.token,
      "order_no": dt.orderId,
      "level": s,
      "comment": dt.msg,
      "photos": dt.upldedImgs,
      "video": dt.upldedVds
    };
    http.Post("order/leaveComments", param, function (res) {
      console.log(res);
      if (res.errcode == 1) {
        that.setData({
          submitted: true
        })
      } else {
        console.log(res.errmsg)
      }
    }, function (err) {
      console.log(err)
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.orderno, that = this;
    this.setData({
      orderId: id
    });
    http.Post("order/getcomment", {"token": app.globalData.token, "order_no": id}, function (res) {
      console.log(res);
      if (res.errcode == 1) {
        var dt = res.data;
        if (dt.length > 0) {
          var ss = [0,0,0,0,0];
          for (var k = 0; k < dt[0].level; k++) {
            ss[k] = 1
          }
          var _imgs = dt[0].images.length > 0 ? JSON.parse(dt[0].images[0].photos) : [];
          var _vds = dt[0].videos.length > 0 ? JSON.parse(dt[0].videos[0].video) : [];
          that.setData({
            submitted: true,
            stars: ss,
            msg: dt[0].comment,
            imgs: _imgs,
            vds: _vds
          })
        }
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
        txt: {
          "orderNo": "订单编号",
          "ph": "请输入您的反馈信息...",
          "aImg": "添加图片",
          "aVideo": "添加视频",
          "submit": "提交"
        }
      })
    } else {
      this.setData({
        txt: {
          "orderNo": "Order Number",
          "ph": "Please enter your feedback...",
          "aImg": "Add images",
          "aVideo": "Add video",
          "submit": "SUBMIT"
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