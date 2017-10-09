$(function () {
   $("#query").on("click", query);
   $("#binding").on("click", enterpriseBinding);
   $("#rePush").on("click", rePush);
   $("#updateReview").on("click", updateReview);
   $("#updateAisino").on("click", updateAisino);
//   $("#enterpriseForbid").on("click", enterpriseUsingOrForbid(true));
//   $("#enterpriseUsing").on("click", enterpriseUsingOrForbid(false));
//   $("#paperInvoiceForbid").on("click", enterpriseInvoiceType("paperInvoice：false"));
//   $("#paperInvoiceUsing").on("click", enterpriseInvoiceType("paperInvoice：true"));
//   $("#specialInvoiceForbid").on("click", enterpriseInvoiceType("specialInvoice：false"));
//   $("#specialInvoiceUsing").on("click", enterpriseInvoiceType("specialInvoice：true"));
});

function query() {
	var taxpayerNum = $("#taxpayerNum").val();
	if(taxpayerNum==""){
		alert("输入税号");
		return;
	}
	$http.post(basePath+"user/getinfo"+suffix,{
		taxpayerNum:$("#taxpayerNum").val()
	},function(data) {
		 if("200"==data.code){
				var item = data.data.item.enterpriseRegInfo;
				var setting = data.data.item.enterpriseInvoiceSettings;
				var user = data.data.user;
				$("#taxpayerNum").val(item.taxpayerNum);
				var isDeleted = item.isDeleted;
				if(isDeleted){
					$("#enterpriseUsing").css("display","block");
					$("#enterpriseForbid").css("display","none");
				}else{
					$("#enterpriseForbid").css("display","block");
					$("#enterpriseUsing").css("display","none");
				}
				
				var invoiceTypeEnterprise = item.invoiceType;
				var invoiceType = JSON.parse(invoiceTypeEnterprise);
				var canEleInvoice = invoiceType.eleInvoice;
				var canSpecialInvoice = invoiceType.specialInvoice;
				var canPaperInvoice = invoiceType.paperInvoice;
				if(canPaperInvoice){
					$("#paperInvoiceForbid").css("display","block");
					$("#paperInvoiceUsing").css("display","none");
				}else{
					$("#paperInvoiceForbid").css("display","none");
					$("#paperInvoiceUsing").css("display","block");
				}
				if(canSpecialInvoice){
					$("#specialInvoiceForbid").css("display","block");
					$("#specialInvoiceUsing").css("display","none");
				}else{
					$("#specialInvoiceUsing").css("display","block");
					$("#specialInvoiceForbid").css("display","none");
				}
				$("#diva").css("display","block");
			}
   });		  
}
function enterpriseUsingOrForbid(usingOrForbid) {
	$http.post(basePath+"user/enterpriseUsingOrForbid"+suffix,{
		taxpayerNum:$("#taxpayerNum").val(),
		usingOrForbid:usingOrForbid
	},function(data) { 
		alert("成功");
		query();
	});	
}
function enterpriseInvoiceType(invoiceType) {
	$http.post(basePath+"user/enterpriseInvoiceType"+suffix,{
		taxpayerNum:$("#taxpayerNum").val(),
		invoiceType:invoiceType
	},function(data) { 
		alert("成功");
		query();
	});	
}
function enterpriseBinding() {
	$http.post(basePath+"user/enterpriseBinding"+suffix,{
		taxpayerNum:$("#taxpayerNum").val(),
		platformAlias:$("#platformAlias").val()
	},function(data) {
		alert("成功");
		query();
	});	
}
function rePush() {
	$http.post(basePath+"user/rePush"+suffix,{
		fpqqlsh:$("#fpqqlsh").val()
	},function(data) { 
		var code = data.data.code;
		var msg = data.data.msg;
		alert(msg);
	});	
}
function updateReview() {
	var reviewStatus = $("#reviewSelect").val();
	$http.post(basePath+"user/updateReview"+suffix,{
		taxpayerNum:$("#taxpayerNum").val(),
		reviewStatus:reviewStatus
	},function(data) { 
		alert("成功");
	});	
}
function updateAisino() {
	var updateAisino = $("#updateSelect").val();
	$http.post(basePath+"user/updateAisino"+suffix,{
		taxpayerNum:$("#taxpayerNum").val(),
		updateApplyStatus:updateAisino
	},function(data) { 
		alert("成功");
	});	
}