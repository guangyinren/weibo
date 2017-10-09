/**
 * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * @param 格式化的字符串
 * @author Administrator
 */
Date.prototype.pattern=function(fmt) {         
    var o = {         
    "M+" : this.getMonth()+1, //月份         
    "d+" : this.getDate(), //日         
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
    "H+" : this.getHours(), //小时         
    "m+" : this.getMinutes(), //分         
    "s+" : this.getSeconds(), //秒         
    "q+" : Math.floor((this.getMonth()+3)/3), //季度         
    "S" : this.getMilliseconds() //毫秒         
    };         
    var week = {         
    "0" : "日",         
    "1" : "一",         
    "2" : "二",         
    "3" : "三",         
    "4" : "四",         
    "5" : "五",         
    "6" : "六"        
    };         
    if(/(y+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
    }         
    if(/(E+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "周") : "")+week[this.getDay()+""]);         
    }         
    for(var k in o){         
        if(new RegExp("("+ k +")").test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
        }         
    }         
    return fmt;         
}
/**
 * 日期增加方法
 * @param {Object} strInterval 增量
 * @param {Object} Number 增加数
 * @memberOf {TypeName} 
 * @return {TypeName} 
 */
Date.prototype.dateAdd = function(strInterval, Number) {  
    var dtTmp = this; 
    switch (strInterval) {  
        case 's' :return new Date(Date.parse(dtTmp) + (1000 * Number)); 
        case 'n' :return new Date(Date.parse(dtTmp) + (60000 * Number)); 
        case 'h' :return new Date(Date.parse(dtTmp) + (3600000 * Number)); 
        case 'd' :return new Date(Date.parse(dtTmp) + (86400000 * Number)); 
        case 'w' :return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number)); 
        case 'q' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number*3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds()); 
        case 'm' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds()); 
        case 'y' :return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds()); 
    } 
}
/**
 * 获取日期所在的星期范围
 * @param {Object} start
 * @memberOf {TypeName} 
 * @return {TypeName} 数组类型，起始日期和结束日期 
 */
Date.prototype.getWeek = function(start){
    //Calcing the starting point
    start = start==0 ? 6 : start-1 || 0;

    var today = new Date(this.setHours(0, 0, 0, 0));
	//获取当前日期和指定的差值
    //var day = today.getDay() - start;
    var date = today.getDate() - start;
    // Grabbing Start/End Dates
    var StartDate = new Date(today.setDate(date));
	
	var arr=[];
	for(var i=0;i<=6;i++){
		arr.push(StartDate.dateAdd('d',i));
	}
    //var EndDate = new Date(today.setDate(date + 6));
    return arr;
}
  



























