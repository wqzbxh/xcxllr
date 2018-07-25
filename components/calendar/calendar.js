import { formatNumber, formatTime } from '../../utils/date.js';
// import HTTPUtil from '../../utils/HTTPUtil.js'
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /** * 组件的属性列表 * 用于组件自定义设置 */
  properties: {
    // 弹窗标题 
    calendarType: {// 属性名
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型） 
      value: false // 属性初始值（可选），如果未指定则会根据类型选择一个 false 按照星期显示，true 按照月显示 ，默认false
    },
  },
  /** * 私有数据,0组1件的初始数据 * 可用于模版渲染 */
  data: {
    isShow: false,
    isfarleft: false,      //默认不是显示当前月分的最左边（第一周）
    isfarright: false,      //默认不是显示当前月分的最右边（最后一周）
    showYear: '',           //显示年份
    currentTap: 0,          //swiper的页码
    currentTap1:0,
    showMonth: {},          //显示月份
    plans: [],              //所有计划
    showPlans: [],          //显示的计划
    data: {},               //日历的所有数据
    subDates: [],           //精简后的月日历数据，去掉了月月之间的链接部分
    showWeekDays: [],       //每周的日历数据
    showPlan: 'none',       //每天是否有计划的标识、默认无计划
    planItemH: 80 ,          //每条计划的高度。
  },

  /** * 组件的方法列表 * 更新属性和数据的方法与更新页面数据的方法类似 */
  methods: {
    httpRquest(url) {
    //   var that = this
    //   HTTPUtil.get(url, {}, (res) => {
    //     console.log(res.data);
    //     that.setData({ plans: res.data });
    //     changeDate.call(that);
    //   })
    },
    showCalendar(){
      changeDate.call(this);
    },
    /**
   * 日历左右滚动监听
   */
    swiperChange(e) {
      // 根据滚动页判断滚动方向
      var num = e.detail.current - this.data.currentTap;
      this.setData({ currentTap: e.detail.current });

      //向右滚动
      if (num == -2 || num == 1) {
        //判断是否已经滚动到当前月份的最后一个星期
        if (this.data.isfarright) {
          // 更改月份滚动到下一个月的第一个星期
          const { year, month } = { year: this.data.data.afterYear, month: this.data.data.afterMonth };
          changeDate.call(this, new Date(year, parseInt(month) - 1, 1));
        } else {
          //不改变月份
          changeWeekDates(this, 1);
        }
      } else {//向左滚动
        //判断是否已经滚动到当前月份的第一个星期
        if (this.data.isfarleft) {
          // 更改月份滚动到上一个月的最后一个星期
          const { year, month } = { year: this.data.data.beforeYear, month: this.data.data.beforMonth };
          changeDate.call(this, new Date(year, parseInt(month) - 1, 1));
        } else {
          // 不改变月份
          changeWeekDates(this, 0);
        }
      }
    },
    /**
   * 日历左右滚动监听
   */
    swiperChange2(e) {
      var num = e.detail.current - this.data.currentTap1;
      this.setData({ currentTap1: e.detail.current });
      if (num == -2 || num == 1) {
        const { year, month } = { year: this.data.data.afterYear, month: this.data.data.afterMonth };
        changeDate.call(this, new Date(year, parseInt(month) - 1, 1));
      } else {
        const { year, month } = { year: this.data.data.beforeYear, month: this.data.data.beforMonth };
        changeDate.call(this, new Date(year, parseInt(month) - 1, 1));
      }
    },
    /**
     * 点击今显示几天的日程
     */
    gotoToday() {
      let _this = this;
      //获取当前时间
      let year = this.data.data.currentYear;
      let month = this.data.data.currentMonth;
      let date = this.data.data.currentDate;

      //初始化数据
      this.setData({
        isfarleft: false,
        isfarright: false
      })
      //显示当前时间的计划
      showClickDate(this, year, month, date);
    },
    //日期被点击的事件触发
    dateClickEvent(e) {
      const { year, month, date } = e.currentTarget.dataset;
      //显示当前时间的计划
      showClickDate(this, year, month, date);
    },
    //跳到计划详情页
    jumpToMorePlan() {
      wx.navigateTo({
        url: '../morePlan/morePlan',
      })
    },
    //点击计划去到计划详情
    clickPlanItem(e) {
      console.log(e);
      wx.navigateTo({
        url: '../planDetail/planDetail?planId=' + e.currentTarget.dataset.planid,
      })
    }
  }
})
/**
* 变更日期数据
* @param {Date} targetDate 当前日期对象
*/
function changeDate(targetDate) {
  console.log(this)
  let date = targetDate || new Date();
  let currentDateObj = new Date();

  let showMonth, //当天显示月份
    showYear, //当前显示年份
    showDay, //当前显示星期
    showDate, //当前显示第几天
    showMonthFirstDateDay, //当前显示月份第一天的星期
    showMonthLastDateDay, //当前显示月份最后一天的星期
    showMonthDateCount; //当前月份的总天数
  let data = [];

  showDate = date.getDate();
  showMonth = date.getMonth() + 1;
  showYear = date.getFullYear();
  showDay = date.getDay();

  showMonthDateCount = new Date(showYear, showMonth, 0).getDate();
  date.setDate(1);
  showMonthFirstDateDay = date.getDay(); //当前显示月份第一天的星期
  date.setDate(showMonthDateCount);
  showMonthLastDateDay = date.getDay(); //当前显示月份最后一天的星期  

  let beforeDayCount = 0,
    beforeYear, //上页月年份
    beforMonth, //上页月份
    afterYear, //下页年份
    afterMonth, //下页月份
    afterDayCount = 0, //上页显示天数
    beforeMonthDayCount = 0; //上页月份总天数
  //上一个月月份
  beforMonth = showMonth === 1 ? 12 : showMonth - 1;
  //上一个月年份
  beforeYear = showMonth === 1 ? showYear - 1 : showYear;
  //下个月月份
  afterMonth = showMonth === 12 ? 1 : showMonth + 1;
  //下个月年份
  afterYear = showMonth === 12 ? showYear + 1 : showYear;

  //获取上一页的显示天数
  if (showMonthFirstDateDay != 0)
    beforeDayCount = showMonthFirstDateDay - 1;
  else
    beforeDayCount = 6;

  //获取下页的显示天数
  if (showMonthLastDateDay != 0)
    afterDayCount = 7 - showMonthLastDateDay;
  else
    showMonthLastDateDay = 0;

  //如果天数不够6行，则补充完整
  let tDay = showMonthDateCount + beforeDayCount + afterDayCount;
  if (tDay <= 35)
    afterDayCount += (42 - tDay); //6行7列 = 42

  let selected = this.data.data['selected'] || { year: showYear, month: showMonth, date: showDate };
  let selectDateText = selected.year + '年' + formatNumber(selected.month) + '月' + formatNumber(selected.date) + '日';

  data = {
    currentDate: currentDateObj.getDate(), //当天日期第几天
    currentYear: currentDateObj.getFullYear(), //当天年份
    currentDay: currentDateObj.getDay(), //当天星期
    currentMonth: currentDateObj.getMonth() + 1, //当天月份
    showMonth: showMonth, //当前显示月份
    showDate: showDate, //当前显示月份的第几天 
    showYear: showYear, //当前显示月份的年份
    beforeYear: beforeYear, //当前页上一页的年份
    beforMonth: beforMonth, //当前页上一页的月份
    afterYear: afterYear, //当前页下一页的年份
    afterMonth: afterMonth, //当前页下一页的月份
    selected: selected,
    selectDateText: selectDateText
  };
  // console.log(selected);
  showSelectDatePlans(this, selected);
  let dates = [];
  let _id = 0; //为wx:key指定

  if (beforeDayCount > 0) {
    beforeMonthDayCount = new Date(beforeYear, beforMonth, 0).getDate();
    for (let fIdx = 0; fIdx < beforeDayCount; fIdx++) {
      dates.unshift({
        _id: _id,
        year: beforeYear,
        month: beforMonth,
        date: beforeMonthDayCount - fIdx
      });
      _id++;
    }
  }

  for (let cIdx = 1; cIdx <= showMonthDateCount; cIdx++) {
    //插入是否有计划的标识
    let havePlan = 'none';
    for (let planidx = 0; planidx < this.data.plans.length; planidx++) {
      if (formatTime(this.data.plans[planidx].startTm).year == showYear && formatTime(this.data.plans[planidx].startTm).month == showMonth && formatTime(this.data.plans[planidx].startTm).date == cIdx) {
        havePlan = 'block';
        break;
      }
    }
    dates.push({
      _id: _id,
      active: (selected['year'] == showYear && selected['month'] == showMonth && selected['date'] == cIdx), //选中状态判断
      havePlan: havePlan,
      year: showYear,
      month: showMonth,
      date: cIdx
    });
    _id++;
  }

  if (afterDayCount > 0) {
    for (let lIdx = 1; lIdx <= afterDayCount; lIdx++) {
      dates.push({
        _id: _id,
        year: afterYear,
        month: afterMonth,
        date: lIdx
      });
      _id++;
    }
  }
  data.dates = dates;
  weekDates(this, dates);
  this.setData({
    data: data,
    pickerDateValue: showYear + '-' + showMonth,
    showMonth: showMonth,
    showYear: showYear
  });
}
/**
 * 显示选中的日期
 * @param {year, month, date, haveplan} 
 */
