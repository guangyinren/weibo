$(function(){
	queryByIndex(1);
});

//根据页数查询
function queryByIndex(currentPage){
	$.ajax({
		type: "GET",
		url: basePath+"invoiceItem/queryInvoiceItemList"+suffix,
		dataType: "json",
		success: function(data) {
			if ("200" == data.code) {
				var rows = data.data.rows;
				var total = data.data.total;
				if( total > 0){
					$("#invoice").empty();
					var invoice = $("#invoice")
					Array.prototype.forEach.call(rows,function(item,index,array) {
						var strs=[];
						var number = index+1;
						strs.push('<td>'+number+'</td>');
						strs.push('<td>'+$Utils.handleUndefined(item.itemName)+'</td>');
						strs.push('<td>'+$Utils.handleUndefined(item.taxClassificationCode)+'</td>');
						strs.push('<td>'+$Utils.handleUndefined(item.taxRateName)+'</td>');
						if(item.isDefault == false || item.isDefault == "false"){
							strs.push('<td>否</td>');
							strs.push('<td><a href="javascript:deleteInvoiceItemFun(\''+item.id+'\')"><span>删除</span></a>');
							strs.push('<a href="javascript:modifyInvoiceItemFun(\''+item.id+'\')"><span>修改</span></a>');
							strs.push('<a href="javascript:setDefaultFun(\''+item.id+'\')"><span>设为默认</span></a></td>');
						}else if(item.isDefault == true || item.isDefault == "true"){
							strs.push('<td>是</td>');
							strs.push('<td><a href="javascript:deleteInvoiceItemFun(\''+item.id+'\')"><span>删除</span></a>');
							strs.push('<a href="javascript:modifyInvoiceItemFun(\''+item.id+'\')"><span>修改</span></a></td>');
						}
						if(number%2==0){
							invoice.append('<tr class="alt">'+strs.join("")+'</tr>')	
						}else{
						    invoice.append('<tr>'+strs.join("")+'</tr>')
						}
		            })
		            if(total > 2){
		            	$("#saveBtn").hide();
		            }else{
		            	$("#saveBtn").show();
		            }
				} else {
					$("#invoice").empty();
					$("#page").empty();
					$("#invoice").html("<td colspan='12' style='text-align: center;'>暂无数据</td>");
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			layer.alert('系统繁忙,请稍候再试', {
				icon: 2,title:["",true],skin:"newLayer"
			}, function() {
				layer.closeAll();
			});
		}
	})
}
	
//删除
function deleteInvoiceItemFun(id){
	layer.confirm("确定要删除该开票项目吗？", {
		icon: 0, title:'提示',btn: ['确定','取消'] //按钮
	}, function(index){
		layer.closeAll();
		$.ajax({
			type: "POST",
			url: basePath+"/invoiceItem/deleteInvoiceItem"+suffix,
			data: {
				id : id
			},
			dataType: "json",
			success: function(data) {
				if ("200" == data.code) {
					layer.alert(data.msg, {
						icon: 1,title:["",true],skin:"newLayer",closeBtn: 0
					}, function() {
						/*if($('#main',parent.document).tabs('exists','生成开票二维码')){
			    			 $('#main',parent.document).tabs('refresh','生成开票二维码');
			    		 }*/
						queryByIndex(1);
						layer.closeAll();
					});
				}else{
					layer.alert(data.msg, {
						icon: 2,title:["",true],skin:"newLayer",closeBtn: 0
					}, function() {
						layer.closeAll();
					});
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				layer.alert('系统繁忙,请稍候再试', {
					icon: 2,title:["",true],skin:"newLayer",closeBtn: 0
				}, function() {
					layer.closeAll();
				});
			}
		})	
	}, function(){
		layer.closeAll();
	});
}

//修改
function modifyInvoiceItemFun(id){
	window.location.href = "/pages/manage/invoiceItem/invoiceItemEdit.shtml?id="+id;
}

//设为默认
function setDefaultFun(id){
	$.ajax({
		type: "POST",
		url: basePath+"/invoiceItem/setDefault"+suffix,
		data: {
			id : id
		},
		dataType: "json",
		success: function(data) {
			if ("200" == data.code) {
				layer.alert(data.msg, {
					icon: 1,title:["",true],skin:"newLayer",closeBtn: 0
				}, function() {
					queryByIndex(1);
					layer.closeAll();
				});
			}else{
				layer.alert(data.msg, {
					icon: 2,title:["",true],skin:"newLayer",closeBtn: 0
				}, function() {
					layer.closeAll();
				});
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			layer.alert('系统繁忙,请稍候再试', {
				icon: 2,title:["",true],skin:"newLayer",closeBtn: 0
			}, function() {
				layer.closeAll();
			});
		}
	})	
}