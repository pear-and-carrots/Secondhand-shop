function http(method,url,params,message,success,fail){
  if(message!=''){
    wx.showLoading({
      title: message
    })
  }

  wx.request({
    url:'http://iwenwiki.com:3002'+url,
    method:method,
    data:params,
    success:res=>{
      if(res.data.status == 200){
        success(res.data);
      }else{
        fail(res.data);
      }
    },
    fail:function(res){
      fail(res.data);
    },
    complete:function(res){
      if(message != ''){
        wx.hideLoading()
      }
    }
  })
} 

module.exports = http ;