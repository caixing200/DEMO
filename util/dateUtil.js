module.exports = {
  getPreMonth: function (date) {
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份
    var day = arr[2]; //获取当前日期的日
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数
    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {//如果是1月份，则取上一年的12月份
      year2 = parseInt(year2) - 1;
      month2 = 12;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {//如果原来日期大于上一月的日期，则取当月的最大日期。比如3月的30日，在2月中没有30
      day2 = days2;
    }
    if (month2 < 10) {
      month2 = '0' + month2;//月份填补成2位。
    }
    var t2 = year2 + '-' + month2 + '-' + day2;
    return t2;
  }


} 