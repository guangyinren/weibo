$(function () {
	
   var role = $("#role_",window.top.document).val();
   if(role=="ADMIN"){
	   $("#kcyjDiv").css("display","block");
   }
   
   $("#kcyjSet").on("click", setStroe);
   $("#kcyjSubmit").on("click", kcyjSubmit);
   queyr(1);
   $.ajax({
		url:basePath+"manage/invoice/setting/getRepertorySet"+suffix,
		data:{},
		type:"get",
		success:function(data){
			$("#eleInvoice").val(data.data.eleInvoiceCautionValue);
			$("#paperInvoice").val(data.data.paperInvoiceCautionValue);
			$("#specialInvoice").val(data.data.specialInvoiceCautionValue);
		}
	})
   
});

function setStroe() {
	var invoiceTypeEnterprise = $("#invoiceTypeEnterprise",window.top.document).val();
	var invoiceType = JSON.parse(invoiceTypeEnterprise);
	var canEleInvoice = invoiceType.eleInvoice;
	var canSpecialInvoice = invoiceType.specialInvoice;
	var canPaperInvoice = invoiceType.paperInvoice;
	if(canPaperInvoice){
		$("#zzfpyjz").css("display","block");
	}
	if(canSpecialInvoice){
		$("#zzzpyjz").css("display","block");
	}
	$('#setModal').modal('show')
}
function kcyjSubmit() {
	var eleInvoice = $("#eleInvoice").val().trim()
	if(eleInvoice==""){
		eleInvoice = 5;
	}
	var paperInvoice = $("#paperInvoice").val().trim()
	if(paperInvoice==""){
		paperInvoice = 5;
	}
	var specialInvoice = $("#specialInvoice").val().trim()
	if(specialInvoice ==""){
		specialInvoice = 5;
	}
	$http.post(basePath + "manage/invoice/setting/repertorySet" + suffix, 
	{
		eleInvoiceCautionValue:eleInvoice,
		paperInvoiceCautionValue:paperInvoice,
		specialInvoiceCautionValue:specialInvoice,
	}, function (data) {
		var code = data.code;
		if(code=="200"){
			layer.alert('<div class="text-center">库存预警设置成功</div>')
			$('#setModal').modal('hide')
		}
	});
}

function queyr(currentPage){
	var pageSize = 10;
	   $http.get(basePath + "invoice_query/repertoryQuery" + suffix,{
			pageIndex : currentPage,
			pageSize : pageSize,
		},function (data) {
	            if ("200" == data.code) {
	                var rows = data.data;
	                if ("200" == data.code) {
	                    var rows = data.data.rows;
	                    var total = data.data.total;
	                    if (rows.length > 0) {
	                        //$("#menu_tr").css("display","block");
	                        $("#invoice_query").empty();
	                        Array.prototype.forEach.call(rows, function (item, index, array) {
	                            var number = pageSize * (currentPage - 1) + index + 1;
	                            var invoice = new RepertoryInfo(item, number,currentPage);
	                            var str = invoice.fillListData();
	                            $("#invoice_query").append(str);
	                        })
	                        var pageCount = Math.floor((total - 1) / pageSize) + 1;
	                        PageWrapper.page($("#page1"), total, currentPage, queyr);

	                    } else {
	                        $("#invoice_query").empty();
	                        $("#invoice_query").html("<td colspan='8' style='text-align: center;'>暂无数据</td>");
	                        $("#page1").empty();
	                    }
	                }  	
	            }
	        });
}

  
Date.prototype.format = function(format) {  
   /* 
    * eg:format="yyyy-MM-dd hh:mm:ss"; 
    */  
   var o = {  
       "M+" : this.getMonth() + 1, // month  
       "d+" : this.getDate(), // day  
       "h+" : this.getHours(), // hour  
       "m+" : this.getMinutes(), // minute  
       "s+" : this.getSeconds(), // second  
       "q+" : Math.floor((this.getMonth() + 3) / 3), // quarter  
       "S" : this.getMilliseconds()  
       // millisecond  
   }  
 
   if (/(y+)/.test(format)) {  
       format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4  
                       - RegExp.$1.length));  
   }  
 
   for (var k in o) {  
       if (new RegExp("(" + k + ")").test(format)) {  
           format = format.replace(RegExp.$1, RegExp.$1.length == 1  
                           ? o[k]  
                           : ("00" + o[k]).substr(("" + o[k]).length));  
       }  
   }  
   return format;  
}  