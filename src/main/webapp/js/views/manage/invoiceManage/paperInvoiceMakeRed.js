var fpqqlsh;
var applyRedReason;
$(function(){
	fpqqlsh = $Utils.getUrlParameters().fpqqlsh;
	applyRedReason = $Utils.getUrlParameters().applyRedReason;
	applyRedReason = decodeURI(applyRedReason);
	$.ajax({
		type:"GET",
		url:basePath+"paperInvoice/viewRedPaperInvoice/"+fpqqlsh+suffix,
		dataType:"json",
		success:function(data){
			if (data.code == 200 || data.code == "200") {
	            $("#my_invoice_zone").empty();
	            var item = data.data.item;
	            if(item.fpzldm == "01"){
	            	$(".invoice-tab").html("增值税专用发票（纸质）");
	            	$(".invoice-h3").html("增值税专用发票（纸质）");
	            }else{
	            	$(".invoice-tab").html("增值税普通发票（纸质）");
	            	$(".invoice-h3").html("增值税普通发票（纸质）");
	            }
	            var invoice = new Invoice(item);
	            invoice.fillDetailTaxCatData();
	            $("#bz").val("对应正数发票代码:" + item.fpDm + "号码:" + item.fpHm);
	        }else if(data.code == 403 || data.code == "403"){
	        	layer.alert('未查询到数据',{icon:2,closeBtn: 0},function(){
	        		layer.closeAll();
				});
	        }else if(data.code == 404 || data.code == "404"){
	        	layer.alert('此张发票已经申请冲红,请到发票管理中查看详情',{icon:2,closeBtn: 0}, function(){
	        		layer.closeAll();
				});
	        }
		}
	})
})

//开具红票
function saveHdzfp(){
	$("#redInvoiceBtn").attr("disabled","disabled");
	var index = layer.load(2, {shade: [0.5,'#000']}); //0.5透明度的白色背景
	var actionUrl = basePath+"paperInvoice/makeRedPaperInvoice"+suffix;
	$.ajax({
		url:actionUrl,
		data:{
			applyRedReason:applyRedReason,
			fpqqlsh:fpqqlsh
		},
		type:"post",
		success:function(data){
			layer.close(index);
			if (data.code == 200 || data.code == "200") {
				layer.alert(data.msg,{icon:1,closeBtn: 0}, function(){
	        		layer.closeAll();
	        		history.go(-3);
//	        		window.location.href = basePath+"pages/manage/invoiceManage/paperInvoiceManage.shtml";
				});
	        }else if(data.code == 403){
	        	layer.alert(data.msg,{icon:2,closeBtn: 0}, function(){
	        		layer.closeAll();
				});
	        }
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			layer.close(index);
			layer.alert('系统繁忙,请稍候再试',{icon:2,closeBtn: 0}, function(){
        		layer.closeAll();
			});  
	    }
	})
}