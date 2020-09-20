// miniprogram/pages/publish/index.js
import {getDateFromStart,timeFormat,formatTime, getTime} from '../../utils/time'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start:"2020-10-01",
    end:"2020-10-01",
    list:[
      {label:"日期",name:'date',type:'date',value:'',start:'',end:''},
      {label:"开始",name:'start',type:'time',value:'00:00'},
      {label:"结束",name:'end',type:'time',value:'02:00'},
      {label:"级别",name:'check',type:'radio',value:0,items:[{name:"普通",value:0},{name:"重要",value:1}]},
      {label:"标题",name:'title',type:'text',value:''},
      {label:"描述",name:'detail',type:'areatext',value:''},
      {type:'button',value:[{name:'新建'}]}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let start= Date.now();
      let end = start + 7*1000*60*60*24;
      let list = this.data.list;
      list[0].value = timeFormat(start,'YYYY/MM/DD');
      list[0].start = list[0].value;
      list[0].end = timeFormat(end,'YYYY/MM/DD');
      this.setData({
        list:list
      })
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

  },
  bindDateChange: function (e) {
    let idx = e.currentTarget.id;
    this.setData({
      ['list['+idx+'].value']: e.detail.value.split(/\D/).join('/')
    })
  },
  bindTimeChange: function (e) {
    let idx = e.currentTarget.id;
    this.setData({
      ['list['+idx+'].value']: e.detail.value
    })
  },
  bindconfirm:function(e){
    const idx = e.currentTarget.id;
    this.setData({
      ['list['+idx+'].value']: e.detail.value
    })
  },
  radioChange:function(e){
    const idx = e.currentTarget.id;
    this.setData({
      ['list['+idx+'].value']: parseInt(e.detail.value)
    })
  },
  onSubmit:function(){
    console.log('sub')
    let obj = {},tmp;
    for(let i = 0; i<this.data.list.length;i++){
      tmp = this.data.list[i];
      if(tmp.type === 'button') continue;
      obj[tmp.name] = tmp.value;
    }
    //保存数据库
    this.onAdd(obj);
  },
  onAdd: function (data) {
    const db = wx.cloud.database()
    db.collection('day-task').add({
      data: data,
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res)
        getApp().globalData.task = Object.assign({_id:res._id},data);
        wx.switchTab({
          url: '/pages/index/index',
        })
      },
      fail: err => {
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
})