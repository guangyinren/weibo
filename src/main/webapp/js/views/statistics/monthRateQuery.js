$(function () {
    //日期控件
	DatetimePicker.dateMonth($("#monthStart"),"","2016-08",new Date());
	DatetimePicker.dateMonth($("#monthEnd"),"","2016-08",new Date());
	
	window.invoiceSettings = {
		    initPage: function () {
		        $http.get(basePath + "manage/invoice/setting/basic" + suffix, {}, function (data) {
		            if (data.code == 200) {
		                var taxList = data.data.taxRates;
		                invoiceSettings.initTax(taxList);
		            }
		        }, false);
		    },
			initTax: function initTax(list) {
				var rateHTML = '<div class="tab-cont1">';
	            Array.prototype.forEach.call(list, function (item, index) {
	            	if (index == 1) {
		                var taxRates = item.taxRates;
		                taxRates.forEach(function (item, index) {
			                    rateHTML += '<label style="margin-right: 0%;width:25%"><b class="radio-lu1 radio-rate" data-value="' + item.taxRateValue + '" /></b><span class="m-r-100">' + item.frontName + '</span></label>';
		                })
	            	}
	            });
	            rateHTML += '</div>';
	            $("#rates").append(rateHTML);
	            
	            $Utils.makeClassMulti("radio-rate","radio-lu-sel1");
			}
	}
	
	//初始化税率选择
	invoiceSettings.initPage();

    $("#statistic_btn").on("click", function () {
    	var rateSelect = validateAndAssembleRateValue();
    	if(rateSelect){
        	var url = "/invoice_query/monthRate.pt?monthStart="+$("#monthStart").val()+"&monthEnd="+$("#monthEnd").val()+"&rateSelect="+rateSelect;
        	$('#reportIframe').attr('src', url);
//        	$http.get(basePath + "invoice_query/monthRate2" + suffix, {monthStart:$("#monthStart").val(), monthEnd:$("#monthEnd").val(), rateSelect:rateSelect}, function (data) {
//        		alert(data.data.htmlstr);
//        		$('#reportIframe').attr('srcdoc', data.data.htmlstr);
//            }, false);
        	
//        	$.ajax({
//      		  	dataType: 'JSONP',
//      		  	type: 'GET',  
//        		url: basePath + "invoice_query/monthRate2" + suffix,
//        		data: {monthStart:$("#monthStart").val(), monthEnd:$("#monthEnd").val(), rateSelect:rateSelect},
//        		jsonp: "callback",
//        		jsonpCallback:"flightHandler",
//        		success: function (data) {
//        			alert("ddd");
//            		$('#reportIframe').attr('srcdoc', data);
//                },
//                error:function(){
//                	alert('aaaaa');
//                }
//
//        	});
    	}
    });
    
    $("#export_pdf_btn").on("click", function () {
    	var rateSelect = validateAndAssembleRateValue();
    	if(rateSelect){
    		var url = "/invoice_query/monthRateExportPdf.pt?monthStart="+$("#monthStart").val()+"&monthEnd="+$("#monthEnd").val()+"&rateSelect="+rateSelect;
    		window.open(url);
    	}
    });
    
    $("#print_pdf_btn").on("click", function () {
    	var rateSelect = validateAndAssembleRateValue();
    	if(rateSelect){
    		var url = "/invoice_query/monthRatePrintPdf.pt?monthStart="+$("#monthStart").val()+"&monthEnd="+$("#monthEnd").val()+"&rateSelect="+rateSelect;
    		window.open(url);
    	}
    });
    
    function validateAndAssembleRateValue(){
    	//校验查询条件
    	var monthStart = $("#monthStart").val();
    	var monthEnd = $("#monthEnd").val();
    	if(monthStart==null||""==monthStart){
    		layer.alert("请选择开始月份",{icon:2}, function(){
        		layer.closeAll();
    		});
    		return false;
    	}
    	if(monthEnd==null||""==monthEnd){
    		layer.alert("请选择结束月份",{icon:2}, function(){
        		layer.closeAll();
    		});
    		return false;
    	}
    	
    	//组装查询条件
    	var rateStr = [];
    	var rateEles = $(".radio-rate.radio-lu-sel1");
    	if(rateEles.length == 0){
    		layer.alert("请选择税率",{icon:2}, function(){
        		layer.closeAll();
    		});
    		return false;
    	}
        for (var i = 0; i < rateEles.length; i++) {
            var rate = $(rateEles[i]).data("value");
            rateStr.push(rate);
        }
        return rateStr.join(",");
    }
})