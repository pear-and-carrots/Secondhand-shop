// pages/sign/sign.js
const app = getApp()
const db = wx.cloud.database();//初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['体育用品', '书籍教材', '鞋服配饰', '闲置数码'],
    index: 0,
    imgbox: [],//选择图片
    fileIDs: [],//上传云存储后的返回值
    form_info:""
    

  },
  //表单组件
  bindsubmit(e) {
    // console.log(e.detail.value);
    let form = e.detail.value;
    this.setData({
      form:form
    })
    switch (Number( form.pricker)) {
      case 0:
        form.pricker='体育用品';console.log("!2121");
        break;
      case 1:
        form.pricker='书籍教材'
        break;
      case 2:
        form.pricker='鞋服配饰'
        break;
        case 3:
          form.pricker='闲置数码'
          break;
      default:
    };
    console.log(form.pricker);
    if (!this.data.imgbox.length) {
      wx.showToast({
        icon: 'none',
        title: '图片类容为空'
      });
    } else {
      //上传图片到云存储
      wx.showLoading({
        title: '上传中',
      })
      let promiseArr = [];
      for (let i = 0; i < this.data.imgbox.length; i++) {
        promiseArr.push(new Promise((reslove, reject) => {
          let item = this.data.imgbox[i];
          let suffix = /\.\w+$/.exec(item)[0];//正则表达式返回文件的扩展名
          wx.cloud.uploadFile({
            cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
            filePath: item, // 小程序临时文件路径
            success: res => {
              this.setData({
                fileIDs: this.data.fileIDs.concat(res.fileID)
              });
              console.log(res.fileID)//输出上传后图片的返回地址
              reslove();

              wx.showToast({
                title: "上传成功",
              })
            },
            fail: res => {

              wx.showToast({
                title: "上传失败",
              })
            }

          })
        }));
        console.log(this.data.fileIDs);
      }
      Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
        wx.cloud.database().collection('goods')
        .add({
          data: {
            pricker:this.data.form.pricker,
            biaoti: this.data.form.biaoti,
            src:this.data.fileIDs,
            textarea: this.data.form.textarea,
            jiage: this.data.form.jiage,
            daoshojia: this.data.form.daoshojia,
            shojihaoma: this.data.form.shojihaoma
    
          }
        })
        .then(res=>{
          console.log(res._id);
          wx.navigateTo({
            url: '../productDetail/productDetail?_id='+res._id,
            success: (result) => {
              console.log(result);
            },
            fail: (err) => {
              console.log(err);
            },
            complete: () => {}
          });
          console.log(res);
          this.setData({
            form_info:""
          })

        })
        console.log("图片上传完成后再执行")
        this.setData({
          imgbox: []
        })
      })

    }

  },
  //商品类型的选择
  bindPickerChange: function (e) {
    //console.log(e);
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  handChange(e) {
    // 1.获取单选框中的值
    let sex = e.detail.value;
    console.log(sex)
  },

  sign_img: function (e) {
    wx.request({
      url: 'https://api.weixin.qq.com/product/img/upload?access_token=xxxxxxxxx&height=100%&width=100%',
    })
  },
  // 删除照片 &&
  imgDelete1: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox;
    imgbox.splice(index, 1)
    that.setData({
      imgbox: imgbox
    });
  },
  // 选择图片 &&&
  addPic1: function (e) {
    var imgbox = this.data.imgbox;
    var that = this;
    var n = 5;
    if (5 > imgbox.length > 0) {
      n = 5 - imgbox.length;
    } else if (imgbox.length == 5) {
      n = 1;
    }
    wx.chooseImage({
      count: n, // 默认9，设置图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths

        if (imgbox.length == 0) {
          imgbox = tempFilePaths
        } else if (5 > imgbox.length) {
          imgbox = imgbox.concat(tempFilePaths);
        }
        that.setData({
          imgbox: imgbox
        });
      }
    })
  },
  //发布按钮

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

  }
})