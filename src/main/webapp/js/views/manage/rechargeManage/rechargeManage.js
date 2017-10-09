
$(function() {
	//获取账户余额等信息
	 $http.get(basePath+"rechargeManager/dynamicData"+suffix,"",function(data) {
		 	var dynamicData = data.data.item;
		 	var isNoTariffPackage = dynamicData.isNoTariffPackage;
		 	if(isNoTariffPackage){
		 		$("#divReCharge2").css("display","block")
		 		$("#b06").text(dynamicData.invoiceTariffPackageSum);
				$("#b07").text(dynamicData.messageTariffPackageSum);
				$("#b01").text(dynamicData.moneySurplus);
		 	}else{
		 		$("#divReCharge1").css("display","block")
		 		$("#b01").text(dynamicData.moneySurplus);
				$("#b02").text(dynamicData.invoiceFreeNum);
				$("#b03").text(dynamicData.messageFreeNum);
				$("#b04").text(dynamicData.invoicePrice);
				$("#b05").text(dynamicData.messagePrice);
		 	}
		 	
			
			var moneySurplus = dynamicData.moneySurplus;
//			var invoicePackageType = dynamicData.invoicePackageType;
//			if(invoicePackageType=="INVOICE_FREE"){
//				$("#divReCharge").css("display","none")
//			}
		 	if(moneySurplus<=0){
		 		$("#buttonToRefund").css("display","none");
		 	}
     });		  
	 queryRechargeRecordsByIndex(1);
});


//每页展示条数
var pageSize = 10;
function queryRechargeRecordsByIndex(currentPage){
	$http.get(basePath+"rechargeManager/rechargeRecords"+suffix,
			{
				pageIndex : currentPage,
				pageSize : pageSize,
			},
			function(data) {
				if("200"==data.code){
					var json = JSON.parse(data.data.data);
					var rows = json.rows;
					var total = json.total;
					if( rows.length > 0){
						//$("#menu_tr").css("display","block");
						$("#recharge_records_query").empty();
						Array.prototype.forEach.call(rows,function(item,index,array) {
							var number = pageSize*(currentPage-1)+index+1;
			                var rechargeRecord = new RechargeRecord(item,number);
			                var str = rechargeRecord.fillListData();
			                $("#recharge_records_query").append(str);
			            })
						var pageCount = Math.floor((total-1)/pageSize)+1;
						PageWrapper.page($("#page1"),total,currentPage,queryRechargeRecordsByIndex);
					}else {
						$("#recharge_records_query").empty();
						$("#recharge_records_query").html("<td colspan='7' style='text-align: center;'>暂无数据</td>");
						$("#page1").empty();
					}
				}

			});
}
function queryConsumeRecordsByIndex(currentPage){
	//每页展示条数
	$http.get(basePath+"rechargeManager/consumeRecords"+suffix,
			{
				pageIndex : currentPage,
				pageSize : pageSize,
			},
			function(data) {
				if("200"==data.code){
					var json = JSON.parse(data.data.data);
					var rows = json.rows;
					var total = json.total;
					if( rows.length > 0){
						//$("#menu_tr").css("display","block");
						$("#consume_records_query").empty();
						Array.prototype.forEach.call(rows,function(item,index,array) {
							var number = pageSize*(currentPage-1)+index+1;
							var consumeRecord = new ConsumeRecord(item,number);
							var str = consumeRecord.fillListData();
							$("#consume_records_query").append(str);
						})
						var pageCount = Math.floor((total-1)/pageSize)+1;
						PageWrapper.page($("#page1"),total,currentPage,queryConsumeRecordsByIndex);

					}else {
						$("#consume_records_query").empty();
						$("#consume_records_query").html("<td colspan='5' style='text-align: center;'>暂无数据</td>");
						$("#page1").empty();
					}
				}

			});
}
function queryRefundRecordsByIndex(currentPage){
	//每页展示条数
	$http.get(basePath+"rechargeManager/refundRecords"+suffix,
			{
				pageIndex : currentPage,
				pageSize : pageSize,
			},
			function(data) {
				if("200"==data.code){
					var json = JSON.parse(data.data.data);
					var rows = json.rows;
					var total = json.total;
					if( rows.length > 0){
						//$("#menu_tr").css("display","block");
						$("#refund_records_query").empty();
						Array.prototype.forEach.call(rows,function(item,index,array) {
							var number = pageSize*(currentPage-1)+index+1;
							var refundRecord = new RefundRecord(item,number);
							var str = refundRecord.fillListData();
							$("#refund_records_query").append(str);
						})
						var pageCount = Math.floor((total-1)/pageSize)+1;
						PageWrapper.page($("#page1"),total,currentPage,queryRefundRecordsByIndex);

					}else {
						$("#refund_records_query").empty();
						$("#refund_records_query").html("<td colspan='7' style='text-align: center;'>暂无数据</td>");
						$("#page1").empty();
					}
				}

			});
}
//删除充值记录
function delRechargeRecord(rechargeRecordId){
	layer.confirm('您确定删除？', {
		  btn: ['是','否'] //按钮
		}, function(){
			$http.post(basePath+"rechargeManager/delRechargeRecord"+suffix,{id:rechargeRecordId},function(data) {
			  	if("200"==data.code){
			  			layer.closeAll('dialog');
			  			queryRechargeRecordsByIndex(1)
			  	}
		     });			  
		});
	  
}
//删除退款记录
function delRefundRecord(refundRecordId){
	layer.confirm('确定删除该退款记录吗？', {icon: 0, title:'提示', btn: ['确定','取消'] //按钮
		}, function(){
			$http.post(basePath+"rechargeManager/delRefundRecord"+suffix,{id:refundRecordId},function(data) {
			  	if("200"==data.code){
			  		//刷新当前页面
			  		layer.closeAll('dialog');
			  		queryRefundRecordsByIndex(1)
				}
		     });		  
		});
		  
}
