import {getDateFromStart,timeFormat,formatTime, getTime} from '../../utils/time'
Page({
  data:{
      selectedId:'',
      toolBarWidth:60,
      toolBgColor:'#121419',
      fontColor:'#fff',
      dates:[],
      cells:[],
      globalData:null,
      timeHeight:20,
      days:7,
      cellH:40,
      cellW:50,
      cellHours:[],
      hourW:50,
      statusList:[
        {id:0,title:'普通',color:'green'},
        {id:0,title:'重要',color:'red'},
      ],
      tasks:[]
  },
  onLoad(){
    //计算表格数量
    this.data.globalData = getApp().globalData;
    let wid = this.data.globalData.sysInfo.screenWidth - this.data.toolBarWidth;
    let hourW = wid/24;
    let cellW = hourW;
    let level = [1,2,3,4,6];
    let idx = 0;
    while(cellW < 50){
      idx++;
      cellW = wid*level[idx]/24;
    }
    let cellHours = [];
    for(let i=0;i<24/idx;i++){
      cellHours.push(formatTime(i*idx*60*60));
    }
    let start = Date.now();
    let dates = [];
    let cells = [];
    for(let i=0;i<this.data.days;i++){
      dates.push(timeFormat(getDateFromStart(start,i),'MM/DD'));
    }
    let tasks = [];
    if (!wx.cloud) {
      //从数据库获取任务
      if (!this.data.globalData.openid) {
        //生成随机任务
        let y_ = timeFormat(start,'YYYY/')
        tasks.push({id:0,date:y_+dates[0],start:"8:00",end:"12:00",title:'测试',check:0});
        tasks.push({id:1,date:y_+dates[1],start:"6:00",end:"8:00",title:'测试2',check:1});
        tasks.push({id:2,date:y_+dates[3],start:"14:00",end:"16:00",title:'测试3',check:0});
      }
      this.setData({
        dates:dates,
        hourW:hourW,
        cellW:cellW,
        cellHours:cellHours,
        tasks:this.getInitTask(tasks)
      })
    }else{//登录，
      this.onGetOpenid();
      this.setData({
        dates:dates,
        hourW:hourW,
        cellW:cellW,
        cellHours:cellHours
      })
    }
  },
  onShow(){
    if(this.data.globalData.task){
      this.setData({
        tasks:[...this.data.tasks,...this.getInitTask([this.data.globalData.task])]
      })
      this.data.globalData.task = null;
    }
  },
  getInitTask(data){
    return data.map(ele=>{
      let pos = this.data.dates.findIndex(item=>ele.date.indexOf(item)>-1);
      if(pos > -1){
        ele.top = pos * this.data.cellH;
      }
      ele.left = (getTime(ele.date + " " + ele.start) - getTime(ele.date + " 00:00:01"))*this.data.hourW/1000/60/60;
      ele.wid = (getTime(ele.date + " " + ele.end) - getTime(ele.date + " " + ele.start))*this.data.hourW/1000/60/60;
      return ele;
    })
  },
  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.data.globalData.openid = res.result.openid
        //查询数据
        this.onQuery();
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  onQuery:function(){
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('day-task').where({
      _openid: this.data.globalData.openid
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        this.setData({
          tasks:this.getInitTask(res.data)
        })
        console.log(this.data.tasks);
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  tap:function(e){
    const id = e.currentTarget.id;
    if(this.data.selectedId !== id){
      this.setData({
        selectedId:''
      })
    }
  },
  longTap:function(e){
    this.setData({
      selectedId:e.currentTarget.id
    })
  },
  onRemove: function(value) {
    const db = wx.cloud.database()
    db.collection('day-task').doc(value).remove({
      success: res => {
        let tasks  = this.data.tasks;
        let idx = tasks.findIndex(ele=>ele._id === value);
        tasks.splice(idx,1);
        this.setData({
          tasks:tasks
        })
      },
      fail: err => {
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  },
  onDel:function(e){
    if(this.data.selectedId !== ''){
      this.onRemove(this.data.selectedId)
    }
  }
})