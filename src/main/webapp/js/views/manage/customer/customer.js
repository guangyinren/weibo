$(function(){
	queryByIndex(1);
	 $('#query').on('click',function(){
		    queryByIndex(1);
		  });
		//同客户名称操作按钮 
	$("#getCustomerName").on('click',function(){
		var customerName = $("#customerName").val();
		$("#contactName").val(customerName);
	});	
});

//每页展示条数
var pageSize = 10;
var cusArr = [];
//底部分页控件展示页数
var showpageTotal = 6;
var inputPage=1;
//翻页后前进页数
var plusPage = 2;

//根据页数查询
function queryByIndex(currentPage){
	$http.get(basePath+"/manage/customer/queryCustomerMessage"+suffix,
			{
				pageIndex : currentPage,
				pageSize : pageSize,
				customerName:$.trim($("#querycustomerName").val()), 
				customerTaxNum:$.trim($("#querycustomerTaxNum").val()),
				customerCode:$.trim($("#querycustomerCode").val()),
				contactName:$.trim($("#querycontactName").val()),
				enterprisePhone:$.trim($("#queryenterprisePhone").val()),
				contactEmail:$.trim($("#querycontactEmail").val()),
			    address:$.trim($("#queryaddress").val()),
				contactPhone:$.trim($("#querycontactPhone").val()),
				bankAccount:$.trim($("#querybankAccount").val()),
				accountNum:$.trim($("#queryaccountNum").val())
			},function(data) {
		if("200"==data.code){
			var rows = data.data.rows;
			var total = data.data.total;
			var pageCount = Math.floor((total-1)/pageSize)+1;
			if( rows.length > 0){
				$("#invoice").empty();
				var invoice =$("#invoice");
				Array.prototype.forEach.call(rows,function(item,index,array) {
					var strs=[];
					var number = pageSize*(currentPage-1)+index+1;
					strs.push('<td>'+number+'</td>');
					strs.push('<td title="'+judgeNull(item.customerName)+'">'+judgeNull(item.customerName)+'</td>');
					strs.push('<td>'+judgeNull(item.customerCode)+'</td>');
					strs.push('<td>'+judgeNull(item.customerTaxNum)+'</td>');
					strs.push('<td>'+judgeNull(item.enterprisePhone)+'</td>');
					strs.push('<td title="'+judgeNull(item.contactName)+'">'+judgeNull(item.contactName)+'</td>');
					strs.push('<td title="'+judgeNull(item.contactEmail)+'">'+judgeNull(item.contactEmail)+'</td>');
					strs.push('<td>'+judgeNull(item.contactPhone)+'</td>');
					strs.push('<td title="'+judgeNull(item.address)+'">'+judgeNull(item.address)+'</td>');
					strs.push('<td title="'+judgeNull(item.bankAccount)+'">'+judgeNull(item.bankAccount)+'</td>');
					strs.push('<td title="'+judgeNull(item.accountNum)+'">'+judgeNull(item.accountNum)+'</td>');
					strs.push('<td><a href="javascript:void(0)"><span id="delete_'+index+'">删除</span></a><a href="javascript:void(0)"><span id="modify_'+index+'">修改</span></a></td>');
					if(number%2==0){
						invoice.append('<tr class="alt">'+strs.join("")+'</tr>')	
					}else{
					    invoice.append('<tr>'+strs.join("")+'</tr>')
					}

					PageWrapper.page($("#page"),total,currentPage,queryByIndex);
					//删除客户信息
					$("#delete_"+index).bind('click',function(){
						layer.confirm("确定要删除该客户吗？", {
							icon: 0, title:'提示',btn: ['确定','取消'] //按钮
						}, function(index){
							layer.close(index);
							$http.get(basePath+"/manage/customer/deleteCustomerById"+suffix,{enterpriseCustomerId:item.enterpriseCustomerId},function(data) {
								 queryByIndex(1);
					          }) 
						}, function(){
							layer.close(index);
					  });
						 	
					});
					//修改客户信息
					$("#modify_"+index).bind('click',function(){
						 window.location.href = "/pages/manage/customer/customer_xg.shtml?enterpriseCustomerId="+item.enterpriseCustomerId;
					});
	            })
			}else {
				$("#invoice").empty();
				$("#page").empty();
				$("#invoice").html("<td colspan='12' style='text-align: center;'>暂无数据</td>");
			}
		}
	})
}

function viewState(state){
	if(state!="VALID"){
		return "无效";
	}else{
		return "有效";
	}
}

//判断对象是否为空
function judgeNull(str){
	if(str==null){
		str="";
	}
	return str;
}
