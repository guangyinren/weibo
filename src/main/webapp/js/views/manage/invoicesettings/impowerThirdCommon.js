function RechargeRecord(item,index){
    try{
    	//序号
    	this.index = index;
    	this.id = item.id?item.id:"";
    	
        this.merchantId = item.merchantId?item.merchantId:"";
        
        this.createTime = item.createTime?item.createTime:"";
        
        this.mName=item.mName?item.mName:"";
        
        this.subMName=item.subMName?item.subMName:"";
    }catch(e){
        console.info(e);
    }
}

RechargeRecord.prototype={
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
        strs.push('<td>'+this.merchantId+'</td>');
        strs.push('<td>'+new Date(this.createTime).Format("yyyy-MM-dd hh:mm:ss")+'</td>');
        strs.push('<td>'+this.mName+'</td>');
        strs.push('<td>'+this.subMName+'</td>');
        strs.push('<td><a herf="javascript:void(0);" onclick="unbind(\''+this.merchantId+'\')">解除绑定</a></td>');
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