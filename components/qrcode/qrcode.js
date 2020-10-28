// components/qrcode/qrcode.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    qrcodeHidden: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    qrcodeHidden: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show: function () {
      this.setData({
        qrcodeHidden: false
      })
    },
    hide: function () {
      this.setData({
        qrcodeHidden: true
      })
    },
    saveQRFn: function () {
      wx.downloadFile({
        url: "https://athleticgreens.fugumobile.cn/imgs/csQR.jpg",
        success: function (res) {
          if (res.statusCode === 200) {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: (result) => {
                wx.showModal({
                  title: '',
                  content: 'Successfully saved\r\n保存成功',
                })
              },
              fail: (err) => {
                wx.showModal({
                  title: '',
                  content: 'save failed\r\n保存失败',
                })
              }
            })
          } else {
            console.log("download fail")
          }
        },
        fail: function () {
          wx.showModal({
            title: '',
            content: 'save failed\r\n保存失败',
          })
        }
      })
    }
  }
})
