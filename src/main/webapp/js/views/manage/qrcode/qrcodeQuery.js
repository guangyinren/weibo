$(function(){
	queryByIndex(1);
	$('#query').on('click',function(){
		   queryByIndex(1);
	});
});


//每页展示条数
var pageSize = 10;
//根据页数查询
function queryByIndex(currentPage){
	var status = $("#invoiceQrcodeMarked").val();
	$.ajax({
		type: "GET",
		url: basePath+"qrcode/queryQrcodeList"+suffix,
		data:{
			pageIndex : currentPage,
			pageSize : pageSize,
			status : status
		},
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
						var number = pageSize*(currentPage-1)+index+1;
						strs.push('<td>'+number+'</td>');
						strs.push('<td>'+$Utils.handleUndefined(item.invoiceAmount.toFixed(2))+'</td>');
						/*strs.push('<td>'+$Utils.handleUndefined(item.invoiceItemName)+'</td>');*/
						strs.push('<td>'+$Utils.handleUndefined(item.makeInvoiceCount)+'</td>');
						strs.push('<td>'+$Utils.handleUndefined(parseInt(item.makeInvoiceCount)-parseInt(item.availableCount))+'</td>');
						if(item.smsFlag){
							strs.push('<td>是</td>');
						}else{
							strs.push('<td>否</td>');
						}
						strs.push('<td>'+$Utils.handleUndefined(item.expiredays)+'</td>');
						strs.push('<td>'+$Utils.handleUndefined(item.tradeTime)+'</td>');
						if(item.useFlag){
							strs.push('<td>已使用</td>');
							strs.push('<td><a href="javascript:viewQrcodeFun(\''+item.enterpriseName+'\',\''+item.invoiceAmount+'\',\''+item.invoiceItemName+'\',\''+item.tradeTime+'\',\''+item.qrImgStr+'\',\''+item.expiredays+'\')"><span>查看二维码</span></a>');
							strs.push('<a href="javascript:viewInvoiceFun(\''+item.id+'\')"><span>查看发票</span></a></td>');
						}else{
							strs.push('<td>未使用</td>');
							strs.push('<td><a href="javascript:viewQrcodeFun(\''+item.enterpriseName+'\',\''+item.invoiceAmount+'\',\''+item.invoiceItemName+'\',\''+item.tradeTime+'\',\''+item.qrImgStr+'\',\''+item.expiredays+'\')"><span>查看二维码</span></a>');
							strs.push('<a href="javascript:deleteQrcodeFun(\''+item.id+'\')"><span>删除</span></a></td>');
						}
						/*if(item.status == 'NOMAKEINVOICE'){
							strs.push('<td>未开票</td>');
							strs.push('<td><a href="javascript:viewQrcodeFun(\''+item.enterpriseName+'\',\''+item.invoiceAmount+'\',\''+item.invoiceItemName+'\',\''+item.tradeTime+'\',\''+item.bytes+'\',\''+item.expiredays+'\')"><span>查看二维码</span></a>');
							strs.push('<a href="javascript:deleteQrcodeFun(\''+item.id+'\')"><span>删除</span></a></td>');
						}else if(item.status == 'MAKEINVOICEING'){
							strs.push('<td>开票中</td>');
							strs.push('<td><a href="javascript:viewQrcodeFun(\''+item.enterpriseName+'\',\''+item.invoiceAmount+'\',\''+item.invoiceItemName+'\',\''+item.tradeTime+'\',\''+item.bytes+'\',\''+item.expiredays+'\')"><span>查看二维码</span></a></td>');
						}else if(item.status == 'MAKEINVOICEFAIL'){
							strs.push('<td>开票失败</td>');
							strs.push('<td><a href="javascript:viewQrcodeFun(\''+item.enterpriseName+'\',\''+item.invoiceAmount+'\',\''+item.invoiceItemName+'\',\''+item.tradeTime+'\',\''+item.bytes+'\',\''+item.expiredays+'\')"><span>查看二维码</span></a></td>');
						}else{
							strs.push('<td>开票成功</td>');
							strs.push('<td><a href="javascript:viewQrcodeFun(\''+item.enterpriseName+'\',\''+item.invoiceAmount+'\',\''+item.invoiceItemName+'\',\''+item.tradeTime+'\',\''+item.bytes+'\',\''+item.expiredays+'\')"><span>查看二维码</span></a>');
							strs.push('<a href="javascript:viewInvoiceFun(\''+item.fpqqlsh+'\')"><span>查看发票</span></a></td>');
						}*/
						invoice.append('<tr>'+strs.join("")+'</tr>')
		            })
		            PageWrapper.page($("#page"),total,currentPage,queryByIndex);
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

//查看二维码
function viewQrcodeFun(enterpriseName,invoiceAmount,invoiceItemName,tradeTime,bytes,expiredays){
	$("#enterpriseName").text(enterpriseName);
	$("#invoiceAmount").text(parseFloat(invoiceAmount).toFixed(2));
	$("#invoiceItemName").text(invoiceItemName);
	$("#tradeTime").text(tradeTime);
	$("#expiredays").text(expiredays);
	$("#qrcodeImg").attr("src","data:image/png;base64," + bytes);
    layer.open({
        id:'o1',
        type: 1,
        title:['开票二维码', 'background: #394457;color:#fff;'],
        content: $('#qrCodeImages'),
        offset: ['0px'],
        scrollbar: false,
        btn: ['打 印'],btnAlign: 'c',area: 'auto',maxWidth:600,
        yes: function(index, layero){
//			$("#qrCodeImages").jqprint();
			$("#qrCodeImages").jqprint({
			     debug: false, //如果是true则可以显示iframe查看效果（iframe默认高和宽都很小，可以再源码中调大），默认是false
			     importCSS: false, //true表示引进原来的页面的css，默认是true。（如果是true，先会找$("link[media=print]")，若没有会去找$("link")中的css文件）
			     printContainer: false, //表示如果原来选择的对象必须被纳入打印（注意：设置为false可能会打破你的CSS规则）。
			     operaSupport: true//表示如果插件也必须支持歌opera浏览器，在这种情况下，它提供了建立一个临时的打印选项卡。默认是true
			})
        }
    });
}
	
//删除二维码
function deleteQrcodeFun(id){
	layer.confirm("确定要删除该二维码吗？", {
		icon: 0, title:'提示',btn: ['确定','取消'] //按钮
	}, function(index){
		layer.closeAll();
		$.ajax({
			type: "POST",
			url: basePath+"/qrcode/deleteQrcode"+suffix,
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
	}, function(){
		layer.closeAll();
	});
}

//查看发票
function viewInvoiceFun(id){
	$("#selectQrId").val(id);
	layer.open({
		  type: 2,
		  skin:'black-lay',
		  title:['查看发票', 'background: #394457;color:#fff;'],
		  area: ['80%', '90%'],
		  offset: ['10px', '100px'],
		  shadeClose: true, //开启遮罩关闭
		  shade: [0.8, '#393D49'],
		  scrollbar:true,
		  content: ['../qrcode/viewQrcodeInvoice.shtml','no']
	});
//	window.location.href = basePath + "pages/manage/qrcode/elecInvoiceDetail.shtml?fpqqlsh=" + fpqqlsh;
}

