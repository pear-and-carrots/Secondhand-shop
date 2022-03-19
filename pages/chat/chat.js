// pages/chat/chat.js
var util = require('../../utils/util.js');
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xiaoxi:[],
    chat: "",
    //本人
    openid: "",
    //商品主人
    _openid: "",
    ruko:"",
  },

  input:function(e){
    this.setData({
      show : true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取openid
    wx.cloud.callFunction({
      name: 'good',
    })
      .then(res => {
        console.log(res.result.openid);
        this.setData({
          openid: res.result.openid
        })
      })
    this.setData({
      _openid: options.openid
    })
    this.ruko();


  },
  //聊天内容
  bindblur(e){
    //console.log(e.detail.value);
    this.setData({
      chat:e.detail.value
    })
  },
  //聊天信息到数据库
  pinglun(){
    var DATE = util.formatTime(new Date());
    const chat=this.data.chat;
    const openid=this.data.openid;
    const nickName = wx.getStorageSync('nickName');
    const avatarUrl = wx.getStorageSync('avatarUrl');
if (this.data.ruko==1) {
  db.collection('chat')
  .where({_openid:this.data.openid,openid:this.data._openid})
  .update({
    data: {
      chat: _.push({
        nickName,
        avatarUrl,
        openid,
        chat,
        DATE
      })
    }
  })
  .then(res=>{
    this.siliao();
    this.setData({
      chat:""
    })
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    });
  })
}else{
  db.collection('chat')
  .doc(this.data.openid)
  .update({
    data: {
      chat: _.push({
        nickName,
        avatarUrl,
        openid,
        chat,
        DATE
      })
    }
  })
  .then(res=>{
    this.siliao();
    this.setData({
      chat:""
    })
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    });
  })
}

  },
  //判断加入入口
  ruko(){
    db.collection('chat')
    .where({_openid:this.data.openid,openid:this.data._openid})
    .get()
    .then(res=>{
      console.log("入口！！！！！！！！",res);
      if (res.data="") {
        this.setData({
          ruko:0,
        })
      }
      else{
        this.setData({
          ruko:1,
        })
      }
    }).then(res=>{
      this.siliao();
    })
  },
  //获取私聊信息
  siliao(){
    console.log("1111111111");
//     const $ = db.command.aggregate
// db.collection('stats')
// .where({_openid:this.data.openid,openid:this.data._openid})
// .aggregate()
//   .project({
//     reversed: $.reverseArray('$sales'),
//   })
//   .end()
if (this.data.ruko==1) {
  db.collection('chat')
  .where({_openid:this.data.openid,openid:this.data._openid})
  .get()
  .then(res=>{
    console.log("111",res.data[0].chat);
    this.setData({
      xiaoxi:res.data[0].chat
    })
  })
}
else{
  db.collection('chat')
  .doc(this.data.openid)
  .get()
  .then(res=>{
    console.log("111",res.data[0].chat);
    this.setData({
      xiaoxi:res.data[0].chat
    })
  })
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