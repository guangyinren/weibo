/**
 * Created by Songdan on 2016/4/15.
 * Invoice Constructor
 * @author SongDan
 * @modify liuyong
 */
function Invoice(item,index){
    try{
    	//序号
    	this.index = index;
    	//发票流水号
    	this.fpqqlsh = $Utils.handleUndefined(item.fpqqlsh);
        //发票代码
        this.fpdm = $Utils.handleUndefined(item.fpDm);
        //发票号码
        this.yfpHm = $Utils.handleUndefined(item.yfpHm);
        //原发票代码
        this.yfpDm = $Utils.handleUndefined(item.yfpDm);
        //原发票号码
        this.fphm = $Utils.handleUndefined(item.fpHm);
        //发票校验码
        this.jym = $Utils.handleUndefined(item.jym);
        //购买方名称
        this.gmfmc = $Utils.handleUndefined(item.gmfMc);
        //购买方识别号
        this.gmfsbh = $Utils.handleUndefined(item.gmfNsrsbh);
        //购买方地址
        this.gmfDzdh = $Utils.handleUndefined(item.gmfDzdh);
        //购买方电话
        this.gmfdh = $Utils.handleUndefined(item.gmfdh);
        //购买方开户行
        this.gmfKhh = $Utils.handleUndefined(item.gmfKhh);
        //购买方银行账号
        this.gmfYhzh = $Utils.handleUndefined(item.gmfYhzh);
        //合计金额
        this.hjje = $Utils.handleUndefined(item.hjje);
        //合计税额
        this.hjse = $Utils.handleUndefined(item.hjse);
        //价税合计
        this.jshj = $Utils.handleUndefined(item.jshj.toFixed(2));
        //开票企业(销售方名称)
        this.xsfmc = $Utils.handleUndefined(item.xsfMc);
        //销售方识别号
        this.xsfsbh = $Utils.handleUndefined(item.xsfNsrsbh);
        //销售方地址
        this.xsfDzdh = $Utils.handleUndefined(item.xsfDzdh);
        //销售方电话
        this.xsfdh = $Utils.handleUndefined(item.xsfdh);
        //销售方开户行
        this.xsfKhh = $Utils.handleUndefined(item.xsfKhh);
        //销售方银行账号
        this.xsfYhzh = $Utils.handleUndefined(item.xsfYhzh);
        //发票开票日期
        this.kprq = $Utils.handleUndefined(item.kprq);
        //开票类型
        this.kplx = $Utils.handleUndefined(item.kplx);
        //下载，丢弃参数
        this.param = this.fpdm +"_"+ this.fphm;
        //联系人名称
        this.sprMc = $Utils.handleUndefined(item.sprMc);
        //联系人手机号
        this.sprSjh = $Utils.handleUndefined(item.sprSjh);
        //短信发送状态
        this.smsStatus = $Utils.handleUndefined(item.smsStatus);
        //联系人邮箱
        this.sprYx = $Utils.handleUndefined(item.sprYx);
        //邮件发送状态
        this.emailStatus = $Utils.handleUndefined(item.emailStatus);
        //开票人
        this.kpr = $Utils.handleUndefined(item.kpr);
        //收款人
        this.skr = $Utils.handleUndefined(item.skr);
        //复核人
        this.fhr = $Utils.handleUndefined(item.fhr);
        //开票状态
        this.kpzt = $Utils.handleUndefined(item.kpzt);
        //发送状态
        this.fszt = $Utils.handleUndefined(item.fszt);
        //备注
        this.bz = $Utils.handleUndefined(item.bz);
        //失败原因
        var sbyy = $Utils.handleUndefined(item.sbyy);
        this.sbyy = sbyy.replace(/'/g,"");
        //商品列表
        this.proList = item.proList;
        //冲红标识
        this.chbz = item.chbz;
        //作废标识
        this.zfbz = item.zfbz;
        //操作失败原因
        this.czsbyy = item.czsbyy;
        //打印次数
        this.printCount = item.printCount;
        //税率标识
        this.slbs = item.slbs;
        //发票种类代码
        this.fpzldm = item.fpzldm;
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
        strs.push('<tr>');
        strs.push('<td>'+this.index+'</td>');
        strs.push('<td>'+this.gmfmc+'</td>');
        strs.push('<td>'+this.sprMc+'</td>');
        strs.push('<td>'+this.sprSjh+'</td>');
        strs.push('<td>'+this.sprYx+'</td>');
        strs.push('<td>'+this.fpdm+'</td>');
        strs.push('<td>'+this.fphm+'</td>');
        strs.push('<td>'+this.kprq+'</td>');
        strs.push('<td title="'+this.jshj+'">'+this.jshj+'</td>');
        strs.push('<td>'+this.kpr+'</td>');
        if(this.kpzt =='NOMAKEINVOICE' && this.kplx == "1"){
        	strs.push('<td>未开票</td>');
        }else if(this.kpzt =='NOMAKEINVOICE' && this.kplx == "2") {
        	strs.push('<td>开票中</td>');
        }else if(this.kpzt =='MAKEINVOICEING') {
        	strs.push('<td>开票中</td>');
        }else if(this.kpzt =='MAKEINVOICESUCCESS') {
        	strs.push('<td>开票成功</td>');
        }else if(this.kpzt =='MAKEINVOICEFAIL') {
        	strs.push('<td>开票失败</td>');
        }else{
        	strs.push('<td></td>');
        }
        if(this.smsStatus =='NOSEND'){
        	strs.push('<td>未发送</td>');
        }else if(this.smsStatus =='SENDSUCCESS') {
        	strs.push('<td>发送成功</td>');
        }else if(this.smsStatus =='SENDFAIL') {
        	strs.push('<td>发送失败</td>');
        }else{
        	strs.push('<td>未发送</td>');
        }
        if(this.emailStatus =='NOSEND'){
        	strs.push('<td>未发送</td>');
        }else if(this.emailStatus =='SENDSUCCESS') {
        	strs.push('<td>发送成功</td>');
        }else if(this.emailStatus =='SENDFAIL') {
        	strs.push('<td>发送失败</td>');
        }else{
        	strs.push('<td>未发送</td>');
        }
        strs.push('<td>');
        if(this.kpzt =='NOMAKEINVOICE' && this.kplx == "1"){
        	strs.push('<a href="javascript:void(0)" onclick="makeDzfpCg(\''+this.fpqqlsh+'\')">开票</a>');
        	if(this.slbs == 2){
        		
        	}else{
        		strs.push('<a href="javascript:void(0)" onclick="editDzfpCg(\''+this.fpqqlsh+'\')">编辑</a>');
        	}
        	strs.push('<a href="javascript:void(0)" onclick="deleteDzfpCg(\''+this.fpqqlsh+'\')">删除</a>');
        }else if(this.kpzt =='NOMAKEINVOICE' && this.kplx == "2"){
        	strs.push('<a href="javascript:void(0)" onclick="viewInvoice(\''+this.fpqqlsh+'\')" >查看</a>');
        }else if(this.kpzt =='MAKEINVOICEING') {
        	strs.push('<a href="javascript:void(0)" onclick="viewInvoice(\''+this.fpqqlsh+'\')" >查看</a>');
        }else if(this.kpzt =='MAKEINVOICESUCCESS') {
        	strs.push('<a href="javascript:void(0)" onclick="viewInvoice(\''+this.fpqqlsh+'\')" >查看</a>');
        	strs.push('<a href="'+basePath+'invoice/downloadBill'+suffix+'?fpqqlsh='+this.fpqqlsh+'" target="_blank">下载发票</a>');
        	if(this.kplx == 2 || this.kplx == "2"){
        		
        	}else{
        		strs.push('<a href="javascript:void(0)" onclick="continueSend(\''+this.sprMc+'\',\''+this.sprSjh+'\',\''+this.sprYx+'\',\''+this.fpqqlsh+'\')">再次发送</a>');
        	}
        }else if(this.kpzt =='MAKEINVOICEFAIL') {
        	strs.push('<a href="javascript:void(0)" onclick="viewInvoice(\''+this.fpqqlsh+'\')" >查看</a>');
        	strs.push('<a href="javascript:void(0)" onclick="deleteDzfpCg(\''+this.fpqqlsh+'\')">删除</a>');
        	if(this.kplx == 2 || this.kplx == "2"){
        		strs.push('<a href="javascript:void(0)"  onclick="viewRedFailReason(\''+this.sbyy+'\',\''+this.fpqqlsh+'\')">开票失败原因</a>');
        	}else{
        		if(this.slbs == 2){
        			strs.push('<a href="javascript:void(0)"  onclick="viewBalanceFailReason(\''+this.sbyy+'\',\''+this.fpqqlsh+'\')">开票失败原因</a>');
            	}else{
            		strs.push('<a href="javascript:void(0)"  onclick="viewFailReason(\''+this.sbyy+'\',\''+this.fpqqlsh+'\')">开票失败原因</a>');
            	}
        	}
        }
        strs.push('</td>');
        strs.push('</tr>');
        return strs.join("");
    },
    fillDetailTaxCatData:function() {
    	if(this.fpdm && this.fphm && this.kprq){
    		//发票代码
        	$("#fpDm").text(this.fpdm);
        	//发票号码
        	$("#fpHm").text(this.fphm);
        	//开票日期
        	var kprqArr = this.kprq.split(" ");
        	var kpYmd = kprqArr[0].split("-");
        	$("#kpYear").text(kpYmd[0]);
        	$("#kpMonth").text(kpYmd[1]);
        	$("#kpDay").text(kpYmd[2]);
        	//校验码
        	$("#jym").text(this.jym.substring(0,5) + " " + this.jym.substring(5,10) + " " + this.jym.substring(10,15)+ " " + this.jym.substring(15));
    	}
        $("#proRow").html("");
        $("#gmfMc").text(this.gmfmc);
        $("#gmfNsrsbh").val(this.gmfsbh);
        $("#gmfDzdh").val($Utils.handleUndefined(this.gmfDzdh));
        $("#gmfdh").val($Utils.handleUndefined(this.gmfdh));
        $("#gmfKhh").val($Utils.handleUndefined(this.gmfKhh));
        $("#gmfYhzh").val($Utils.handleUndefined(this.gmfYhzh));
        $("#hjje").val((Math.round(parseFloat(this.hjje)*100)/100).toFixed(2));
        $("#hjse").val((Math.round(parseFloat(this.hjse)*100)/100).toFixed(2));
        $("#jshj").val((Math.round(parseFloat(this.jshj)*100)/100).toFixed(2));
        $("#jshj").attr("title",(Math.round(parseFloat(this.jshj)*100)/100).toFixed(2));
        if(parseFloat(this.jshj) < parseFloat(0)){
      	   this.jshj = this.jshj.replace("-","");
      	  $("#jshjdx").val("(负数)" + $Utils.convertMoneyToChinese(this.jshj));
         }else{
         	$("#jshjdx").val($Utils.convertMoneyToChinese(this.jshj));
         } 
        $("#bz").val(this.bz);
        $("#xsfMc").val(this.xsfmc);
        $("#xsfNsrsbh").val(this.xsfsbh);
        $("#xsfDzdh").val($Utils.handleUndefined(this.xsfDzdh));
        $("#xsfdh").val($Utils.handleUndefined(this.xsfdh));
        $("#xsfKhh").val($Utils.handleUndefined(this.xsfKhh));
        $("#xsfYhzh").val($Utils.handleUndefined(this.xsfYhzh));
        $("#skr").val(this.skr);
        $("#fhr").val(this.fhr);
        $("#kpr").val(this.kpr);
        $("#sprMc").val(this.sprMc);
        $("#sprSjh").val(this.sprSjh);
        $("#sprYx").val(this.sprYx);
        var proList = this.proList;
        var strs = [];
        Array.prototype.forEach.call(proList,function(item,index,array) {
           if(item.discounted == "DISED"){
             strs.push('<tr>');
             strs.push('<td class="column-invoice-check"></td>');
             strs.push('<td class="column-invoice-goods" colspan="3">'+item.goodsServiceName+'</td>');
             strs.push('<td class="column-invoice-model">'+$Utils.handleUndefined(item.specificationModel)+'</td>');
             strs.push('<td class="column-invoice-company">'+$Utils.handleUndefined(item.meteringUnit)+'</td>');
             strs.push('<td class="column-invoice-number">'+item.quantity+'</td>');
             strs.push('<td class="column-invoice-price" colspan="2">'+item.price+'</td>');
             strs.push('<td class="column-invoice-money" colspan="2">'+item.amount.toFixed(2)+'</td>');
             strs.push('<td class="column-invoice-taxes">'+(item.taxRate)*100+'%</td>');
             strs.push('<td class="column-invoice-tax" title="'+item.taxAmount.toFixed(2)+'">'+item.taxAmount.toFixed(2)+'</td>');
             strs.push('</tr>');
             strs.push('<tr>');
             strs.push('<td class="column-invoice-check"></td>');
           	 strs.push('<td class="column-invoice-goods" colspan="3">'+item.discountName+'</td>');
           	 strs.push('<td class="column-invoice-model"></td>');
           	 strs.push('<td class="column-invoice-company"></td>');
           	 strs.push('<td class="column-invoice-number"></td>');
           	 strs.push('<td class="column-invoice-price" colspan="2"></td>');
           	 strs.push('<td class="column-invoice-money" colspan="2">'+item.discountAmount.toFixed(2)+'</td>');
           	 strs.push('<td class="column-invoice-taxes">'+(item.taxRate)*100+'%</td>');
           	 strs.push('<td class="column-invoice-tax" title="'+item.discountTaxAmount.toFixed(2)+'">'+item.discountTaxAmount.toFixed(2)+'</td>');
           	 strs.push('</tr>');
           }else{
        	   strs.push('<tr>');
               strs.push('<td class="column-invoice-check"></td>');
               strs.push('<td class="column-invoice-goods" colspan="3">'+item.goodsServiceName+'</td>');
               strs.push('<td class="column-invoice-model">'+$Utils.handleUndefined(item.specificationModel)+'</td>');
               strs.push('<td class="column-invoice-company">'+$Utils.handleUndefined(item.meteringUnit)+'</td>');
               strs.push('<td class="column-invoice-number">'+item.quantity+'</td>');
               strs.push('<td class="column-invoice-price" colspan="2">'+item.price+'</td>');
               strs.push('<td class="column-invoice-money" colspan="2">'+item.amount.toFixed(2)+'</td>');
               strs.push('<td class="column-invoice-taxes">'+(item.taxRate)*100+'%</td>');
               strs.push('<td class="column-invoice-tax" title="'+item.taxAmount.toFixed(2)+'">'+item.taxAmount.toFixed(2)+'</td>');
               strs.push('</tr>');
           }
        })
        var trHtml = strs.join("");
    	$("#proRow").html(trHtml);
     },
     fillPaperListData: function () {
         var strs = [];
         strs.push('<tr>');
         strs.push('<td>'+this.index+'</td>');
         strs.push('<td>'+this.gmfmc+'</td>');
         strs.push('<td>'+this.fpdm+'</td>');
         strs.push('<td>'+this.fphm+'</td>');
         strs.push('<td>'+this.kprq+'</td>');
         strs.push('<td>'+this.jshj+'</td>');
         strs.push('<td>'+this.kpr+'</td>');
         if(this.kpzt =='NOMAKEINVOICE' && this.kplx == "1"){
         	strs.push('<td>未开票</td>');
         }else if(this.kpzt =='NOMAKEINVOICE' && this.kplx == "2") {
         	strs.push('<td>开票中</td>');
         }else if(this.kpzt =='MAKEINVOICEING') {
         	strs.push('<td>开票中</td>');
         }else if(this.kpzt =='MAKEINVOICESUCCESS') {
         	strs.push('<td>开票成功</td>');
         }else if(this.kpzt =='MAKEINVOICEFAIL') {
         	strs.push('<td>开票失败</td>');
         }else{
         	strs.push('<td></td>');
         }
         //作废或冲红状态
         if(this.kpzt =='MAKEINVOICESUCCESS'){
        		 if(this.zfbz == "NOT_DESTROY"){
        			 if(this.chbz == "REDING"){
            			 strs.push('<td>冲红中</td>');
            		 }
            		 if(this.chbz == "ALREADY_RED"){
            			 strs.push('<td>已冲红</td>');
            		 }
            		 if(this.chbz == "RED_FAIL"){
                		strs.push('<td>冲红失败</td>');
            		 }
            		 if(this.chbz == "NOT_RED"){
            			 strs.push('<td></td>');
            		 }
            		 if(!this.chbz){
            			 strs.push('<td></td>');
            		 }
        		 }else if(this.zfbz == "DESTROYING"){
        			 strs.push('<td>作废中</td>');
        		 }else if(this.zfbz == "ALREADY_DESTROY"){
        			 strs.push('<td>已作废</td>');
        		 }else if(this.zfbz == "DESTROY_FAIL"){
        			 if(this.chbz == "REDING"){
            			 strs.push('<td>冲红中</td>');
            		 }
            		 if(this.chbz == "ALREADY_RED"){
            			 strs.push('<td>已冲红</td>');
            		 }
            		 if(this.chbz == "RED_FAIL"){
                		strs.push('<td>冲红失败</td>');
            		 }
            		 if(this.chbz == "NOT_RED"){
            			 strs.push('<td>作废失败</td>');
            		 }
        		 }else if(!this.zfbz){
        			 if(this.chbz == "REDING"){
            			 strs.push('<td>冲红中</td>');
            		 }
            		 if(this.chbz == "ALREADY_RED"){
            			 strs.push('<td>已冲红</td>');
            		 }
            		 if(this.chbz == "RED_FAIL"){
                		strs.push('<td>冲红失败</td>');
            		 }
            		 if(!this.chbz){
            			 strs.push('<td></td>'); 
            		 }
        		 }
         }else{
        	 strs.push('<td></td>'); 
         }
         //打印次数
         strs.push('<td>'+this.printCount+'</td>');
         strs.push('<td>');
         if(this.kpzt =='NOMAKEINVOICE' && this.kplx == "1"){
         	strs.push('<a href="javascript:void(0)" onclick="makePaperInvoice(\''+this.fpqqlsh+'\')">开票</a>');
         	if(this.slbs == 2){
        		
        	}else{
        		strs.push('<a href="javascript:void(0)" onclick="editPaperInvoice(\''+this.fpzldm+'\',\''+this.fpqqlsh+'\')">编辑</a>');
        	}
         	strs.push('<a href="javascript:void(0)" onclick="deletePaperInvoice(\''+this.fpqqlsh+'\')">删除</a>');
         }else if(this.kpzt =='NOMAKEINVOICE' && this.kplx == "2"){
         	strs.push('<a href="javascript:void(0)" onclick="viewPaperInvoice(\''+this.fpqqlsh+'\')" >查看</a>');
         }else if(this.kpzt =='MAKEINVOICEING') {
         	strs.push('<a href="javascript:void(0)" onclick="viewPaperInvoice(\''+this.fpqqlsh+'\')" >查看</a>');
         }else if(this.kpzt =='MAKEINVOICESUCCESS') {
         	strs.push('<a href="javascript:void(0)" onclick="viewPaperInvoice(\''+this.fpqqlsh+'\')">查看</a>');
         	//根据冲红或者作废状态判断打印按钮
         	if(this.zfbz == "DESTROYING" || this.chbz == "REDING"){
         		
         	}else if(this.zfbz == "DESTROY_FAIL" || this.chbz == "RED_FAIL"){
         		strs.push('<a href="javascript:void(0)" onclick="printPaperInvoice(\''+this.fpqqlsh+'\')">打印</a>');
         		strs.push('<a href="javascript:void(0)" onclick="viewRedFailReason(\''+this.sbyy+'\',\''+this.fpqqlsh+'\')">失败原因</a>');
         	}else{
         		strs.push('<a href="javascript:void(0)" onclick="printPaperInvoice(\''+this.fpqqlsh+'\')">打印</a>');
         	}
         }else if(this.kpzt =='MAKEINVOICEFAIL') {
         	strs.push('<a href="javascript:void(0)" onclick="viewPaperInvoice(\''+this.fpqqlsh+'\')" >查看</a>');
         	strs.push('<a href="javascript:void(0)" onclick="deletePaperInvoice(\''+this.fpqqlsh+'\')">删除</a>');
         	if(this.kplx == 2 || this.kplx == "2"){
         		strs.push('<a href="javascript:void(0)"  onclick="viewRedFailReason(\''+this.sbyy+'\',\''+this.fpqqlsh+'\')">失败原因</a>');
         	}else{
         		if(this.slbs == 2){
         			strs.push('<a href="javascript:void(0)"  onclick="viewBalanceFailReason(\''+this.sbyy+'\',\''+this.fpqqlsh+'\')">失败原因</a>');
            	}else{
            		strs.push('<a href="javascript:void(0)"  onclick="viewFailReason(\''+this.fpzldm+'\',\''+this.sbyy+'\',\''+this.fpqqlsh+'\')">失败原因</a>');
            	}
         	}
         }
         strs.push('</td>');
         strs.push('</tr>');
         return strs.join("");
     }
}

