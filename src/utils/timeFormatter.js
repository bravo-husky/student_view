const time_stamp = (stamp, onlyDate) => {
  if (!stamp) {
    return 0;
  }
  let date = new Date(stamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear();
  var M = date.getMonth() + 1;
  var D = date.getDate();
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();

  var _week = date.getDay() + 1;

  if (M < 10) {
    M = "0" + M;
  }
  if (D < 10) {
    D = "0" + D;
  }
  if (h < 10) {
    h = "0" + h;
  }
  if (m < 10) {
    m = "0" + m;
  }
  if (s < 10) {
    s = "0" + s;
  }
  if (onlyDate) {
    return Y + "-" + M + "-" + D;
  } else {
    return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
  }

  // return { year: Y, month: M, day: D, week: _week, hour: h, min: m, sec: s };
};

export { time_stamp };
