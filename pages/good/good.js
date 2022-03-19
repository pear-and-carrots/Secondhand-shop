// pages/good/good.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    finish:'',
    checkbox:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.huoqu()
  },
  //获取openid
  huoqu(){
    wx.cloud.callFunction({
      name: 'good',
    })
    .then(res => {
      this.setData({
        openid:res.result.openid
      })
    this.good()
    })
  },
  //删除商品
  bindlongpress(e){
    wx.showModal({
      title: '删除',
      content: '是否确定删除',
    }).then(res=>{
       if (res.confirm) {
          db.collection('goods')
          .doc(e.currentTarget.dataset.id)
          .remove()
            .then(res=>{
              this.good()
              console.log("成功",res);
              wx.showToast({
                title: '删除成功',
                duration: 2000
              })
            })
            .catch(err=>{
              console.log("失败",err);
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      console.log("1213");
    })
  },
  //获取商品信息
  good:function() {
    db.collection('goods')
      .where({
      _openid: this.data.openid
      })
      .get()
      .then(res => {
        console.log("成功", res);
        this.setData({
          goods: res.data
        })
      })
      .catch(err => {
        console.log("失败", err);
      })
  },

  guanli:function(e){
    let that = this
    that.setData({
      checkbox: true,
      finish:true
    })
  },

  finish:function(e){
    let that = this
    that.setData({
      checkbox: '',
      finish: ''
    })
  },
  checkbox(e){
    console.log(e);
  }

})