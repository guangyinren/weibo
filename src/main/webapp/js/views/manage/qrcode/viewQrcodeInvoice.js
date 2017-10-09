$(function(){
	queryQrInvoice();
})
//根据二维码对应的发票信息
function queryQrInvoice(){
	$("#qrInvoiceData").empty();
	var qrInvoiceId = $("#selectQrId",parent.document).val();
	$.ajax({
		type: "GET",
		url: basePath+"qrcode/queryQrInvoice"+suffix,
		data:{
			id : qrInvoiceId
		},
		dataType: "json",
		success: function(data) {
			if ("200" == data.code) {
				var rows = data.data.rows;
				var total = data.data.total;
				if( total > 0){
					var invoice = $("#qrInvoiceData");
					Array.prototype.forEach.call(rows,function(item,index,array) {
						var strs=[];
						strs.push('<td>'+(index+1)+'</td>');
						strs.push('<td>'+$Utils.handleUndefined(item.jshj.toFixed(2))+'</td>');
						strs.push('<td>'+$Utils.handleUndefined(item.kpxm)+'</td>');
						strs.push('<td>'+$Utils.handleUndefined(item.kprq)+'</td>');
						if(item.kpzt == 'MAKEINVOICEFAIL'){
							strs.push('<td>开票失败</td>');
							strs.push('<td><a href="javascript:viewInvoiceFun(\''+item.fpqqlsh+'\')"><span>查看</span></a>');
							strs.push('<a href="javascript:viewFailReason(\''+item.sbyy+'\',\''+item.fpqqlsh+'\')">失败原因</a>');
						}else if(item.kpzt == 'MAKEINVOICESUCCESS'){
							strs.push('<td>开票成功</td>');
							strs.push('<td><a href="javascript:viewInvoiceFun(\''+item.fpqqlsh+'\')"><span>查看</span></a></td>');
						}else{
							strs.push('<td>开票中</td>');
							strs.push('<td><a href="javascript:viewInvoiceFun(\''+item.fpqqlsh+'\')"><span>查看</span></a></td>');
						}
						invoice.append('<tr>'+strs.join("")+'</tr>')
		            })
				} else {
					$("#qrInvoiceData").html("<td colspan='12' style='text-align: center;'>暂无数据</td>");
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

//蓝票开票失败原因
function viewFailReason(reason, fpqqlsh) {
    $("#reason").html($Utils.handleUndefined(reason));
    $("#fpqqlsh").val(fpqqlsh);
    var dakai = layer.open({
        type: 1,
        closeBtn: 1, //不显示关闭按钮
        shadeClose: true, //开启遮罩关闭
		area: ['300px', 'auto'],
        content: $("#viewFailReason"),
		scrollbar: false
    });
}

//查看发票
function viewInvoiceFun(fpqqlsh) {
    window.location.href = basePath + "pages/manage/invoiceManage/elecInvoiceDetail.shtml?fpqqlsh=" + fpqqlsh;
}