//查询用户信息并显示到页面上
$(function() {
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
	DatetimePicker.startDateLessEndDate($("#startKprq"),"","2016-08-01",new Date(),$("#endKprq"));
	DatetimePicker.endDateMoreStartDate($("#endKprq"),"","2016-08-01",new Date(),$("#startKprq"));
	/*$("#startKprq").val(getPreviousTime());
	$("#endKprq").val(getNowTime());*/
	//
	$http.get(basePath+"invoice_query/clerkers"+suffix,"",function(data) {
			var rows = data.data;
			var c = rows.item.length;
			for (var i = 0; i < c; i++) {
				var name = rows.item[i].clerkName;
				var id = rows.item[i].billingClerkId;
				var selNode = $("#select_kpr");
				selNode.append("<option value='"+id+"'>"+name+"</option>");
			}
    });
	
});
//每页展示条数
var pageSize = 10;
var cusArr = [];
function queryByIndex(currentPage){

	var kprId = $("#select_kpr").val();
	var startKprq = $("#startKprq").val();
	var endKprq = $("#endKprq").val();
	if(!startKprq == ""){
		startKprq = startKprq+" 00:00:00";
	}
	if(!endKprq == ""){
		endKprq = endKprq+" 23:59:59";
	}
	var fpzldm = $("#fpzldm").val();
	$http.get(basePath+"invoice_query/clerk"+suffix,
			{
				pageIndex : currentPage,
				pageSize : pageSize,
				kprId : kprId,
				beginTime : startKprq,
				endTime : endKprq,
				fpzldm:fpzldm
			},
			function(data) {
				if("200"==data.code){
					var rows = data.data.rows;
					var total = data.data.total;
					if( rows.length > 0){
						$("#invoice_query_clerk").empty();
						Array.prototype.forEach.call(rows,function(item,index,array) {
							var number = pageSize*(currentPage-1)+index+1;
			                var invoice = new Invoice(item,number);
			                var str = invoice.fillListData();
			                $("#invoice_query_clerk").append(str);
			            })
			            var pageCount = Math.floor((total-1)/pageSize)+1;
						/*laypage({
							cont: $('#page2'), //容器。值支持id名、原生dom对象，jquery对象,
							pages: pageCount, //总页数
							curr: currentPage, //当前页
							skip: true, //是否开启跳页
							skin: '#179d60',
							groups: 3, //连续显示分页数
							jump: function(obj, first){ //触发分页后的回调
				                if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
				                	queryByIndex(obj.curr);
				                }
				            }
			            });*/
						PageWrapper.page($("#page2"), total, currentPage, queryByIndex);
					}else {
						$("#invoice_query_clerk").empty();
						$("#invoice_query_clerk").html("<td colspan='7' style='text-align: center;'>暂无数据</td>");
						$("#page2").empty();
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

function getNowTime(){
	var datetime = new Date();
	var year = datetime.getFullYear();
	var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
	var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
	return year + "-" + month + "-" + date;
}
function getPreviousTime(){
	var datetime = new Date();
	var year = datetime.getFullYear();
	var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth()) : datetime.getMonth();
	var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
	if("00"==month){
    	month="01";
    	date="01";
    }
	return year + "-" + month + "-" + date;
}
