$(function() {
	//日期控件
	DatetimePicker.startDateLessEndDate($("#startFsrq"),"","2016-08-01",new Date(),$("#endFsrq"));
	DatetimePicker.endDateMoreStartDate($("#endFsrq"),"","2016-08-01",new Date(),$("#startFsrq"));
	DatetimePicker.startDateLessEndDate($("#startKprq"),"","2016-08-01",new Date(),$("#endKprq"));
	DatetimePicker.endDateMoreStartDate($("#endKprq"),"","2016-08-01",new Date(),$("#startKprq"));
	queryByIndex(1);
});

$.validator.setDefaults({
    success: "valid"
});
var validator = $("#sendLogManageForm").validate({
    onfocusout : function(element) {
      $(element).valid();
    },
    onfocusin : function(element) {
      if (this.settings.focusCleanup) {
//        $("#" + $(element).attr("id") + "_tip").text("");
      }
    },
    focusCleanup : true,
    onkeyup : false,
    highlight : function(element, errorClass) {
      $(element).fadeOut(function() {
        $(element).fadeIn();
      });
    },
    errorPlacement : function(error, element) {
      if(error.text() != "" && error.text() != null){
    	 layer.tips(error.text(),"#" + element.attr("id"),{tips:[1,'red']});
      }
    }
  });

	var pageSize = 10;
	var num = 0;
	//根据页数查询
	function queryByIndex(currentPage){
			var startFsrq = $("#startFsrq").val();
			var endFsrq = $("#endFsrq").val();
			var type = $("#type").val();
			var status = $("#status").val();
			var startKprq = $("#startKprq").val();
			var endKprq = $("#endKprq").val();
			var fpDm = $.trim($("#fpDm").val());
			var fpHm = $.trim($("#fpHm").val());
			var gmfMc = $.trim($("#gmfMc").val());
			var sprMc = $.trim($("#sprMc").val());
			var sjhOrYx = $.trim($("#sjhOrYx").val());
			$http.get(basePath+"sendLog/querySendLogByPage"+suffix,
					{
						ver:new Date().getTime(),
						pageIndex:currentPage,
			            pageSize:pageSize,
			            startFsrq:startFsrq,
			            endFsrq:endFsrq,
			            type:type,
			            status:status,
			            startKprq:startKprq,
			            endKprq:endKprq,
			            fpDm:fpDm,
			            fpHm:fpHm,
			            gmfMc:gmfMc,
			            sprMc:sprMc,
			            sjhOrYx:sjhOrYx
					},function(data) {
				if("200"==data.code){
					var rows = data.data.rows;
					var total = data.data.total;
					var pageCount = Math.floor((total-1)/pageSize)+1;
					if( rows.length > 0){
						$("#sendLog").empty();
						Array.prototype.forEach.call(rows,function(item,index,array) {
					        var number = pageSize*(currentPage-1)+index+1;
			                var sendLog = new SendLog(item,number);
			                $("#sendLog").append(sendLog.fillListData());
			            })
			            PageWrapper.page($("#page"),total,currentPage,queryByIndex);
					}else {
						$("#sendLog").empty();
						$("#sendLog").html("<td colspan='12' style='text-align: center;'>暂无数据</td>");
						$("#page").empty();
					}
				}
			})
	}
	
	//鼠标移动到表格行
	function moveOverTr(moveTr){
		$(moveTr).addClass("alt");
	}
	//鼠标移出表格行
	function moveOutTr(moveTr){
		$(moveTr).removeClass("alt");
	}
	
