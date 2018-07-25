import { promiseHandle, log, formatNumber, formatTime } from '../../utils/date.js';
var app = getApp();
Page({
  data: {
    item: {
      action_path: '/public/image/actionOut.png',
      index_path: '/public/image/index.png',
      student_path: '/public/image/studentOut.png',
      indexAction: 'tarbarCur'
    },
    status: 1
  },
  onLoad() {
  },
  onReady() {
    this.calendar = this.selectComponent("#calendar");
    this.calendar.showCalendar();
    this.calendar2 = this.selectComponent("#calendar2");
    this.calendar2.showCalendar();
  },
  select:function(){
    if (this.data.status == 0){
      this.setData({
        status: 0
      });
    }else{
      this.setData({
        status: 0
      });
    }
  },

  getActivity: function (e) {
    var that = this
    if (e.target.dataset.path == 'cancel'){
      console.log(11)
      that.setData({
        status: 1
      });
    }else{
      wx.navigateTo({
        url: '../' + e.target.dataset.path + '/' + e.target.dataset.path,
      })
    }
  }
});

