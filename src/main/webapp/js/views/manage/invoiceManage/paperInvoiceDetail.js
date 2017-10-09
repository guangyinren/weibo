//发票代码
var fpDm;
//发票号码
var fpHm;
//发票请求流水号
var fpqqlsh;
//价税合计金额
var jshj;
//当前页数
var currentIndex;
$(function(){
	currentIndex = $Utils.getUrlParameters().currentIndex;
    fpqqlsh = $Utils.getUrlParameters().fpqqlsh;
    $.ajax({
		type:"GET",
		url:basePath+"invoice/queryDzfpCgByFpqqlsh/"+fpqqlsh+suffix,
		dataType:"json",
		success:function(data){
			if (data.code == 200) {
	            $("#my_invoice_zone").empty();
	            var item = data.data.item;
	            if("01" == item.fpzldm){
	            	$("#spanTitleEle").text("增值税专用发票（纸质）");
	            	$("#h3TitleEle").text("增值税专用发票（纸质）");
	            }else{
	            	$("#jymDiv").show();
	            }
	            var invoice = new Invoice(item);
	            invoice.fillDetailTaxCatData();
	            //TODO 作废，冲红按钮控制
	            if(item.kpzt == "MAKEINVOICESUCCESS" && item.kplx == "1"){
	            	fpDm = item.fpDm;
	            	fpHm = item.fpHm;
	            	jshj = item.jshj;
	            	$("#ewmImg").attr("src","data:image/png;base64," + item.ewm);
	            	if(compareMonth(item.kprq)){
	            		if("01" == item.fpzldm){
	            			$("#cancelInvoiceBtn").show();
	            		}else{
	            			$("#cancelInvoiceBtn").show();
		            		$("#applyRedInvoiceBtn").show();
	            		}
	            	}else{
	            		$("#applyRedInvoiceBtn").show();
	            	}
	            	/*$("#cancelInvoiceBtn").show();
	            	$("#applyRedInvoiceBtn").show();*/
	            }else if(item.kpzt == "MAKEINVOICESUCCESS" && item.kplx == "2" ){
	            	fpDm = item.fpDm;
	            	fpHm = item.fpHm;
	            	jshj = item.jshj;
	            	$("#ewmImg").attr("src","data:image/png;base64," + item.ewm);
	            	if(compareMonth(item.kprq)){
	            		$("#cancelInvoiceBtn").show();
	            	}
	            }else{
	            	$("#ewmImg").css('display','none'); 
	            	$(".kp-infor").hide();
	            }
	        }else if(data.code == 403){
	        	layer.msg('未查询到数据',{icon:2,time:2000}, function(){
					 //do something
				});
	        }
		}
	})
})

//跳转到作废页面
function cancelInvoice(){
	window.location.href = basePath + "pages/manage/invoiceManage/paperInvoiceCancel.shtml?fpDm="+fpDm+"&fpHm="+fpHm+"&fpqqlsh="+fpqqlsh+"&jshj="+jshj;
}

//跳转到申请冲红页面
function redirectToRedInv(){
	window.location.href = basePath + "pages/manage/invoiceManage/paperInvoiceApplyRed.shtml?fpDm="+fpDm+"&fpHm="+fpHm+"&fpqqlsh="+fpqqlsh+"&jshj="+jshj;
}

//返回上一页
function redirectToBack(){
	window.location.href = basePath + "pages/manage/invoiceManage/invoiceManage.shtml?currentIndex="+currentIndex;
}

//比较日期是否与当前日期为同年同月
function compareMonth(dateStr){
	var nowDate = new Date();
    var targetDate = new Date(dateStr.replace(/-/g,"/"));
    if(nowDate.getMonth() == targetDate.getMonth() && 
    		nowDate.getFullYear() == targetDate.getFullYear()){
    	return true;
    }else{
    	return false;
    }
}
