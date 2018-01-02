$(function(){
	queryCusByIndex(1);
})
var pageSize = 10;
var cusArr = [];
//客户信息部分
//根据页数查询客户信息
function queryCusByIndex(currentPage){
	$("#cusData").empty();
	cusArr = [];
	var customerName = $("#customerNameQuery").val();
	var customerCode = $("#customerCodeQuery").val();
	$http.get(basePath+"invoiceQuery/queryCustomerByPage"+suffix,{
				ver:new Date().getTime(),
				pageIndex:currentPage,
				pageSize:pageSize,
				customerName:customerName,
				customerCode:customerCode
				},function(data) {
		if("200"==data.code){
			layer.closeAll();
			var rows = data.data.data.rows;
			var total = data.data.data.total;
			var pageCount = Math.floor((total-1)/pageSize)+1;
			if( rows.length > 0){
				var strs = [];
				Array.prototype.forEach.call(rows,function(item,index,array) {
					strs.push('<tr ondblclick="fillCus('+index+')">');
					strs.push('<td>'+$Utils.handleUndefined(item.customerCode)+'</td>');
					strs.push('<td>'+$Utils.handleUndefined(item.customerName)+'</td>');
					strs.push('<td>'+$Utils.handleUndefined(item.customerTaxNum)+'</td>');
					strs.push('<td>'+$Utils.handleUndefined(item.contactName)+'</td>');
					strs.push('<td>'+$Utils.handleUndefined(item.contactPhone)+'</td>');
					strs.push('<td>'+$Utils.handleUndefined(item.contactEmail)+'</td>');
					cusArr.push(item);
					strs.push('<td><a href="javascript:void(0)" onclick="fillCus('+index+')">选中</a></td>');
					strs.push('</tr>');
	            })
				PageWrapper.page($("#cusPage"),total,currentPage,queryCusByIndex);
	            $("#cusData").append(strs.join(""));
			}else {
				$("#cusData").append("<tr><td colspan='7'>暂无数据</td></tr>");
			}
		}
	})
}

//选取客户信息后进行填充
function fillCus(index){
	var item = cusArr[index];
	$("#cusData").empty();
	$("#gmfMc",parent.document).val($Utils.handleUndefined(item.customerName));
	$("#gmfNsrsbh",parent.document).val($Utils.handleUndefined(item.customerTaxNum));
	$("#gmfDzdh",parent.document).val($Utils.handleUndefined(item.address));
	$("#gmfdh",parent.document).val($Utils.handleUndefined(item.enterprisePhone));
	$("#gmfKhh",parent.document).val($Utils.handleUndefined(item.bankAccount));
	$("#gmfYhzh",parent.document).val($Utils.handleUndefined(item.accountNum));
	$("#sprMc",parent.document).val($Utils.handleUndefined(item.contactName));
	$("#sprSjh",parent.document).val($Utils.handleUndefined(item.contactPhone));
	$("#sprYx",parent.document).val($Utils.handleUndefined(item.contactEmail));
	parent.layer.closeAll();
}
