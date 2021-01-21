/*对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
      可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
       例：   
   (new Date()).format("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423      
   (new Date()).format("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
   (new Date()).format("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
   (new Date()).format("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
   (new Date()).format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18      
 */
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份         
        "d+": this.getDate(), //日         
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
        "H+": this.getHours(), //小时         
        "m+": this.getMinutes(), //分         
        "s+": this.getSeconds(), //秒         
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
        "S": this.getMilliseconds() //毫秒         
    };
    var week = {
        "0": "日",
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};
/**
 * 判断date1是否在date2之前
 */
Date.prototype.before = function (date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    if (date1.getTime() > date2.getTime()) {
        return true;
    } else {
        return false;
    }

};
/**
 * 获取某日期之前days天的日期
 * @param date 某日期 yyyy-MM-dd
 * @param days 获取该日期之前days天的日期
 */
Date.prototype.getBeforeDay = function (date, days) {
    var d = new Date(date);
    d.setTime(d.getTime() - 24 * 60 * 60 * 1000 * days);
    return d;
};
/**
 * 获取某日期之后days天的日期
 * @param date 某日期 yyyy-MM-dd
 * @param days 获取该日期之前days天的日期
 */
Date.prototype.getAfterDay = function (date, days) {
    var d = new Date(date);
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    return d;
};
/**
 * 获取某日期是当年的第几周
 * @param date 某日期 yyyy-MM-dd
 */
Date.prototype.getYearWeekByDay = function (date) {
    var year = date.split("-")[0];
    var d1 = new Date(date);
    var d2 = new Date(date);
    d2.setMonth(0);
    d2.setDate(1);
    var rq = d1-d2;
    var s1 = Math.ceil(rq/(24*60*60*1000));
    var s2 = Math.ceil(s1/7);
    return year + "" + s2;
    //console.log("今天是本年第"+s1+"天，第"+s2+"周");//周日做为下周的开始计算
};
Date.prototype.getMonthLastWeek = function (month) {
    //传入月最后一天
    var date = new Date(month.toString().substring(0,4),month.toString().substring(4,6),0)
    //0为周日
    var week = date.getDay();
    if(week != 0){
        date.setDate(date.getDate()-7);
    }
    return date.getYearWeekByDay(date.format("yyyy-MM-dd"));
};
/**
 * 两个时间相差天数
 * @param 参数日期 yyyy-MM-dd
 */
Date.prototype.datedifference = function (sDate1, sDate2) {
    var  aDate,  oDate1,  oDate2,  iDays;
    aDate  =  sDate1.split("-");
    oDate1  =  new  Date(aDate[0],aDate[1]-1,aDate[2])    //转换为12-18-2006格式
    aDate  =  sDate2.split("-");
    oDate2  =  new  Date(aDate[0],aDate[1]-1,aDate[2])
    iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24,10)    //把相差的毫秒数转换为天数
    return  iDays;
};
/*对Array的扩展*/
/**
 * 对Array的扩展  根据val删除数组中的值
 */
Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}

var calculationWeek = function(date){
    var rs = 0;
    //查看一年的第一天是周几
    var myDate=new Date();
    //var myDate1=new Date();

    var year = date.getFullYear();
    myDate.setFullYear(year,0,1);
    var weekDays = [6, 0, 1, 2, 3, 4, 5];

    var week = myDate.getDay();
    var nowWeek = date.getDay();
    var theDay = 0;
    //debugger;
    if(week == 1){
        theDay = Math.ceil((date.getTime() - myDate.getTime()) / (24*60*60*1000)+(6-weekDays[nowWeek]));
        var num = Math.ceil(theDay/7);
        rs = (year+''+(num<9 ? '0'+num : num )) * 1;
        return rs;
    }else{
        var myDate1=new Date(date.getFullYear(),date.getMonth(),date.getDate());
        myDate1.setDate(myDate1.getDate() - (8-(week == 0 ? 7: week)));
        if(year == myDate1.getFullYear()){//判断 是否是同一年

            theDay = Math.ceil((date.getTime() - myDate.getTime()) / (24*60*60*1000))-weekDays[nowWeek];
            console.log(myDate.getDate()+"  "+date.getDate() +" theDay: "+theDay+" nowWeek : "+nowWeek);
            var num = Math.ceil(theDay/7);
            rs = (year+''+(num<9 ? '0'+num : num )) * 1;
            return rs;
        }else{
            myDate.setFullYear(year-1,11,31);
            return calculationWeek(myDate);
        }

    }
}