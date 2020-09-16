Date.prototype.Format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};

export function formatTimeToStr(times, pattern) {
  var d = new Date(times).Format("yyyy-MM-dd hh:mm:ss");
  if (pattern) {
    d = new Date(times).Format(pattern);
  }
  return d.toLocaleString();
}

export function fomatDateToStr(date, pattern) {
  var d = date.Format("yyyy-MM-dd hh:mm:ss");
  if (pattern) {
    d = date.Format(pattern);
  }
  return d.toLocaleString();
}

export function fomatDateToStrToYMD(date, pattern) {
  var d = date.Format("yyyy-MM-dd");
  if (pattern) {
    d = date.Format(pattern);
  }
  return d.toLocaleString();
}

export function getDay(day) {
  var today = new Date();
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetday_milliseconds); //注意，这行是关键代码
  var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  var tHour = today.getHours() > 9 ? today.getHours() : "0" + today.getHours();
  var tSecond =
    today.getSeconds() > 9 ? today.getSeconds() : "0" + today.getSeconds();
  var tminute =
    today.getMinutes() > 9 ? today.getMinutes() : "0" + today.getMinutes();
  tMonth = doHandleMonth(tMonth + 1);
  tDate = doHandleMonth(tDate);
  return (
    tYear +
    "-" +
    tMonth +
    "-" +
    tDate +
    " " +
    tHour +
    ":" +
    tminute +
    ":" +
    tSecond
  );
}
function doHandleMonth(month) {
  var m = month;
  if (month.toString().length == 1) {
    m = "0" + month;
  }
  return m;
}
