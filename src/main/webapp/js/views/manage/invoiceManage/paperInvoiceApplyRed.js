//发票代码
var fpDm;
//发票号码
var fpHm;
//发票请求流水号
var fpqqlsh;
//价税合计金额
var jshj;
$(function() {
	fpDm = $Utils.getUrlParameters().fpDm;
	fpHm = $Utils.getUrlParameters().fpHm;
	fpqqlsh = $Utils.getUrlParameters().fpqqlsh;
	jshj = $Utils.getUrlParameters().jshj;
	$("#fpdm").text(fpDm);
	$("#fphm").text(fpHm);
	$("#jshj").text(parseFloat(jshj).toFixed(2));
	$.validator.setDefaults({
        success: "valid"
	});
	var validator = $("#applyRedInvoiceForm").validate({
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
	    rules:{
	    	applyRedReason:{
	    		required:true,
	    		goodsNameVali:true
	      }
	    },
	    messages : {
	    	applyRedReason:{
	    		required:"冲红原因不能为空",
	    		goodsNameVali:"请输入100个字母、数字、特殊字符或者50个中文"
	      }
	    }
	  });
});

//冲红发票,下一步按钮
function confirmApplyRed(){
	if($("#applyRedInvoiceForm").valid()){
		var applyRedReason = $("#applyRedReason").val();
		window.location.href = basePath + "pages/manage/invoiceManage/paperInvoiceMakeRed.shtml?fpqqlsh="+fpqqlsh+"&applyRedReason="+encodeURI(applyRedReason);
		/*$.ajax({
			type:"GET",
			url:basePath+"paperInvoice/cancelInvoice/"+suffix,
			data:{
				applyRedReason:applyRedReason,
				fpqqlsh:fpqqlsh
			},
			dataType:"json",
			success:function(data){
			}
		})*/
	}
}
