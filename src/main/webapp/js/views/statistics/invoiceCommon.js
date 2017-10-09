
function Invoice(item,index,page){
    try{
    	//序号
    	this.index = index;
    	this.page = page;
    	this.id = item.id?item.id:"";
    	//销售单据号
        this.xsdjh = item.xsdjh?item.xsdjh:"";
        //购买方名称
        this.gmfmc=item.gmfmc?item.gmfmc:"";
        //联系人名称
        this.lxmc=item.lxmc?item.lxmc:"";
        //联系人手机
        this.lxsj=item.lxsj?item.lxsj:"";
        //发票代码
        this.fpdm = item.fpdm?item.fpdm:"";
        //发票号码
        this.fphm=item.fphm?item.fphm:"";
        //开票日期
        this.kprq=item.kprq?item.kprq:"";
        //合计税额
        this.se=item.se?item.se:"";
        //合计税额
        this.fpqqlsh=item.fpqqlsh?item.fpqqlsh:"";
        //价税合计
        this.jshjje=item.jshjje?item.jshjje:"";
        //开票人
        this.kpr=item.kpr?item.kpr:"";
        //是否红票
        this.status=item.status?item.status:"";
        //类型
        this.kplx=item.kplx?item.kplx:"";
        //种类
        this.fpzldm=item.fpzldm?item.fpzldm:"";
    }catch(e){
        console.info(e);
    }
}

Invoice.prototype={
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
        if(this.fpzldm == "04"){
        	strs.push('<td>纸质增值税普通发票</td>');
        }else if(this.fpzldm == "10"){
        	strs.push('<td>电子增值税普通发票</td>');
        }else if(this.fpzldm == "01"){
        	strs.push('<td>纸质增值税专用发票</td>');
        }
        strs.push('<td>'+this.xsdjh+'</td>');
        strs.push('<td>'+this.gmfmc+'</td>');
        strs.push('<td>'+this.lxmc+'</td>');
        strs.push('<td>'+this.lxsj+'</td>');
        strs.push('<td>'+this.fpdm+'</td>');
        strs.push('<td>'+this.fphm+'</td>');
        strs.push('<td>'+this.kprq+'</td>');
        strs.push('<td>'+this.se+'</td>');
        strs.push('<td>'+this.jshjje+'</td>');
        strs.push('<td>'+this.kpr+'</td>');
        if(this.kplx == "1"){
        	strs.push('<td>蓝票</td>');
        }else{
        	strs.push('<td>红票</td>');
        }
        if(this.fpzldm == "04" || this.fpzldm == "01"){
        	strs.push('<td><a herf="javascript:void(0);" onclick="viewPaperInvoice(\''+this.fpqqlsh+'\',\''+this.page+'\')">查看</a></td>');
        }else if(this.fpzldm == "10"){
        	strs.push('<td><a herf="javascript:void(0);" onclick="viewElecInvoice(\''+this.fpqqlsh+'\',\''+this.page+'\')">查看</a>');
            strs.push('<a herf="javascript:void(0);" onclick="singlePrint(\''+this.fpqqlsh+'\')">打印</a>');
            strs.push('<a href="'+basePath+'invoice/downloadBill'+suffix+'?fpqqlsh='+this.fpqqlsh+'" target="_blank">下载</a></td>');
        }
        strs.push('</tr>');
        return strs.join("");
    },
    fillDetailData:function() {
    	$("#xsdjh").val(this.xsdjh);
    	$("#gmfMc").val(this.gmfmc);
    	$("#lxmc").val(this.lxmc);
    	$("#lxsj").val(this.lxsj);
    	$("#fpdm").val(this.fpdm);
    	$("#fphm").val(this.fphm);
    	$("#hjje").text(this.hjje);
    	$("#kprq").text(this.kprq);
    	$("#se").text(this.se);
    	$("#jshjje").text(this.jshjje);
    	$("#kpr").text(this.kpr);
    },
}

