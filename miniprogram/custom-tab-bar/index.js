Component({
  data: {
    selected:1,
    color: "#fff",
    selectedColor: "#fff",
    bgColor:"black",
    list: [{
      pagePath: "/pages/create/index",
      text: "新建"
    }, {
      pagePath: "/pages/index/index",
      text: "甘特图"
    }, {
      pagePath: "/pages/mine/index",
      text: "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path;
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})