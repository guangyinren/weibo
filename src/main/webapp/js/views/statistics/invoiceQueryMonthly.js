$(function () {
	var invoiceTypeEnterprise = $("#invoiceTypeEnterprise",window.top.document).val();
	var invoiceTypeCheck = $("#invoiceTypeCheck",window.top.document).val();
	var invoiceType = JSON.parse(invoiceTypeEnterprise);
	var canEleInvoice = invoiceType.eleInvoice;
	var canSpecialInvoice = invoiceType.specialInvoice;
	var canPaperInvoice = invoiceType.paperInvoice;
	
	if(invoiceTypeCheck=="ELE_PAPER_SPECIAL"){
		if(canPaperInvoice){
			$("#fapzldmli").css("display","block");
			$("#fpzldm").css("display","block");
			$("#select1").css("display","block");
			$("#select0").css("display","block");
		}
		if(canSpecialInvoice){
			$("#fapzldmli").css("display","block");
			$("#fpzldm").css("display","block");
			$("#select2").css("display","block");
			$("#select0").css("display","block");
		}
		if(!canSpecialInvoice&&!canPaperInvoice){
			$("#fpzldm").val("10");
		}
	}else if(invoiceTypeCheck=="ELE_PAPER"){
		if(canPaperInvoice){
			$("#fapzldmli").css("display","block");
			$("#fpzldm").css("display","block");
			$("#select1").css("display","block");
		}else{
			$("#fpzldm").val("10");
		}
		
	}else if(invoiceTypeCheck=="ELE_SPECIAL"){
		if(canSpecialInvoice){
			$("#fapzldmli").css("display","block");
			$("#fpzldm").css("display","block");
			$("#select2").css("display","block");
		}else{
			$("#fpzldm").val("10");
		}
	}
    //日期控件
	DatetimePicker.startDateLessEndDateMonth($("#startKprq"),"","2016-08",new Date(),$("#endKprq"));
	DatetimePicker.endDateMoreStartDateMonth($("#endKprq"),"","2016-08",new Date(),$("#startKprq"));
	/*DatetimePicker.dateMonth($("#startKprq"),"","2016-08",new Date());
	DatetimePicker.dateMonth($("#endKprq"),"","2016-08",new Date());*/
});
//每页展示条数
var pageSize = 10;
var cusArr = [];
	
function queryByIndex(currentPage){

	var startKprq = $("#startKprq").val();
	var endKprq = $("#endKprq").val();
	if(startKprq==null||""==startKprq){
		layer.alert("请选择开始时间",{icon:2,closeBtn: 0}, function(){
    		layer.closeAll();
		});
		return;
	}
	if(endKprq==null||""==endKprq){
		layer.alert("请选择结束时间",{icon:2,closeBtn: 0}, function(){
    		layer.closeAll();
		});
		return;
	}
	
	startKprq = startKprq+"-01";
	endKprq = endKprq+"-01";
	var fpzldm = $("#fpzldm").val();
	$http.get(basePath+"invoice_query/monthly"+suffix,
			{
				pageIndex : currentPage,
				pageSize : pageSize,
				begin : startKprq,
				end : endKprq,
				fpzldm:fpzldm
			},
			function(data) {
				if("200"==data.code){
				var rows = data.data.rows;
				var total = data.data.total;
				if( rows.length > 0){
					$("#invoice_query_Monthly").empty();
					Array.prototype.forEach.call(rows,function(item,index,array) {
						var number = pageSize*(currentPage-1)+index+1;
		                var invoice = new Invoice(item,number);
		                var str = invoice.fillListData();
		                $("#invoice_query_Monthly").append(str);
		            })
					var pageCount = Math.floor((total-1)/pageSize)+1;

					PageWrapper.page($("#page3"), total, currentPage, queryByIndex);
				}else {
					$("#invoice_query_Monthly").empty();
					$("#invoice_query_Monthly").html("<td colspan='6' style='text-align: center;'>暂无数据</td>");
					$("#page3").empty();
				}
			}
			
    });		  
	
}

function viewInvoice(index){
	window.location.href = basePath+"invoice_query/common"+suffix+index;
}

//模态框
function tanchu(fpDm){
	$(".popup_bg").show();
	$("#dropvoice").show();
	$("#fpDm").val(fpDm);
}
//取消
function quxiao(){
	$(".popup_bg").hide();
	$("#dropvoice").hide();
}
//弹出框
function alertMsg(msgStr){
	$(".popup_bg").show();
	$("#alertmsg").show();
	$("#msg").text(msgStr);
}
//弹出框取消
function alertQuxiao() {
	$(".popup_bg").hide();
	$("#alertmsg").hide();
}

//查看
function see_but(id) {
	$.ajax({
		type: "GET",
		url: basePath+"invoice_query/fp_info"+suffix,
		data: {
			id:id
		},
		dataType: "json",
		success: function(datas){
			if("200"==datas.code){
				
			}
		}
	});
}

function getLastMonthDay( year, month){    
    var day = new Date(year,month,0);   
    var lastdate = year + '-' + month + '-' + day.getDate();//获取当月最后一天日期    
    //给文本控件赋值。同下  
    return lastdate;  
 }  