function showClickDate(that, year, month, date) {
  const { data } = that.data;
  data['selected']['year'] = year;
  data['selected']['month'] = month;
  data['selected']['date'] = date;
  that.setData({ data: data });
  changeDate.call(that, new Date(year, parseInt(month) - 1, date));
}
/**
 * 显示选中日期的日程
 * 
 */
function showSelectDatePlans(that, selected) {
  const { year, month, date } = selected;
  var plansArr = that.data.plans;
  var showPlans = [];
  var havePlan = false;
  for (let i = 0; i < plansArr.length; i++) {
    if (formatTime(plansArr[i].startTm).year == year && formatTime(plansArr[i].startTm).month == month && formatTime(plansArr[i].startTm).date == date) {
      var plansItem = plansArr[i];
      plansItem.start = formatTime(plansArr[i].startTm).hour + ':' + formatTime(plansArr[i].startTm).minute
      plansItem.end = formatTime(plansArr[i].endTm).hour + ':' + formatTime(plansArr[i].endTm).minute
      showPlans.push(plansArr[i]);
      havePlan = true;
    }
  }
  if (havePlan == true) {
    that.setData({ showPlans: showPlans });
    that.setData({ showPlan: 'block' });
    that.setData({ planItemH: 120 * (showPlans.length > 2 ? 2 : showPlans.length) + 80 })
  } else {
    that.setData({ showPlan: 'none' });
    that.setData({ planItemH: 80 })
  }
}

