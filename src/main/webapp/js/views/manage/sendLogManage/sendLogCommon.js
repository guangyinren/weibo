/**
 * SendLog Constructor
 * @modify liuyong
 */
function SendLog(item,index){
    try{
    	//序号
    	this.index = index;
    	//收票帐号
    	this.account = $Utils.handleUndefined(item.account);
    	//发送类型
        this.type = $Utils.handleUndefined(item.type);
        //发送时间
        this.createTime = $Utils.handleUndefined(item.createTime);
        //发送状态
        this.status = $Utils.handleUndefined(item.status);
        //购买方名称
        this.gmfmc = $Utils.handleUndefined(item.gmfMc);
        //收票人名称
        this.sprMc = $Utils.handleUndefined(item.sprMc);
        //发票代码
        this.fpdm = $Utils.handleUndefined(item.fpDm);
        //发票号码
        this.fphm = $Utils.handleUndefined(item.fpHm);
        //发票开票日期
        this.kprq = $Utils.handleUndefined(item.kprq);
        //价税合计
        this.jshj = $Utils.handleUndefined(item.jshj.toFixed(2));
        //发送人
        this.createUsername = $Utils.handleUndefined(item.createUsername);
    }catch(e){
        console.info(e);
    }
}

SendLog.prototype={
    /**
     * 填充数据，返回填充后的字符串
     * @returns {string}
     */
    fillListData: function () {
        var strs = [];
        strs.push('<tr onmouseover="moveOverTr(this)" onmouseout="moveOutTr(this)">');
        strs.push('<td>'+this.index+'</td>');
        strs.push('<td>'+this.account+'</td>');
        if(this.type == 'SMS'){
        	strs.push('<td>短信</td>');
        }else{
        	strs.push('<td>邮件</td>');
        }
        strs.push('<td>'+this.createTime+'</td>');
        if(this.status =='SENDSUCCESS'){
        	strs.push('<td>成功</td>');
        }else{
        	strs.push('<td>失败</td>');
        }
        strs.push('<td>'+this.gmfmc+'</td>');
        strs.push('<td>'+this.sprMc+'</td>');
        strs.push('<td>'+this.fpdm+'</td>');
        strs.push('<td>'+this.fphm+'</td>');
        strs.push('<td>'+this.kprq+'</td>');
        strs.push('<td>'+this.jshj+'</td>');
        strs.push('<td>'+this.createUsername+'</td>');
        strs.push('</tr>');
        return strs.join("");
    }
}
