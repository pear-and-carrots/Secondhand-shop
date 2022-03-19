// app.js
App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'office-123',
        traceUser: true,
      })
    }

    this.globalData = {}

    if(wx.getStorageSync('nickName') == ''){
      wx.showModal({
                      content: '检测到您没成功登录，是否去设置重新授权登录？',
                      confirmText: "确认",
                      cancelText: "取消",
                      success: function (res) {
                        console.log(res);
                        //点击“确认”时打开设置页面
                        if (res.confirm) {
                          console.log('用户点击确认')
                          wx.getUserProfile({
                            desc:'展示用户信息',
                            success:res=>{
                              console.log(res)
                              wx.setStorageSync('nickName', res.userInfo.nickName)
                              wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
                            },fail:res=>{
                      
                            }
                          })
                          
                        } else {
                          console.log('用户点击取消')
                        }
                      }
                    });

    }else{
      
    }
  },


  openConfirm: function () {
    var that = this
    wx.showModal({
      content: '检测到您没成功登录，是否去设置重新授权登录？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        //点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => { }
          })
          
        } else {
          console.log('用户点击取消')
        }
      }
    });
  }
})
