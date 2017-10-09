//发票代码
var fpDm;
//发票号码
var fpHm;
//价税合计金额
var jshj;
var type;
//发票请求流水号
var fpqqlsh;
$(function() {
	fpDm = $Utils.getUrlParameters().fpDm;
	fpHm = $Utils.getUrlParameters().fpHm;
	jshj = $Utils.getUrlParameters().jshj;
	fpqqlsh = $Utils.getUrlParameters().fpqqlsh;
	$("#yfpdm").text(fpDm);
	$("#yfphm").text(fpHm);
	$("#jshj").text(parseFloat(jshj).toFixed(2));
	type = $Utils.getUrlParameters().type;
	$.validator.setDefaults({
        success: "valid"
	});
	var validator = $("#redInvoiceForm").validate({
	    onfocusout : function(element) {
	      $(element).valid();
	    },
	    onfocusin : function(element) {
	      if (this.settings.focusCleanup) {
//	        $("#" + $(element).attr("id") + "_tip").text("");
	      }
	    },
	    focusCleanup : true,
	    onkeyup : false,
	    highlight : function(element, errorClass) {
	      $(element).fadeOut(function() {
	        $(element).fadeIn();
	      });
	    },
	    errorPlacement : function(error, element) {
	      if(error.text() != "" && error.text() != null){
	    	layer.tips(error.text(),"#" + element.attr("id"),{tips:[1,'red']});
	      }
//	      $("#" + element.attr("id") + "_tip").text(error.text());
	    },
	    rules : {
	      redReason : {
	        required:true,
	        goodsNameVali:true
	      }
	    },
	    messages : {
	      redReason : {
	        required:"冲红原因不能为空",
	        goodsNameVali:"请输入100个字母、数字、特殊字符或者50个中文"
	      }
	    }
	  });
});

//申请开红票,下一步按钮
function next(){
	if($("#redInvoiceForm").valid()){
//		var index = $("#yfpdm").text() + "_" + $("#yfphm").text();
		var redReason = $("#redReason").val();
		window.location.href = basePath + "pages/manage/invoiceManage/elecInvoiceMakeRed.shtml?fpqqlsh="+fpqqlsh+"&redReason="+encodeURI(redReason);
	    /*$http.get(basePath+"invoice/queryDzfpCgByFpDmFpHm/"+index+suffix,{},function(data){
	        if (data.code == 200 || data.code == "200") {
        		if(type == "manage"){
        			window.location.href = basePath + "pages/manage/invoiceManage/elecInvoiceMakeRed.shtml?fpDmFpHm="+index+"&redReason="+encodeURI(redReason)+"&type=manage";
				}else{
					window.location.href = basePath + "pages/manage/invoiceManage/elecInvoiceMakeRed.shtml?fpDmFpHm="+index+"&redReason="+encodeURI(redReason);
				}
	        }else if(data.code == 403 || data.code == "403"){
	        	layer.alert('未查询到数据',{icon:2}, function(){
	        		layer.closeAll();
				});
	        }else if(data.code == 404 || data.code == "404"){
	        	layer.alert('此张发票已经申请冲红,请到发票管理中查看详情',{icon:2}, function(){
	        		layer.closeAll();
				});
	        }
	    })*/
	}
}
