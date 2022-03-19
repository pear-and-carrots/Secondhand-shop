// pages/productDetail/productDetail.js
var util = require('../../utils/util.js');
const db = wx.cloud.database();
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    _id: "",
    openid: "",
    pinglun: "",
    _openid:"",
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.array();
    // this.shocang();
    wx.cloud.callFunction({
        name: 'good',
      })
      .then(res => {
        console.log();
        this.setData({
          openid: res.result.event.userInfo.openId
        })
      })
    console.log(options)
    this.setData({
      _id: options._id
    })

    this.huoqu();
  },
  //页面加载时获取商品数据
  huoqu() {
    db.collection('goods')
      .doc(this.options._id)
      .get()
      .then(res => {
        this.array(res.data)
        //console.log(res);
        //wx.setStorageSync("goods", res.data.concat(res.data));

        this.setData({
          goods: res.data,
          _openid:res.data._openid

        })
      })
      .catch(err => {

      })
  },
  //拿到评论
  neirong(e) {
    this.setData({
      pinglun: e.detail.value,
    })
  },
  //删除评论
  bindlongpress(e) {
    console.log(e.currentTarget.dataset);
    const _id = this.data._id;
    const wdpinglun = e.currentTarget.dataset.pinglun;
    const plopenid = e.currentTarget.dataset.openid;
    const XDATE = e.currentTarget.dataset.DATE;
    if (plopenid == this.data.openid) {
      wx.showModal({
          title: '删除',
          content: '是否确定删除',
        })
        .then(res => {
          if (res.confirm) {
            db.collection('goods').doc(_id).update({
                data: {
                  pinglun: _.pull({
                    pinglun: wdpinglun
                  }, {
                    DATE: XDATE
                  })
                }
              })
              .then(res => {
                console.log(res);
                this.huoqu(),
                  wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 2000
                  });
              })
              .catch(err => {
                console.log("失败", err);
              })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        })
    }
  },
  shocang() {

    // const $ = db.command.aggregate
    //  db.collection('goods_id').aggregate()
    // .project({
    //   goods: $.size('$goods_id')
    // })
    // .end()
    // .then(res=>{
    //   console.log(res);
    // })
  },
  //评论传到数据库
  pinglun() {
    // console.log(nickName);
    if (this.data.pinglun) {
      var DATE = util.formatTime(new Date());
      //console.log(this.data.pinglun);
      const openid = this.data.openid;
      const pinglun = this.data.pinglun;
      const nickName = wx.getStorageSync('nickName');
      const avatarUrl = wx.getStorageSync('avatarUrl');
      db.collection('goods')
        .doc(this.data._id)
        .update({
          data: {
            pinglun: _.unshift({
              nickName,
              avatarUrl,
              openid,
              pinglun,
              DATE,
              position: 0,
            })
          }
        })
        .then(res => {
          console.log(res);
          this.huoqu(),
            wx.showToast({
              title: '评论成功',
              icon: 'success',
              duration: 2000
            });
          this.setData({
            pinglun: ""
          })
        })
        .catch(err => {

        })
    } else {
      wx.showModal({
        title: '请输入评论内容',
      })
    }
  },

  //本地缓存
  array(paye) {
    let array = wx.getStorageSync('goods') || []
    // 向数组中追加
    array.unshift(
      paye
    )
    // 重新设置缓存
    wx.setStorage({
      key: 'goods',
      data: array,
      success: function (res) {}
    })

  },
  // 收藏商品
  addShop: function () {
    let _id = this.data._id;
    var DATE = util.formatTime(new Date());
    let openid = this.data.openid;
    db.collection('goods').doc(_id).update({
        data: {
          goods_id: _.addToSet(openid, DATE)
        }
      })
      .then(res => {
        wx.showToast({
          title: '收藏成功',
          duration: 2000
        })
        console.log("111", res);
      })
      .catch(err => {
        console.log(err);
      })
    console.log('添加数据---购物车')
  },
  //聊天 
  chta() {
    if (this.data.openid==this.data._openid) {
      wx.showToast({
        title: '不能和自己聊天哦',
        icon:"none",
        duration: 2000
      })
    }
    else{
      db.collection('chat')
      .where({openid:this.data._openid,_openid:this.data.openid})
      .get()
      .then(res=>{
        console.log(res.data);
        if (res.data=="") {
          console.log("if");
          const src=this.data.goods.src;
          const openid=this.data._openid;
          const nickName = wx.getStorageSync('nickName');
          const avatarUrl = wx.getStorageSync('avatarUrl');
          db.collection("chat")
          .add({
            data:{
              openid,nickName,avatarUrl

            }
          })
          .then(res=>{
            wx.navigateTo({
              url: '/pages/chat/chat?openid=' + this.data.goods._openid,
            });
          })
        }
        else{
          console.log("else");
          wx.navigateTo({
            url: '/pages/chat/chat?openid=' + this.data.goods._openid,
          });
        }
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
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})