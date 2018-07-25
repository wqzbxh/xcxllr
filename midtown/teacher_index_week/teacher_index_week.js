import { promiseHandle, log, formatNumber, formatTime } from '../../utils/date.js';
Page({
  data: {
    item: {
      action_path: '/public/image/actionOut.png',
      index_path: '/public/image/index.png',
      student_path: '/public/image/studentOut.png',
      indexAction: 'tarbarCur'
    },
    index: 0,
    array: ['Alice', 'Jack', 'Meacle', 'Lili'],
  },
  onLoad() {
  },
  onReady() {
    this.calendar = this.selectComponent("#calendar");
    this.calendar.showCalendar();
    this.calendar2 = this.selectComponent("#calendar2");
    this.calendar2.showCalendar();
  },
});

