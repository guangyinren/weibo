
function RepertoryInfo(item,index,page){
    try{
    	//序号
    	this.index = index;
    	this.page = page;
    	//发票种类
        this.invoiceKind = item.invoiceKind?item.invoiceKind:"";
        //发票代码
        this.invoiceCode=item.invoiceCode?item.invoiceCode:"";
        //发票起号
        this.invoiceStartNum=item.invoiceStartNum?item.invoiceStartNum:"";
        //发票止号
        this.invoiceEndNum=item.invoiceEndNum?item.invoiceEndNum:"";
        //剩余份数
        this.invoiceSurplusNum = item.invoiceSurplusNum?item.invoiceSurplusNum:"";
        //购买日期
        this.invoiceBuyTime=item.invoiceBuyTime?item.invoiceBuyTime:"";
        //分机号
        this.extensionNum=item.extensionNum?item.extensionNum:"";
    }catch(e){
        console.info(e);
    }
}

RepertoryInfo.prototype={
    /**
     * 填充数据，返回填充后的字符串
     * @returns {string}
     */
    fillListData: function () {
        var strs = [];
        if(this.index && this.index % 2 == 0){
        	strs.push('<tr class="alt">');
        }else{
            strs.push('<tr>');
        }
        
        strs.push('<td>'+this.index+'</td>');
        if(this.invoiceKind == "0"){
        	strs.push('<td>纸质增值税专用发票</td>');
        }else if(this.invoiceKind == "2"){
        	strs.push('<td>纸质增值税普通发票</td>');
        }else if(this.invoiceKind == "51"){
        	strs.push('<td>电子增值税普通发票</td>');
        }else if(this.invoiceKind == "41"){
        	strs.push('<td>卷票</td>');
        }
        strs.push('<td>'+this.invoiceCode+'</td>');
        strs.push('<td>'+this.invoiceStartNum+'</td>');
        strs.push('<td>'+this.invoiceEndNum+'</td>');
        strs.push('<td>'+this.invoiceSurplusNum+'</td>');
        strs.push('<td>'+new Date(this.invoiceBuyTime).Format('yyyy-MM-dd hh:mm:ss')+'</td>');
        strs.push('<td>'+this.extensionNum+'</td>');
        strs.push('</tr>');
        return strs.join("");
    },
}

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}