var http=require('../../utils/http.js')
Page({
  data: {
    list:[
      {}
    ]
  },
  onLoad: function (options) {
    var num = parseInt(options.itemId)
    http('get','/api/foods/list/type',{type:num-1},'',(res)=>{
      console.log(res)
      this.setData({
        list:res.data
      })
    },error=>{
      console.log(error)
    })
  },

  productDetail:function(e){
    wx.navigateTo({
      url: '../productType/productType?itemId='+e.currentTarget.dataset.id,
    })
  },
})