const db = wx.cloud.database()
// const qnaire = require("../../utils/sas.js") //导入题库
var ans = new Array(100) //答案数组初始化，会在onload函数中赋初值""

Page({
  data: {
    // qnaire: qnaire.qnaire,
    qnaire: [], //课堂检测题目
    qnaire1: [],
    answer: ans,
    id: 0,
    array: ["单选题", "多选题", "判断题", "填空题"],
    // type: 0,
    conLists: [],
    score: [],
    correct: [],
    question_type: [],
    question: '',
    con:[{text:"T"},{text:"F"}]
  },


  onLoad: function (e) {
      var _list = this.data.conLists;
      _list.push("")
      _list.push("")
      this.setData({
        conLists:_list
      })
  },

  // 按钮逻辑
  // 1.下一题
  nextq: function (e) {
    var _conLists = this.data.conLists;
    _conLists = Object.assign({}, this.data.conLists)
    if (this.data.id < 20) {
      this.setData({
        id: this.data.id + 1,
      })
    }

    // 存入新数组
    let _qnaire1 = this.data.qnaire1
    let _data_list = {
      key: {
        score: this.data.score,
        type: this.data.question_type,
        question: this.data.question,
        conLists: this.data.conLists,
        correct: this.data.correct
      }
    }
    _qnaire1.push(_data_list)
    this.setData({
      qnaire1: _qnaire1,
      question: '',
      conLists: [],
      correct: []
    })

    // 排除空选项

    console.log('这是模板内容标题数组', _conLists)
    for (let i = 0; i < _conLists.length; i++) {
      if (!_conLists[i]) {
        wx.showToast({
          title: '请输入第' + `${i * 1 + 1}` + '条的模板内容标题！',
          icon: 'none'
        })
        return;
      }
    }

    if(this.data.question_type){
      console.log("skdhfuiwesgh")
      var _list = this.data.conLists;
      _list.push("")
      _list.push("")
      this.setData({
        conLists:_list
      })
    }
  },
  // 2.上一题
  // lastq: function (e) {
  //   if (this.data.id != 0) {
  //     this.setData({
  //       id: this.data.id - 1,
  //     })
  //   }
  // },

  // 设置答案
  checkboxChange: function (e) {
    console.log(e.detail.value);
    var a = e.detail.value;
    var id = this.data.id;
    ans[id] = a;
    this.setData({
      answer: ans,
    })
    console.log(this.data.answer);
    console.log("选择题的值：", e.detail.value)
  },

  //填空题
  bindtextarea: function (e) {
    var a = e.detail.value;
    var id = this.data.id;
    ans[id] = a;
    this.setData({
      answer: ans
    })
    console.log("填空题的值：", e.detail.value)
  },
  // 3.提交
  bindsubmit: function (e) {},

  // 上传题目
  formSubmit: function () {
    console.log("end", this.data.qnaire1)
    const qnaire = this.data.qnaire1
    db.collection("sas")
      .add({
        data: {
          qnaire
        },
        success(res) {
          console.log(res._id);
        },
        fail(res) {
          wx.showToast({
            icon: 'none',
            title: '题目失败，请稍后再试！'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
      .then(res => {
        // wx.navigateTo({
        //   url: '/pages/chat/chat?openid=' + this.data.goods._openid,
        // });
      })
  },

  //将用户完成的答案数组上传至云数据库
  answer2db: function () {
    db.collection('answer').add({
      data: {
        answer: this.data.answer
      },
      success(res) {
        console.log(res._id);
      },
      fail(res) {
        wx.showToast({
          icon: 'none',
          title: '作业提交失败，请稍后再试！'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  // 管理端
  // 题目类型
  bindPickerChange: function (e) {
    switch (Number(e.detail.value)) {
      case 0:
        this.data.question_type = "单选题"
        break;
      case 1:
        this.data.question_type = "多选题"
        break;
      case 2:
        this.data.question_type = "判断题"
        break;
      case 3:
        this.data.question_type = "填空题"
        break;
      default:
    };
    this.setData({
      index: e.detail.value,
      type: e.detail.value,
    })
  },

  //问题
  question: function (e) {
    console.log(e.detail.value)
    this.setData({
      question: e.detail.value
    })

  },

  radioChange: function (e) {
    console.log(e.detail.value)
  },

  // 分值设置
  slideChange: function (e) {
    this.setData({
      score: e.detail.value
    })
  },


  //添加选项
  add(e) {
    // 点击添加按钮，就往数组里添加一条空数据
    var _list = this.data.conLists;
    var _text = this.data.correct;
    if (this.data.question_type == "单选题" || this.data.question_type == "多选题") {
      _list.push("")
    } else if (this.data.question_type == "填空题") {
      _text.push("")
    }
    this.setData({
      conLists: _list,
      correct: _text,
    })
  },

  /**
   * 删除内容
   */
  del(e) {
    var idx = e.currentTarget.dataset.index;
    var _list = this.data.conLists;
    console.log(idx)
    for (let i = 0; i < _list.length; i++) {
      if (idx == i) {
        _list.splice(idx, 1)
      }
    }
    this.setData({
      conLists: _list
    })
  },

  //复选框
  select: function (e) {
    if (this.data.question_type == "单选题") {
      switch (Number(e.currentTarget.dataset.dex)) {
        case 0:
          this.data.correct = "A"
          break;
        case 1:
          this.data.correct = "B"
          break;
        case 2:
          this.data.correct = "C"
          break;
        case 3:
          this.data.correct = "D"
          break;
        case 4:
          this.data.correct = "E"
          break;
        case 5:
          this.data.correct = "F"
          break;
        case 6:
          this.data.correct = "G"
          break;
        case 7:
          this.data.correct = "H"
          break;
        case 8:
          this.data.correct = "I"
          break;
        case 9:
          this.data.correct = "J"
          break;
        case 10:
          this.data.correct = "K"
          break;
        default:
      };
    } else if (this.data.question_type == "多选题") {
      let _correct = this.data.correct
      switch (Number(e.currentTarget.dataset.dex)) {
        case 0:
          _correct.unshift("A")
          break;
        case 1:
          _correct.unshift("B")
          break;
        case 2:
          _correct.unshift("C")
          break;
        case 3:
          _correct.unshift("D")
          break;
        case 4:
          _correct.unshift("E")
          break;
        case 5:
          _correct.unshift("F")
          break;
        case 6:
          _correct.unshift("G")
          break;
        case 7:
          _correct.unshift("H")
          break;
        case 8:
          _correct.unshift("I")
          break;
        case 9:
          _correct.unshift("J")
          break;
        case 10:
          _correct.unshift("K")
          break;
        default:
      };
      this.setData({
        correct: _correct
      })
    } else if (this.data.question_type == "判断题") {
      let _correct = this.data.correct
      switch (Number(e.currentTarget.dataset.dex)) {
        case 0:
          _correct = "T"
          break;
        case 1:
          _correct = "F"
          break;
        default:
      };
      this.setData({
        correct: _correct
      })
    }
  },

  ////单选题多选题判断题的选项内容
  changeConTitle(e) {
    var idx = e.currentTarget.dataset.index; //当前下标
    var val = e.detail.value; //当前输入的值
    var _list = this.data.conLists; //data中存放的数据
     if (this.data.question_type == "单选题" || this.data.question_type == "多选题") { 
      for (let i = 0; i < _list.length; i++) {
        switch (Number(e.currentTarget.dataset.index)) {
          case 0:
            if (idx == i) {
              _list[i] = {
                A: val
              } //将当前输入的值放到数组中对应的位置
            }
            break
          case 1:
            if (idx == i) {
              _list[i] = {
                B: val
              } //将当前输入的值放到数组中对应的位置
            }
            break
          case 2:
            if (idx == i) {
              _list[i] = {
                C: val
              } //将当前输入的值放到数组中对应的位置
            }
            break
          case 3:
            if (idx == i) {
              _list[i] = {
                D: val
              } //将当前输入的值放到数组中对应的位置
            }
            break
          case 4:
            if (idx == i) {
              _list[i] = {
                E: val
              } //将当前输入的值放到数组中对应的位置
            }
            break
          case 5:
            if (idx == i) {
              _list[i] = {
                F: val
              } //将当前输入的值放到数组中对应的位置
            }
            break
          case 6:
            if (idx == i) {
              _list[i] = {
                G: val
              } //将当前输入的值放到数组中对应的位置
            }
            break
          case 7:
            if (idx == i) {
              _list[i] = {
                H: val
              } //将当前输入的值放到数组中对应的位置
            }
            break
          case 8:
            if (idx == i) {
              _list[i] = {
                I: val
              } //将当前输入的值放到数组中对应的位置
            }
            break
          case 9:
            if (idx == i) {
              _list[i] = {
                J: val
              } //将当前输入的值放到数组中对应的位置
            }
            break
          default:
        }
      }
     }else if(this.data.question_type == "判断题"){
      for (let i = 0; i < _list.length; i++) {
        switch (Number(e.currentTarget.dataset.index)) {
          case 0:
            if (idx == i) {
              _list[i] = {
                T: val
              } //将当前输入的值放到数组中对应的位置
            }
            break
          case 1:
            if (idx == i) {
              _list[i] = {
                F: val
              } //将当前输入的值放到数组中对应的位置
            }
            break
          default:
        }
      }
     }
    this.setData({
      conLists: _list
    })
  },

  //判断题的选项内容
  changeConTitle1: function (e) {
    var idx = e.currentTarget.dataset.index; //当前下标
    var val = e.detail.value; //当前输入的值
    var _text = this.data.correct; //data中存放的数据
    for (let i = 0; i < _text.length; i++) {
      if (idx == i) {
        _text[i] = {
          text_correct: val
        } //将当前输入的值放到数组中对应的位置
      }
    }
    this.setData({
      correct: _text
    })
  },

  // 填空题的点击事件
  tiankon: function (e) {
    this.setData({
      da: true
    })
  },
})