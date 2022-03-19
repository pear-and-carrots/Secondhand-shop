// pages/collect/collect.js
const db = wx.cloud.database();
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    collect:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name:'good',
    })
    .then(res=>{
      this.setData({
        openid:res.result.openid
      })
     // console.log(res.result.openid);
    db.collection('goods')
    .where({goods_id:res.result.openid})
    .get()
    .then(res=>{
            console.log("成功",res);
            this.setData({
              goods:res.data
            })
          .catch(err=>{
            console.log("失败",err);
          })
        //console.log(res.data.length);
    })
    .catch(err=>{

      console.log(err);
    })
    })
  },
  //删除收藏
  bindlongpress(e){
    console.log(e.currentTarget.dataset.id);
    const openid=this.data.openid;
    wx.showModal({
      title: '删除',
      content: '是否确定删除',
      success (res) {
        if (res.confirm) {
          db.collection('goods')
          .doc(e.currentTarget.dataset.id).update({
            data: {
              goods_id:_.pull(openid)
            }
          })
            .then(res=>{
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
      }
    })
  },
  // handleTtabsIemChange(e){
  //   //console.log(e);
  //   const {index}=e.detail;
  //   let {tabs}=this.data;
  //   tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
  //   this.setData({
  //    tabs
  //  })
  //  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let collect = wx.getStorageSync("collect") || [];
    this.setData({collect})
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