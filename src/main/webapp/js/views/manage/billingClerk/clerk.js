$(function() {
	queryByIndex(1);
});

//每页展示条数
var pageSize = 10;
//根据页数查询
function queryByIndex(currentPage) {
	var clerkName = $.trim($("#queryName").val());
	var loginName = $.trim($("#queryLoginName").val());
	var mechanism = $.trim($("#queryNechanism").val());
	var contractPhone = $.trim($("#queryTel").val());
	var validStatus = $.trim($("#state").val());
	$.ajax({
		type: "GET",
		url: basePath + "/manage/clerk/queryClerkMessage" + suffix,
		data: {
			pageIndex: currentPage,
			pageSize: pageSize,
			clerkName: clerkName,
			loginName: loginName,
			mechanism: mechanism,
			contractPhone: contractPhone,
			validStatus: validStatus
		},
		dataType: "json",
		success: function(data) {
			if ("200" == data.code) {
				var rows = data.data.data.rows;
				var total = data.data.data.total;
				var pageCount = Math.floor((total - 1) / pageSize) + 1;
				if (rows.length > 0) {
					$("#invoice").empty();
					Array.prototype.forEach.call(rows, function(item, index, array) {
						var strs = [];
						var number = pageSize * (currentPage - 1) + index + 1;
						strs.push('<td>' + number + '</td>');
						strs.push('<td>' + $Utils.handleUndefined(item.clerkName) + '</td>');
						strs.push('<td>' + $Utils.handleUndefined(item.loginName) + '</td>');
						strs.push('<td>' + $Utils.handleUndefined(item.mechanism) + '</td>');
						strs.push('<td>' + $Utils.handleUndefined(item.contractPhone) + '</td>');
						strs.push('<td>' + $Utils.handleUndefined(item.singleInvoiceLimitmoney) + '</td>');
						strs.push('<td>' + $Utils.handleUndefined(item.singleMonthInvoicenum) + '</td>');
						strs.push('<td>开票</td>');
						strs.push('<td>' + viewState(item.validStatus) + '</td>');
						strs.push('<td>&nbsp;<a href="javascript:disaOrActiveBillingClerk(\'' + item.billingClerkId + '\',\'' + item.validStatus + '\')">');
						strs.push('<span>' + openClose(item.validStatus) + '</span></a>&nbsp;&nbsp;');
						strs.push('<a href="javascript:modifyBillingClerk(\'' + item.billingClerkId + '\')"><span>修改</span></a></td>');
						$("#invoice").append('<tr>' + strs.join("") + '</tr>');
					});
					PageWrapper.page($("#page"), total, currentPage, queryByIndex);
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

function viewState(state) {
	if (state != "VALID") {
		return "禁用";
	} else {
		return "正常";
	}
}

function openClose(state) {
	if (state != "VALID") {
		return "启用";
	} else {
		return "禁用";
	}
}

//禁用开票员
function disaOrActiveBillingClerk(billingClerkId, validStatus) {
	if (validStatus == 'VALID') {
		layer.confirm("确定要禁用该开票员吗？", {
			icon: 3,
			title: '提示',
			btn: ['确定', '取消'], //按钮
			title:["",true],
			skin:"newLayer"
		}, function(index) {
			layer.close(index);
			$.ajax({
				type: "POST",
				url: basePath + "/manage/clerk/disableBillingClerk" + suffix,
				data: {
					billingClerkId: billingClerkId
				},
				dataType: "json",
				success: function(data) {
					if (data.code == 200) {
						if (data.data.data == 1) {
							layer.alert('操作成功', {
								icon: 1,
								title:["",true],
								skin:"newLayer"
							}, function() {
								layer.closeAll();
							});
							//							$("#"+enterpriseBillingClerkId).html('&nbsp;<a href="javascript:disaOrActiveBillingClerk(\''+enterpriseBillingClerkId+'\',INVALID)"><span>'+openClose('INVALID')+'</span></a>&nbsp;&nbsp;<a href="javascript:modifyBillingClerk(\''+enterpriseBillingClerkId+'\')"><span>修改</span></a>');
							queryByIndex(1);
						}
					} else {
						layer.alert('操作失败,请稍候再试', {
							icon: 2,
							title:["",true],
							skin:"newLayer"
						}, function() {
							layer.closeAll();
						});
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.alert('系统繁忙,请稍候再试', {
						icon: 2,
						title:["",true],
						skin:"newLayer"
					}, function() {
						layer.closeAll();
					});
				}
			})
		}, function() {
			layer.closeAll();
		});
	} else {
		layer.confirm("确定要启用该开票员吗？", {
			icon: 3,
			title: '提示',
			btn: ['确定', '取消'] //按钮
		}, function(index) {
			layer.close(index);
			$.ajax({
				type: "POST",
				url: basePath + "/manage/clerk/activeBillingClerk" + suffix,
				data: {
					billingClerkId: billingClerkId
				},
				dataType: "json",
				success: function(data) {
					if (data.code == 200) {
						if (data.data.data == 1) {
							layer.alert('操作成功', {
								icon: 1
							}, function() {
								layer.closeAll();
							});
							queryByIndex(1);
						}
					} else {
						layer.alert('操作失败,请稍候再试', {
							icon: 2
						}, function() {
							layer.closeAll();
						});
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.alert('系统繁忙,请稍候再试', {
						icon: 2,
						title:["",true],
						skin:"newLayer"
					}, function() {
						layer.closeAll();
					});
				}
			})
		}, function() {
			layer.closeAll();
		});
	}
}

//修改开票员
function modifyBillingClerk(billingClerkId) {
	window.location.href = basePath + "pages/manage/billingClerk/clerk_xg.shtml?billingClerkId=" + billingClerkId;
}