/**
 * 显示一周的日期
 * 把日历改成一周的样式显示
 */
function weekDates(that, dates) {
  var isfarleft = that.data.isfarleft;
  var isfarright = that.data.isfarright;
  console.log(isfarleft, isfarright);
  var showWeekDays = [];
  //如果一个月的星期跨度小于6周就去掉多余的显示
  var subDates = dates[35].date < 20 ? dates.slice(0, 35) : dates;
  var currentDateIndex = 0;
  if (isfarleft) {
    currentDateIndex = subDates.length - 7;
    showWeekDays = subDates.slice(subDates.length - 7, subDates.length);
    that.setData({
      isfarleft: false,
      isfarright: true,
    });
  } else if (isfarright) {
    showWeekDays = subDates.slice(0, 7);
    that.setData({
      isfarleft: true,
      isfarright: false,
    });
  } else {
    for (let datesIdx = 0; datesIdx < subDates.length; datesIdx++) {
      if (dates[datesIdx].active) {
        currentDateIndex = parseInt(datesIdx / 7) * 7;
        showWeekDays = subDates.slice(parseInt(datesIdx / 7) * 7, (datesIdx / 7) * 7 + 7)
        break;
      }
    }
    //如果刚刚进入的时候就是第一周或者最后一周，改变初始化数据
    if (currentDateIndex == 0) {
      that.setData({
        isfarleft: true,
      });
    }
    if (subDates[currentDateIndex + 7] == undefined) {
      that.setData({
        isfarright: true,
      });
    }
  }
  that.setData({
    showWeekDays: showWeekDays,
    subDates: subDates,
    currentDateIndex: currentDateIndex,
  });
}

//在月内改变周数据
function changeWeekDates(that, leftRight) {
  console.log(that.data.isfarleft, that.data.isfarright);
  var currentDateIndex = that.data.currentDateIndex;
  var subDates = that.data.subDates;
  var showWeekDays = [];
  if (leftRight == 0) {
    showWeekDays = subDates.slice(currentDateIndex - 7, currentDateIndex);
    that.setData({
      showWeekDays: showWeekDays,
      currentDateIndex: currentDateIndex - 7,
      isfarleft: currentDateIndex - 7 == 0 ? true : false,
      isfarright: false
    });
  } else {
    showWeekDays = subDates.slice(currentDateIndex + 7, currentDateIndex + 14);
    that.setData({
      showWeekDays: showWeekDays,
      currentDateIndex: currentDateIndex + 7,
      isfarright: currentDateIndex + 14 >= subDates.length ? true : false,
      isfarleft: false,
    });
  }
}