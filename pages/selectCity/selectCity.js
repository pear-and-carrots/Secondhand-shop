// pages/selectCity/selectCity.js
var http=require('../../utils/http.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotCity:[],
    longitude:"113.324520",
    latitude:"23.099994"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http('get','/api/hot/city',{},'',res=>{
      console.log(res);
      this.setData({
        hotCity:res.data
      })
    })
  },

  getLocation:function(){
    wx.getLocation({
      success:res=>{
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        wx.request({
          url: 'http://iwenwiki.com:3002/api/lbs/location?latitude=39.90&longitude=116.40',
          data:{
            latitude: latitude,
            longitude: longitude
          },
          success:res=>{
            console.log(res.data.result.ad_info.city)
             var cityName = res.data.result.ad_info.city.slice(0,2);
            
            app.globalData.cityName = cityName
            wx.setStorageSync('cityName', cityName)
            console.log("fffffffffffffff",app);
            wx.switchTab({
              url:'../food/food',
            })
          }
        })
      }
    })
  },

  selectCity:function(e){
    var cityName = e.currentTarget.dataset.name;
    app.globalData.cityName = cityName;
    wx.setStorageSync('cityName', cityName);
    wx.switchTab({
      url: '../food/food',
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

  /*
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})