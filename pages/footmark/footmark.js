// pages/footmark/footmark.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var array = wx.getStorageSync('goods') || [];
    var newData = []
    var isHad

    array.map(item => {
      isHad = false
      newData.map(item1 => {
        if(item1._id === item._id){
          console.log('aaa')
          isHad = true
          return false
        }
      })
      if(!isHad){
        newData.push(item)
        console.log(newData)
      }
    })
    // console.log(newData)
    this.setData({
      goods: newData
    })

    console.log(array)
    // return array.filter(function(item, index, arr) {
    //   //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
    //   return array.indexOf(item, 0) === index;
    // });

    // var result = []; //去重后的数组对象集合
    // var hash = {};
    // for (var i = 0; i < array.length; i++) {
    //   var elem = array[i].sequence;
    //   if (!hash[elem]) {
    //     result.push(array[i]);
    //     hash[elem] = true;
    //   }
    // }
    //  console.log("jieguo jhasjkdh",result)

    // var arrNew = new Array()
    // for (var i = 0; i < array.length; i++) {
    //   if (arrNew.indexOf(array[i] == -1)) {
    //     arrNew.push(array[i])
    //   }
    // }
    // console.log(array)
  },

  unique: function (arr) {
    if (!Array.isArray(arr)) {
      console.log('type error!')
      return
    }
    let res = [arr[0]]
    for (let i = 1; i < arr.length; i++) {
      let flag = true
      for (let j = 0; j < res.length; j++) {
        if (arr[i] === res[j]) {
          flag = false;
          break
        }
      }
      if (flag) {
        res.push(arr[i])
      }
    }
    return res
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