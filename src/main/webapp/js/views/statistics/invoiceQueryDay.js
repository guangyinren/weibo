$(function () {
    //日期控件
	DatetimePicker.startDateLessEndDate($("#startKprq"),"","2016-08",new Date(),$("#endKprq"));
	DatetimePicker.endDateMoreStartDate($("#endKprq"),"","2016-08",new Date(),$("#startKprq"));
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
