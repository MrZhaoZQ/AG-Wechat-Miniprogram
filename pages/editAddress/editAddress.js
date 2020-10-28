// pages/editAddress/editAddress.js
const app = getApp()  //获取应用实例
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addrId: "",
    name: "",
    idCard: "",
    mobile: "",
    region: [],
    address: "",
    pstCode: "",
    isDefault: 1,
    txt: {}
  },

  //事件处理函数
  nameIptFn: function (e) {
    //console.log(e);
    this.setData({
      name: e.detail.value
    })
  },
  idCardIptFn: function (e) {
    //console.log(e);
    this.setData({
      idCard: e.detail.value
    })
  },
  mobileIptFn: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  addressIptFn: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  pstCodeIptFn: function (e) {
    //console.log(e);
    this.setData({
      pstCode: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  isDefaultFn: function (e) {
    var _isDefault = this.data.isDefault;
    if (_isDefault == 1) {
      _isDefault = 2
    } else {
      _isDefault = 1
    }
    this.setData({
      isDefault: _isDefault
    })
  },
  saveFn: function () {
    var _name = this.data.name,
      _idCard = this.data.idCard,
      _mobile = this.data.mobile,
      _region = this.data.region,
      _address = this.data.address,
      _pstCode = this.data.pstCode,
      _isDefault = this.data.isDefault;
    var that = this;
    if (_name == "") {
      wx.showModal({
        title: '',
        content: 'Please fill in the receivers full name\r\n请输入收货人真实姓名',
      });
      return false;
    } else if (_idCard == "" || _idCard.length > 36) {
      wx.showModal({
        title: '',
        content: 'Please fill in your correct ID Card Number / Passport Number\r\n请输入正确的收货人身份证号码／护照号码',
      });
      return false;
    } else if (_mobile == "") {
      wx.showModal({
        title: '',
        content: 'Please fill in a correct mobile phone number\r\n请输入正确的手机号码',
      });
      return false;
    } else if (_region[2] == "区县" || _region[2] == "District") {
      wx.showModal({
        title: '',
        content: 'Please first select your province, city and district\r\n请选择收货人所在省、市、区县',
      });
      return false;
    } else if (_address == "") {
      wx.showModal({
        title: '',
        content: 'Please fill in your detailed shipping address\r\n请填写详细的收货地址',
      });
      return false;
    } else {
      //保存该地址到数据库
      var param = {
        token: app.globalData.token,
        address_id: this.data.addrId,
        user_name: _name,
        user_id_card: _idCard,
        user_phone: _mobile,
        province: _region[0],
        city: _region[1],
        region: _region[2],
        address: _address,
        postal_code: _pstCode,
        default: _isDefault
      };
      http.Post("User/saveUserAddress", param, function (res) {
        //console.log(res);
        if (res.errcode == 1) {
          wx.navigateBack({
            delta: 1
          })
        } else if (res.errcode == -1002) {
          wx.showModal({
            title: '',
            content: res.errmsg,
          })
        } else {
          console.log(res.errmsg)
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
    var id = options.addressId, that = this;
    if(id){
      var param = {
        "token": app.globalData.token,
        "address_id": id
      };
      http.Post("User/getAddressDetail", param, function (res) {
        //console.log(res);
        if (res.errcode == 1) {
          that.setData({
            addrId: res.data.id,
            name: res.data.user_name,
            idCard: res.data.user_id_card,
            mobile: res.data.user_phone,
            region: [res.data.province, res.data.city, res.data.region],
            address: res.data.address,
            pstCode: res.data.postal_code,
            isDefault: res.data.default
          })
        } else {
          console.log(res.errmsg)
        }
      }, function (err) {
        console.log(err)
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
        region: ['省份', '城市', '区县'],
        txt: {
          "name": "真实姓名",
          "idCard": "身份证号码",
          "phone": "手机号码",
          "detail": "详细地址",
          "pstCode": "邮政编码",
          "setDef": "设为默认地址",
          "notice": "*注意：由于我们的产品运输过境香港，基于相关的法律条例，请大家务必认真填写正确的中文姓名以及身份证号码。任何信息的错误填写，都将导致运输延迟。感谢大家的理解与配合。",
          "save": "保存"
        }
      })
    } else {
      this.setData({
        region: ['Province', 'City', 'District'],
        txt: {
          "name": "Full Name",
          "idCard": "ID Card Number",
          "phone": "Mobile Number",
          "detail": "Detailed address",
          "pstCode": "Postal Code",
          "setDef": "Set to the default address",
          "notice": "*Attention: as we are sending this cross border from Hong Kong, please ensure to fill in an accurate full name and ID number based on legal documentation. Any inaccurate information will result in delays in shipping. We appreciate your understanding.",
          "save": "Save address"
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