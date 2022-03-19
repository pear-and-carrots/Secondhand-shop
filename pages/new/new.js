// pages/new/new.js
const db = wx.cloud.database();
const _ = db.command;
const $ = db.command.aggregate;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:"",
    xiaoxi:"",
    wodexaioxi:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'good',
    })
      .then(res => {
        this.xiaoxi(res.result.openid);
        this.wodexaioxi(res.result.openid)
        console.log(res.result.openid);
        this.setData({
          openid: res.result.openid
        })
      })

  },
//获取消息
xiaoxi(type){
// db.collection('chat').aggregate()
//   .project({
//     reversed: $.reverseArray('$chat'),
//   })
//   .end()
  console.log(type);
  console.log(this.data.openid);
  db.collection('chat')
  .where({_openid:type})
  .get()
  .then(res=>{
    this.setData({
      xiaoxi:res.data
    })
    console.log(res);
  })
  // db.collection('chat')
  // .where({openid:type})
  // .get()
  // .then(res=>{
  //   this.setData({
  //     wodexiaoxi:this.data
  //   })
  // })
},
wodexiaoxi(type){
  db.collection('chat')
  .where({openid:type})
  .get()
  .then(res=>{
    this.setData({
      wodexiaoxi:res.data
    })
  })
},
bindlongpress(e){
  console.log(e.currentTarget.dataset.openid);
  wx.navigateTo({
    url: '/pages/chat/chat?openid='+e.currentTarget.dataset.openid,
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