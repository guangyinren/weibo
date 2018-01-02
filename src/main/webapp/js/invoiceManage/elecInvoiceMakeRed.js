//var fpDmFpHm;
var fpqqlsh;
var redReason;
var type;
$(function(){
//	fpDmFpHm = $Utils.getUrlParameters().fpDmFpHm;
	fpqqlsh = $Utils.getUrlParameters().fpqqlsh;
    redReason = $Utils.getUrlParameters().redReason;
    redReason = decodeURI(redReason);
    type = $Utils.getUrlParameters().type;
    $.ajax({
		type:"GET",
		url:basePath+"invoice/viewRedEleInvoice/"+fpqqlsh+suffix,
		dataType:"json",
		success:function(data){
			if (data.code == 200 || data.code == "200") {
				$("#my_invoice_zone").empty();
	            var item = data.data.item;
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
    /*$http.get(basePath+"invoice/viewHdzfpCg/"+fpDmFpHm+suffix,{},function(data){
        if (data.code == 200 || data.code == "200") {
            $("#my_invoice_zone").empty();
            var item = data.data.item;
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
    })*/
})

//开具红票
function saveHdzfp(){
	$("#redInvoiceBtn").attr("disabled","disabled");
	var index = layer.load(2, {shade: [0.5,'#000']}); //0.5透明度的白色背景
	var actionUrl = basePath+"invoice/makeRedEleInvoice"+suffix;
	$.ajax({
		url:actionUrl,
		data:{
			redReason : redReason,
			fpqqlsh : fpqqlsh
		},
		type:"post",
		success:function(data){
			layer.close(index);
			if (data.code == 200 || data.code == "200") {
				layer.alert(data.msg,{icon:1,closeBtn: 0}, function(){
	        		layer.closeAll();
	        		history.go(-3);
//	        		window.location.href = basePath+"pages/manage/invoiceManage/elecInvoiceManage.shtml";
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