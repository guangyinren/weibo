//发票代码
var fpDm;
//发票号码
var fpHm;
//当前页数
var currentIndex;
$(function(){
	currentIndex = $Utils.getUrlParameters().currentIndex;
    var fpqqlsh = $Utils.getUrlParameters().fpqqlsh;
    $.ajax({
		type:"GET",
		url:basePath+"invoice/queryDzfpCgByFpqqlsh/"+fpqqlsh+suffix,
		dataType:"json",
		success:function(data){
			if (data.code == 200) {
	            $("#my_invoice_zone").empty();
	            var item = data.data.item;
	            var invoice = new Invoice(item);
	            invoice.fillDetailTaxCatData();
	            if(item.kpzt == "MAKEINVOICESUCCESS"){
	            	$("#issueDiv").hide();
	            	$("#successDiv").show();
	            	if(item.kplx == "1"){
		            	fpDm = item.fpDm;
		            	fpHm = item.fpHm;
		            	jshj = item.jshj;
	            	}
	            	$("#imgId").attr("src",basePath+"invoiceQuery/getPdfImgStr/"+fpqqlsh+suffix);
	            }else{
	            	$("#my_invoice_zone").empty();
		            var invoice = new Invoice(item);
		            invoice.fillDetailTaxCatData();
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

//跳转到申请冲红页面
function redirectToRedInv(){
	window.location.href = basePath + "pages/manage/invoiceManage/elecInvoiceApplyRed.shtml?fpDm="+fpDm+"&fpHm="+fpHm+"&type=manage";
}

//返回上一页
function redirectToBack(){
	window.location.href = basePath + "pages/manage/invoiceManage/elecInvoiceManage.shtml?currentIndex="+currentIndex;
}
