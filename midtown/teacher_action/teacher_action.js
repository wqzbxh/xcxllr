// midtown/teacher_action/teacher_action.js
var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var ringChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {
      action_path: '/public/image/action.png',
      index_path: '/public/image/indexOut.png',
      student_path: '/public/image/studentOut.png',
      action: 'tarbarCur'
    },
    courses: '/public/image/bao.png',
    feedback: '/public/image/bao1.png',
    soft_power: '/public/image/bao2.png',
    power: '/public/image/bao3.png',
    statistics: '/public/image/bao4.png',
    gather: '/public/image/bao5.png',
  },
  touchHandler: function (e) {
    console.log(ringChart.getCurrentDataIndex(e));
  },
  updateData: function () {
    ringChart.updateData({
      title: {
        name: '80%'
      },
      subtitle: {
        color: '#ff0000'
      }
    });
  },
  onReady: function (e) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    ringChart = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas',
      type: 'ring',
      extra: {
        ringWidth: 15
      },
      title: {
        name: '70%',
        color: '#7cb5ec',
        fontSize: 18
      },
      subtitle: {
        name: '数据',
        color: '#666666',
        fontSize: 15
      },
      series: [{
        name: '成交量1',
        data: 20,
        stroke: false
      }, {
        name: '成交量2',
        data: 20,
        stroke: false
      }, {
        name: '成交量3',
        data: 20,
        stroke: false
      }, {
        name: '成交量4',
        data: 63,
        stroke: false
      }],
      disablePieStroke: true,
      width: windowWidth,
      height: 150,
      dataLabel: false,
      legend: false,
      padding: 0
    });
    ringChart.addEventListener('renderComplete', () => {
      console.log('renderComplete');
    });
    setTimeout(() => {
      ringChart.stopAnimation();
    }, 500);
  }
})