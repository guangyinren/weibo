$(function(){
	queryByIndex(1);
	
	 $('#query').on('click',function(){
		    queryByIndex(1);
	 });
	 
	 //填充税率
	 $.ajax({
			type:"GET",
			url:basePath+"manage/product/selectInvoiceSetting"+suffix,
			success:function(data){
				if(data.code==200){
					var  invoiceSetting= data.data;
					var taxRateIdString = "";
					var taxRateIdList;
					var taxpayerTypeId;
					if(invoiceSetting!=null){
						taxRateIdString = invoiceSetting.taxRateId;
						taxpayerTypeId = invoiceSetting.taxpayerTypeId;
						if(taxRateIdString!=null&&taxRateIdString!=""){
							taxRateIdList=taxRateIdString.split("|");
						}
						
						$.ajax({
							type:"GET",
							url:basePath+"manage/taxrate/getTypeRate"+suffix,
							success:function(data){
								if(data.code==200){
									 if(data.data.list.length>0){
										 if(taxpayerTypeId==data.data.list[0].taxpayerTypeId){
											//小规模纳税人
											var raxRates = data.data.list[0].taxRates;
											var selectObj=document.getElementById("queryTaxRate");
											if(selectObj!=null){
												//selectObj.options.length = 0;
											     for(var i=0;i<raxRates.length;i++){
											    	 for(var j=0;j<taxRateIdList.length;j++){
											    		 if(raxRates[i].taxRateId==taxRateIdList[j]){
											    			 selectObj.options.add(new Option(raxRates[i].frontName,raxRates[i].taxRateId));
											    		 }
											    	 }
						    		             }   	
											}
										 }
										 else{
											 //一般纳税人
											 var raxRates = data.data.list[1].taxRates;
											 var selectObj=document.getElementById("queryTaxRate");
											 if(selectObj!=null){
												// selectObj.options.length = 0; 
					 						     for(var i=0;i<raxRates.length;i++){
					 						    	 for(var j=0;j<taxRateIdList.length;j++){
											    		 if(raxRates[i].taxRateId==taxRateIdList[j]){
											    			 selectObj.options.add(new Option(raxRates[i].frontName,raxRates[i].taxRateId)); 
											    		 }
					 						    	 }
					  	    		           } 
											 } 
										 }
									 }
									  
								  } 
							}
						})
					}
				}
			}
		})
	 
	 $("#queryPrice").blur(function(){
		    var sprice = Number($("#queryPrice").val());
		    if (parseInt(sprice)==sprice) 
		    { 
		        sprice = parseFloat(sprice);  
		        if(!isNaN(sprice)) {  
		         sprice = sprice.toFixed(2);  
		        }
		        $("#queryPrice").val(sprice);
		    } 
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
		var queryTaxClassificationCode = $.trim($("#queryTaxClassificationCode").val());
		var queryEnterpriseCommodityCode = $.trim($("#queryEnterpriseCommodityCode").val());
		var queryProductName = $.trim($("#queryProductName").val());
		var queryTaxClassificationName = $.trim($("#queryTaxClassificationName").val());
		var queryMeteringUnit = $.trim($("#queryMeteringUnit").val());
		var queryPrice = $.trim($("#queryPrice").val());
		var queryTaxPriceMarked = $.trim($("#queryTaxPriceMarked").val());
		var queryTaxRate = $.trim($("#queryTaxRate").val());
		$.ajax({
			type:"GET",
			url:basePath+"manage/product/search"+suffix,
			data:{
				pageIndex : currentPage,
				pageSize : pageSize,
				TaxClassificationCode : queryTaxClassificationCode,
				EnterpriseCommodityCode : queryEnterpriseCommodityCode,
				ProductName : queryProductName,
				TaxClassificationName : queryTaxClassificationName,
				MeteringUnit : queryMeteringUnit,
				Price : queryPrice,
				TaxPriceMarked : queryTaxPriceMarked,
				taxRateId : queryTaxRate
			},
			success:function(data){
				if("200"==data.code){
					var rows = data.data.rows;
					var total = data.data.total;
					var pageCount = Math.floor((total-1)/pageSize)+1;
					if( rows.length > 0){
						$("#invoice").empty();
						var invoice = $("#invoice")
						Array.prototype.forEach.call(rows,function(item,index,array) {
							var strs=[];
							var number = pageSize*(currentPage-1)+index+1;
							strs.push('<td>'+number+'</td>');
							strs.push('<td title="'+judgeNull(item.productName)+'">'+judgeNull(item.productName)+'</td>');
							strs.push('<td title="'+judgeNull(item.taxClassificationCode)+'">'+judgeNull(item.taxClassificationCode)+'</td>');
							strs.push('<td title="'+judgeNull(item.taxClassificationName)+'">'+judgeNull(item.taxClassificationName)+'</td>');
							strs.push('<td title="'+judgeNull(item.enterpriseCommodityCode)+'">'+judgeNull(item.enterpriseCommodityCode)+'</td>');
							if(item.taxRateId == 'al_743758300675444737' || item.taxRateId == 'al_743759950106464258'){
								strs.push('<td>免税</td>');
							}else{
								strs.push('<td>'+judgeNull(item.taxRateValue)+'</td>');
							}
							strs.push('<td title="'+judgeNull(item.specificationModel)+'">'+judgeNull(item.specificationModel)+'</td>');
							strs.push('<td title="'+judgeNull(item.meteringUnit)+'">'+judgeNull(item.meteringUnit)+'</td>');
							if(!isNaN(item.price) && item.price != "null" && item.price != null){
								if(parseInt(item.price)==item.price){
									strs.push('<td>'+judgeNull(parseFloat(item.price).toFixed(2))+'</td>');
								}else if(item.price.toString().split(".")[1].length==1){
									strs.push('<td>'+judgeNull(parseFloat(item.price).toFixed(2))+'</td>');
								}else if(item.price.toString().split(".")[1].length>=2){
									strs.push('<td>'+judgeNull(item.price)+'</td>');
								}
							}else{
								strs.push('<td></td>');
							}
							strs.push('<td>'+taxPriceMarked(item.taxPriceMarked)+'</td>');
							strs.push('<td><a href="javascript:void(0)"><span id="delete_'+index+'">删除</span></a><a href="javascript:void(0)"><span id="modify_'+index+'">修改</span></a></td>');
							if(number%2==0){
								invoice.append('<tr class="alt">'+strs.join("")+'</tr>')	
							}else{
							    invoice.append('<tr>'+strs.join("")+'</tr>')
							}
							
							PageWrapper.page($("#page"),total,currentPage,queryByIndex);
							
							$("#delete_"+index).bind('click',function(){
								layer.confirm("确定要删除该商品吗？", {
									icon: 0, title:'提示',btn: ['确定','取消'] //按钮
								}, function(index){
									layer.close(index);
									$.ajax({
										type:"GET",
										url:basePath+"manage/product/deleteProductById"+suffix,
										data:{
											enterpriseProductId:item.enterpriseProductId
										},
										success:function(data){
											queryByIndex(1);
										}
									})
								}, function(){
									layer.close(index);
							  });
							});
							
							$("#modify_"+index).bind('click',function(){
								window.location.href = "/pages/manage/product/product_xg.shtml?enterpriseProductId="+item.enterpriseProductId;
							});
			            })
					}else {
						$("#invoice").empty();
						$("#page").empty();
						$("#invoice").html("<td colspan='12' style='text-align: center;'>暂无数据</td>");
					}
				}
			}
		})
	}
	
	//判断对象是否为空
	function judgeNull(str){
		if(str==null||str=="null"){
			str="";
		}
		return str;
	}
	//含税标准显示是否
	function taxPriceMarked(str){
		if(str=="true"){
			return "是";
		}else{
			return "否";
		}
	}