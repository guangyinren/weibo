function RechargeRecord(item,index){
    try{
    	//序号
    	this.index = index;
    	this.id = item.id?item.id:"";
    	//支付订单ID
        this.payOrderId = item.payOrderId?item.payOrderId:"";
        //充值金额
        this.rechargeMoney=item.rechargeMoney?item.rechargeMoney:"";
        //充值方式ALIPAY/WECHAT
        this.rechargeType=item.rechargeType?item.rechargeType:"";
        //创建时间
        this.createTime=item.createTime?item.createTime:"";
        //充值账号
        this.rechargeAccount = item.rechargeAccount?item.rechargeAccount:"";
        //充值状态
        this.status = item.status?item.status:"";
        //删除状态 1:已删除；0：未删除
        this.isDeleted=item.isDeleted?item.isDeleted:"";
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
        strs.push('<td>'+new Date(this.createTime).Format('yyyy-MM-dd hh:mm:ss')+'</td>');
        strs.push('<td>'+this.rechargeMoney+'</td>');
        strs.push('<td>'+this.rechargeType+'</td>');
        strs.push('<td>'+this.rechargeAccount+'</td>');
        strs.push('<td>'+this.status+'</td>');
        if(this.status=="PAY_FAILURE"&&!this.isDeleted){
        	strs.push('<td><a herf="javascript:void(0);" onclick="delRechargeRecord(\''+this.id+'\')">操作</a></td>');
        }else{
        	strs.push('<td></td>');
        }
        strs.push('</tr>');
        return strs.join("");
    },
}


function ConsumeRecord(item,index){
    try{
    	//序号
    	this.index = index;
    	this.id = item.id?item.id:"";
    	//消费项目ID
        this.consumeItemId = item.consumeItemId?item.consumeItemId:"";
        //消费金额
        this.consumeMoney=item.consumeMoney?item.consumeMoney:"";
        //创建时间
        this.createTime=item.createTime?item.createTime:"";
        //消费描述
        this.consumeDescription = item.consumeDescription?item.consumeDescription:"";
    }catch(e){
        console.info(e);
    }
}

ConsumeRecord.prototype={
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
        if("02" == this.consumeItemId){
        	strs.push('<td>短信</td>');
        }else if("03" == this.consumeItemId){
        	strs.push('<td>开票</td>');
        }else if("01" == this.consumeItemId){
        	strs.push('<td>服务费</td>');
        }else if("04" == this.consumeItemId){
        	strs.push('<td>结算扣款</td>');
        }
        strs.push('<td>'+this.consumeMoney+'</td>');
        strs.push('<td>'+this.createTime+'</td>');
        strs.push('<td>'+this.consumeDescription+'</td>');
        strs.push('</tr>');
        return strs.join("");
    },
}
function RefundRecord(item,index){
	try{
		//序号
		this.index = index;
		this.id = item.id?item.id:"";
		//退款序列号
		this.refundCode = item.refundCode?item.refundCode:"";
		//退款金额
		this.refundMoney=item.refundMoney?item.refundMoney:"";
		//退款方式
		this.refundType=item.refundType?item.refundType:"";
		//创建时间
		this.createTime=item.createTime?item.createTime:"";
		//退款账号
		this.refundAccount = item.refundAccount?item.refundAccount:"";
		//退款状态
        this.refundStatus = item.refundStatus?item.refundStatus:"";
		//删除状态 1:已删除；0：未删除
		this.isDeleted=item.isDeleted?item.isDeleted:"";
	}catch(e){
		console.info(e);
	}
}

RefundRecord.prototype={
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
			strs.push('<td>'+new Date(this.createTime).Format('yyyy-MM-dd hh:mm:ss')+'</td>');
			strs.push('<td>'+this.refundMoney+'</td>');
			strs.push('<td>'+this.refundType+'</td>');
			strs.push('<td>'+this.refundAccount+'</td>');
			strs.push('<td>'+this.refundStatus+'</td>');
			if(this.refundStatus=="退款失败"){
	        	strs.push('<td><a herf="javascript:void(0);" onclick="delRefundRecord(\''+this.id+'\')">删除</a></td>');
	        }else{
	        	strs.push('<td></td>');
	        }
			strs.push('</tr>');
			return strs.join("");
		}
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