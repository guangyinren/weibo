//发票代码
var fpDm;
//发票号码
var fpHm;
//价税合计金额
var jshj;
//发票请求流水号
var fpqqlsh;
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
				var item = data.data.item;
	            if(item.kpzt == "MAKEINVOICESUCCESS"){
	            	$("#successDiv").show();
	            	if(item.kplx == "1"){
		            	fpDm = item.fpDm;
		            	fpHm = item.fpHm;
		            	jshj = item.jshj;
		            	if(item.chbz == "NOT_RED" || item.chbz == "RED_FAIL"){
		            		$("#applyRedInvoiceBtn").show();
		            	}else if(item.chbz == "ALREADY_RED"){
		            		$("#invoiceRed").show();
		            	}
	            	}
	            	$('#loadingImg').hide()
	            	$("#imgId").attr("src",basePath+"invoiceQuery/getPdfImgStr/"+fpqqlsh+suffix);
	            	/*$("#ewmImg").attr("src","data:image/png;base64," + item.ewm);
	            	$("#downloadInvoice").attr("href",basePath+'invoice/downloadBill'+suffix+'?fpDmFpHm='+fpDm+'_'+fpHm);*/
	            }else{
	            	$("#issueDiv").show();
	            	$("#my_invoice_zone").empty();
		            var invoice = new Invoice(item);
		            invoice.fillDetailTaxCatData();
	            	$("#ewmImg").css('display','none');
	            }
	        }else if(data.code == 403){
	        	layer.msg('未查询到数据',{icon:2,time:2000}, function(){
					 //do something
				});
	        }
		}
	})
})

//跳转到申请冲红页面
function redirectToRedInv(){
	window.location.href = basePath + "pages/manage/invoiceManage/elecInvoiceApplyRed.shtml?fpDm="+fpDm+"&fpHm="+fpHm+"&fpqqlsh="+fpqqlsh+"&jshj="+jshj+"&type=manage";
}

//返回上一页
function redirectToBack(){
	window.location.href = basePath + "pages/manage/invoiceManage/elecInvoiceManage.shtml?currentIndex="+currentIndex;
}
