// pages/shcool/shcool.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    news: [{
        id: 0,
        name: "综合新闻"
      },
      {
        id: 1,
        name: "工作动态"
      }
    ],
    getNews: [],
    curIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.获取轮播图数据
    db.collection('school').get({
      success: res => {
        console.log('轮播图获取成功', res)
        this.setData({
          banner: res.data
        })
      },
      fail: res => {
        console.log('轮播图获取失败', res)
      }
    })

    // 2.获取综合新闻数据
    db.collection('schoolNews')
      .orderBy('sendTime', 'desc')
      .where({
        pricker: 0
      })
      .get()
      .then(res => {
        this.setData({
          getNews: res.data
        })
      })
      .catch(err => {

      })
  },

  getNews: function (e) {
    console.log(e.target.dataset.index)
    this.setData({
      curIndex: e.target.dataset.index
    })
    db.collection('schoolNews').where({
        pricker: e.currentTarget.dataset.id
      }).get().then(res => {
        console.log(res);
        this.setData({
          getNews: res.data
        })
      })
      .catch(err => {

      })
    // db.collection('schoolNews')
    // .where({pricker:"e.currentTarget.dataset.name"})
    // .get()
    // .then(res=>{
    //   console.log(res);
    //   this.setData({
    //     getNews:res.data
    //   })
    // })
    // .catch(err=>{
  
    // })
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