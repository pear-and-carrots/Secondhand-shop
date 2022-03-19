// pages/search/search.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    city:'',
    none:false
  },

  searchInput:function(e){
    //console.log(e.detail.value);
    db.collection('goods').where({
      biaoti: db.RegExp({
        regexp: e.detail.value,
        options: 'i',
      })
    }).get()
    .then(res=>{
      console.log(res);
      this.setData({
        goods:res.data
      })
    })
    .catch(err=>{
      console.log(err);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  productDetail:function(e){
    wx.navigateTo({
      url: '../productDetail/productDetail?itemId=' +e.currentTarget.dataset.id,
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
  onShow: function () {
    var cityName = wx.getStorageSync('cityName') || '上海';
    
    console.log('当前的城市',cityName)
    this.setData({
      city:cityName
    })
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