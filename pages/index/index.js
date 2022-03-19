//index.js
const app = getApp();
const db = wx.cloud.database();
var productData = require('../../utils/productData.js');

Page({
  data: {
    orders:[
      {
        id:0,
        name:"闲置数码",
        src:"cloud://office-123.6f66-office-123-1304780270/icon/shuma.png"
      },
      {
        id:1,
        name:"书籍教材",
        src:"cloud://office-123.6f66-office-123-1304780270/icon/books.png"
      },
      {
        id:2,
        name:"体育用品",
        src:"cloud://office-123.6f66-office-123-1304780270/icon/sport.png"
      },
      {
        id:3,
        name:"鞋服配饰",
        src:"cloud://office-123.6f66-office-123-1304780270/icon/clothes.png"
      },
    ],
    banner: [],
    location: "上海",
    productType:productData,
    list:[],
    num:1,
    isShow:false,
    moreInfo:'',
    pricker:"",
  },

//切换商品类型

//获取data-name
shuma(e){
  db.collection('goods')
  .where({pricker:e.currentTarget.dataset.name})
  .get()
  .then(res=>{
    console.log(res);
    this.setData({
      goods:res.data
    })
  })
  .catch(err=>{

  })

},

onLoad() {
  //获取
  db.collection('goods')
  .orderBy('sendTime','desc')
  .where({pricker:"闲置数码"})
  .get()
  .then(res=>{
    this.setData({
      goods:res.data
    })
  })
  .catch(err=>{

  })

  //this.dj();
  // let that  = this;
  // 获取轮播图
  db.collection('banner').get({
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
},

// 3.点击产品分类---进入对应的产品分类的列表信息展示
productType: function (e) {
  wx.navigateTo({
    url: '../productType/productType?itemId=' + e.currentTarget.dataset.mark,
  })
},

  // 3.点击产品分类---进入对应的产品分类的列表信息展示
  productType: function (e) {
    wx.navigateTo({
      url: '../productType/productType?itemId=' + e.currentTarget.dataset.mark,
    })
  },

  // // 4.点击列表信息---进入列表的产品详情页
  // productDetail: function (e) {
  //   console.log(e.currentTarget.dataset.id)
  //   wx.navigateTo({
  //     url: '../productDetail/productDetail?itemId=' + e.currentTarget.dataset.id,
  //   })
  // },

  getMore: function () {
    this.data.num++;
    console.log('请求数据页码：', this.data.num)
    wx.request({
      url: 'http://iwenwiki.com:3002/api/foods/list',
      data: {
        city: this.data.location,
        page: this.data.num
      },
      success: res => {
        if (res.data.status == 200) {
          this.setData({
            list: this.data.list.concat(res.data.data.result)
          })
        } else {
          console.log('没有更多数据');
          this.setData({
            isShow: false,
            moreInfo: '我是有底线的'
          })
        }
      }
    })
  },


  onShow: function () {
    //console.log(app)
    if (app.globalData.cityName) {
      this.setData({
        location: app.globalData.cityName,
        num: 1
      })
      wx.request({
        url: 'http://iwenwiki.com:3002/api/foods/list',
        data: {
          city: app.globalData.cityName,
          page: 1
        },
        success: res => {
          if (res.data.status == 200) {
            console.log(res.data.data.result);
            this.setData({
              list: res.data.data.result,
              isShow: true
            })
          }
        }
      })
    }

  },
  //下拉刷新，加载数据
getgoods(){
  wx.showLoading({
    title: "加载中"
  });
  const length=this.data.goods.length;
  //console.log(length);
  db.collection('goods')
  .orderBy('DATE','asc')//差个发布⌚时间
  .where({pricker:this.data.pricker})
  .skip(length)
  .get()
  .then(res=>{
    wx.hideLoading();
    let datalength=res.data
    if (datalength<=0) {
      wx.showToast({
        title: '没有更多数据了',
        icon:"none"
      });
        
    }
    this.setData({
      goods:this.data.goods.concat(res.data)
    })
  })
  .catch(err=>{
    wx.hideLoading();
  })

  
},
  onReachBottom: function () {
    this.getgoods();
  },

})