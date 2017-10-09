
$(function() {
	queryByIndex(1);
})


//每页展示条数
var pageSize = 10;
//底部分页控件展示页数
var showpageTotal = 6;
var inputPage = 1;
//翻页后前进页数
var plusPage = 2;

//根据页数查询
function queryByIndex(currentPage) {
	$http.get(basePath + "invoice_query/ptbQueryByPage" + suffix,
			{
				pageIndex : currentPage,
				pageSize : pageSize
			}, function(data) {
				//console.info(data);
				if("200" == data.code) {
					var rows = data.data.rows;
					var total = data.data.total;
					var pageCount = Math.floor((total - 1) / pageSize) + 1;
					if(rows.length > 0) {
						$("#ptb").empty();
						var ptb = $("#ptb");
						Array.prototype.forEach.call(rows, function(item, index, array) {
							var strs = [];
							var number = pageSize * (currentPage - 1) + index + 1;
							strs.push('<td>' + number + '</td>');
							strs.push('<td>' + judgeNull(item.taxpayerNum) + '</td>');
							strs.push('<td>');
							if (item.diskType == 'JSP') {
								strs.push('金税盘');
							} else if (item.diskType == 'SKP') {
								strs.push('税控盘');
							} else {
								strs.push(judgeNull(item.diskType));
							}
							strs.push('</td>');
							strs.push('<td>' + judgeNull(item.extensionNum) + '</td>');
							strs.push('<td>' + judgeNull(item.ipAddress) + '</td>');
							strs.push('<td>' + judgeNull(item.softwareVersion) + '</td>');
							strs.push('<td>');
							if (item.ptbStatus == '0') {
								strs.push('<span style="color: #0EE00F;">在线</span>');
							} else if (item.ptbStatus == '1') {
								strs.push('<span style="color: #F00;">离线</span>');
							} else {
								strs.push(judgeNull(item.ptbStatus));
							}
							strs.push('</td>');
							if(number % 2 == 0) {
								ptb.append('<tr class="alt">' + strs.join("") + '</tr>')	
							} else {
								ptb.append('<tr>' + strs.join("") + '</tr>')
							}
			            })
			            if (total > pageSize) {	//总数超过10条，显示分页插件，否则不显示
			            	PageWrapper.page($("#page"), total, currentPage, queryByIndex);
			            }
					} else {
						$("#ptb").empty();
						$("#page").empty();
						$("#ptb").html("<td colspan='12' style='text-align: center;'>暂无数据</td>");
					}
				}
	})
}

//判断对象是否为空
function judgeNull(str) {
	if (str == null) {
		str = "";
	}
	return str;
}