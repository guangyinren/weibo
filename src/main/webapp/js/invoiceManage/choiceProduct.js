var flag = true;
$(function () {
	$('#keyword-product').keydown(function (e) {
		if (e.keyCode == 13) {
			searchData();
		}
	});
	$('#keyword-taxcode').keydown(function (e) {
		if (e.keyCode == 13) {
			searchData();
		}
	});
	activePro();
	queryProByIndex(1);
	createTree();
})
var flag = true;
var pageSize = 10;

function activeTaxCode() {
	$("#kj-tab-id-taxcode").removeClass("kj-tab-li").addClass("kj-tab-li-active");
	$("#kj-tab-id-product").removeClass("kj-tab-li-active").addClass("kj-tab-li");
	$(".taxes-box").show();
	$(".custom").hide();
	flag = false;
}

function activePro() {
	$("#kj-tab-id-taxcode").removeClass("kj-tab-li-active").addClass("kj-tab-li");
	$("#kj-tab-id-product").removeClass("kj-tab-li").addClass("kj-tab-li-active");
	$(".taxes-box").hide();
	$(".custom").show();
	flag = true;
}

//搜索按钮
function searchData(){
	if(flag){
		queryProByIndex(1);
	}else{
		solrsearchquery(1);
	}
}
//商品信息部分
var proArr = [];

//根据页数查询商品信息
function queryProByIndex(currentPage){
	//$("#kj-tab-id-taxcode").removeClass("kj-tab-li-active").addClass("kj-tab-li");
	//$("#kj-tab-id-product").removeClass("kj-tab-li").addClass("kj-tab-li-active");
	//$(".taxes-box").hide();
	//$(".custom").show();
	$("#proData").empty();
	var productName = $("#keyword-product").val();
	$.ajax({
		type:"GET",
		url:basePath+"invoiceQuery/queryProductByPage"+suffix,
		data:{
			ver:new Date().getTime(),
			productName:productName,
			pageIndex:currentPage,
			pageSize:pageSize
		},
		success:function(data){
			if("200"==data.code){
				proArr = [];
				var rows = data.data.data.rows;
				var total = data.data.data.total;
				var pageCount = Math.floor((total-1)/pageSize)+1;
				if( rows.length > 0){
					var strs = [];
					Array.prototype.forEach.call(rows,function(item,index,array) {
						var taxTateValue = (Math.round(parseFloat(item.taxRateValue)*100)) + "%";
						var taxPriceMarked = item.taxPriceMarked;
						var discounted = item.discounted;
						var discountedPolicyType = item.discountedPolicyType;
						var price = item.price;
						if(taxPriceMarked == true || taxPriceMarked == "true"){
							taxPriceMarked = "是";
						}else if(taxPriceMarked == false || taxPriceMarked == "false"){
							taxPriceMarked = "否";
						}
						/*if(discounted == "Y"){
							taxTateValue = discountedPolicyType;
						}*/
						strs.push('<tr ondblclick="fillPro('+index+')">');
						strs.push('<td>'+$Utils.handleUndefined(item.enterpriseCommodityCode)+'</td>');
						strs.push('<td>'+$Utils.handleUndefined(item.productName)+'</td>');
						strs.push('<td>'+$Utils.handleUndefined(item.specificationModel)+'</td>');
						if(price){
							strs.push('<td>'+$Utils.checkInt(price)+'</td>');
						}else{
							strs.push('<td></td>');
						}
						strs.push('<td>'+$Utils.handleUndefined(taxPriceMarked)+'</td>');
						strs.push('<td>'+$Utils.handleUndefined(taxTateValue)+'</td>');
						proArr.push(item); 
						strs.push('<td><a href="javascript:void(0)"  onclick="fillPro('+index+')">选中</a></td>');
						strs.push('</tr>');
		            })
					PageWrapper.page($("#proPage"),total,currentPage,queryProByIndex);
		            $("#proData").append(strs.join(""));
				}else {
					$("#proData").append("<tr><td colspan='7'>暂无数据</td></tr>");
				}
			}
		}
	})
}

var proIndex = "";
//选取商品信息后进行填充
function fillPro(index){
	proIndex = parent.proIndex;
	var item = proArr[index];
	$("#proData").empty();
	var discounted = item.discounted;
	var discountedPolicyType = item.discountedPolicyType;
	var taxRateValue = item.taxRateValue;
	var frontName = item.frontName;
	var taxPriceMarked = item.taxPriceMarked;
	var price = item.price;
	//获取父页面含税标识
	var hsbz = parent.hsbz;
	//根据含税标识计算单价
	if(price){
		if(0 == hsbz || "0" == hsbz){
			//如果是含税价,进行反算,反算为不含税价
			if(taxPriceMarked == true || taxPriceMarked == "true"){
				var allTaxValue = math.add(1,taxRateValue);
				price = math.divide(price,allTaxValue);
			}
		}else if(1 == hsbz || "1" == hsbz){
			//如果是不含税价,进行反算，反算为含税价
			if(taxPriceMarked == false || taxPriceMarked == "false"){
				var allTaxValue = math.add(1,taxRateValue);
				price = math.multiply(price,allTaxValue);
			}
		}
	}
	//税收分类编码,税收分类名称
	var taxClassificationCode = item.taxClassificationCode;
	if(taxClassificationCode){
		$("#taxClassificationCode"+proIndex+"",parent.document).text(taxClassificationCode);
	}
	//判断是否有优惠政策,如果有而且为免税填充税率
	if(discounted == "Y" && discountedPolicyType == "免税"){
		taxRateValue = 0;
	}
	if(taxRateValue || taxRateValue == 0){
//		var taxTateText = math.multiply(taxRateValue,100);
//		$("#taxRate"+proIndex+"",parent.document).find("option[text='"+taxTateText+"%']").attr("selected",true);
		//将0%强制转换成0.00
		if(frontName == "0%"){
			taxRateValue = taxRateValue.toFixed(2);
		}
		$("#taxRate"+proIndex+"",parent.document).val(taxRateValue);
	}
	$("#enterpriseProductId"+proIndex+"",parent.document).text(item.enterpriseProductId);
	$("#productName"+proIndex+"",parent.document).val(item.productName==null?"":item.productName);
	$("#specificationModel"+proIndex+"",parent.document).val(item.specificationModel==null?"":item.specificationModel);
	$("#meteringUnit"+proIndex+"",parent.document).val(item.meteringUnit==null?"":item.meteringUnit);
	$("#quantity"+proIndex+"",parent.document).val($Utils.checkInt(1.00));
	if(price){
		$("#price"+proIndex+"",parent.document).val($Utils.checkInt(price));
		//获取差额值
		var balanceTotal = $("#balanceTotalHid",parent.document).val();
		if(balanceTotal){
			parent.countQuPrSeByPr(proIndex);
			parent.layer.closeAll();
			return;
		}
		var countPrice = price;
		$("#totalPrice"+proIndex+"",parent.document).val(countPrice.toFixed(2));
		var taxRate = $("#taxRate"+proIndex+" option:selected",parent.document).val();
		if(taxRate){
			//根据含税标识计算税额
			if(0 == hsbz || "0" == hsbz){
				var sePrice = math.multiply(countPrice,taxRate);
			}else if(1 == hsbz || "1" == hsbz){
				//换算为不含税金额
				var totalTaxVal = math.add(taxRate,1);
				countPrice = math.divide(countPrice,totalTaxVal);
				//计算税额
				var sePrice = math.multiply(countPrice,taxRate);
			}
			$("#sePrice"+proIndex+"",parent.document).val(sePrice.toFixed(2));
			countAllPrice();
		}
	}else{
		$("#price"+proIndex+"",parent.document).val("");
	}
	parent.layer.closeAll();
}

//计算总金额,总税额,价税合计
function countAllPrice(){
	var priceInputs = $("input[name=totalPrice]",parent.document);
	var allCountPrice = 0;
	priceInputs.each(function(){
		if(!isNaN($(this).val()) && $(this).val() != null && $(this).val() != ""){
			allCountPrice = math.add(allCountPrice,$(this).val());
		}
	});
	var sePriceInputs = $("input[name=sePrice]",parent.document);
	var allSePrice = 0;
	sePriceInputs.each(function(){
		if(!isNaN($(this).val()) && $(this).val() != null && $(this).val() != ""){
			allSePrice = math.add(allSePrice,$(this).val());
		}
	});
	var hsbz = parent.hsbz;
	if(0 == hsbz || "0" == hsbz){
		var allPrice = math.add(allCountPrice,allSePrice);
	}else if(1 == hsbz || "1" == hsbz){
		var allPrice = allCountPrice;
	}
	$("#hjje",parent.document).val(allCountPrice.toFixed(2));
	$("#hjse",parent.document).val(allSePrice.toFixed(2));
	$("#jshjxx",parent.document).val(allPrice.toFixed(2));
	$("#jshjdx",parent.document).val($Utils.convertMoneyToChinese(allPrice));
}

//查询税收分类
function queryTaxCategoryByPage(currentPage){
	flag = false;
	//$("#kj-tab-id-taxcode").removeClass("kj-tab-li").addClass("kj-tab-li-active");
	//$("#kj-tab-id-product").removeClass("kj-tab-li-active").addClass("kj-tab-li");
	//$(".taxes-box").show();
	//$(".custom").hide();
	//createTree();
	solrsearchquery(1);
}
var mergeCode;
/*生成树*/
var createTree = function(){
	 var zTreeObj;
    // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
    var setting = {
        showLabels:true,
        showLine:true,
		async:{
			enable:true,
			autoParam:["mergeCoding"],
			contentType: "application/json",
			url: basePath+"manage/tax_category/child_tax"+suffix,
			type:"get",
			dataType:"json"
		},
        data:{
            key: {
                children: "nodes",
                name: "goodsName"
            },
            simpleData:{
                enable:false
            }
        },
        callback:{
           // beforeClick:beforeClick,
            onClick:onClick
        }
    };
    function beforeClick(treeId,treeNode,clickFlag) {
    }
    function onClick(event, treeId, treeNode, clickFlag) {
        if (treeNode.isParent) {
        }
        var nodes = treeNode.nodes;
        mergeCode = treeNode.mergeCoding;
        queryByIndex1(1); 
    }
    $.ajax({
		type:"GET",
		url:basePath+"manage/tax_category/head_node"+suffix,
		success:function(data){
			var zNodes = data.data.item;
	        zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
	        var nodes = zTreeObj.getNodes();
	        for (var i = 0; i < nodes.length; i++) { //设置节点展开
	       	   zTreeObj.expandNode(nodes[i], true, false, true);
	        }
		}
	})
}
    
    var taxCatArr = [];
    //根据页数查询
  	function solrsearchquery(currentPage){
  		$(".taxes-box").show();
  		$(".custom").hide();
  		var keyword = $("#keyword-taxcode").val();
  		$.ajax({
  			type:"GET",
  			url:basePath+"manage/product/searchTaxCategoryByKeyWord"+suffix,
  			data:{
  				keyword:keyword,
  		        pageIndex:currentPage-1
  			},
  			success:function(data){
  				$("#invoice1").empty();
  				if("200"==data.code){
  		           if(data.data!=null){
  		   		    var rows = data.data.page;
  		   		    var total = data.data.rowCount;
  		   			if( rows.length > 0){
  		   					taxCatArr = [];
  		   					$("#invoice1").empty();
  		   					var invoice = $("#invoice1");
  		   					var pageCount = Math.floor((total-1)/pageSize)+1;
  		   					Array.prototype.forEach.call(rows,function(item,index,array) {
  		   						var strs = [];
  		   						var number = pageSize*(currentPage-1)+index+1;
  		   						strs.push('<td>'+cutString(item.mergeCoding)+'</td>');
  		   						strs.push('<td>'+$Utils.handleUndefined(item.mergeCoding)+'</td>');
  		   						strs.push('<td>'+$Utils.handleUndefined(item.goodsName)+'</td>');
  		   						strs.push('<td>'+$Utils.handleUndefined(item.explained)+'</td>');
  		   						strs.push('<td>'+$Utils.handleUndefined(item.taxRate)+'</td>');
  		   						strs.push('<td>'+$Utils.handleUndefined(item.addedTaxSpecial)+'</td>');
  		   						strs.push('<td>'+$Utils.handleUndefined(item.addedTaxBasis)+'</td>');
  		   						strs.push('<td>'+$Utils.handleUndefined(item.keyword)+'</td>');
  		   						if(item.mergeFirstLevel == "N"){
  		   							strs.push('<td>否</td>');
  		   						}else if(item.mergeFirstLevel == "Y"){
  		   							strs.push('<td>是</td>');
  		   						}
  		   						strs.push('<td><a href="javascript:void(0)"  onclick="choiceTaxCat('+index+')">选中</a>');
  		   						taxCatArr.push(item);
  		   						invoice.append('<tr ondblclick="choiceTaxCat('+index+')">'+strs+'</tr>')
  		   						PageWrapper.page($("#page"),total,currentPage,solrsearchquery);
//  		   						$("#invoice1").append(strs.join(""));
  		   		            })
  		   				}else {
  		   					$("#invoice1").empty();
  		   					$("#page").empty();
  		   				}	
  		           }
  			    }
  			}
  		})
  	}  
   
  	//选择税收分类填充
  	function choiceTaxCat(index){
  		var item = taxCatArr[index];
  		proIndex = parent.proIndex;
     	$("#taxClassificationCode"+proIndex+"",parent.document).text(item.mergeCoding);
     	$("#productName"+proIndex+"",parent.document).val(item.goodsName);
     	var addedTaxSpecial = item.addedTaxSpecial;
 		if(addedTaxSpecial && addedTaxSpecial.indexOf("免税") != -1){
     		$("#taxRate"+proIndex+"",parent.document).val("0");
     	}
 		if(item.taxRate){
 			var taxTateVal = item.taxRate.replace("%","");
 			taxTateVal = math.divide(taxTateVal,100);
 			$("#taxRate"+proIndex+"",parent.document).val(taxTateVal);
//         			$("#taxRate"+proIndex+"",parent.document).find("option[text='"+item.taxRate+"']").attr("selected",true);
 		}
 		if(item.taxRateDesc){
 			var taxTateVal = item.taxRateDesc.replace("%","");
 			taxTateVal = math.divide(taxTateVal,100);
 			$("#taxRate"+proIndex+"",parent.document).val(taxTateVal);
//         			$("#taxRate"+proIndex+" option[text='"+item.taxRateDesc+"']",parent.document).attr("selected", true);
//         			$("#taxRate"+proIndex+"",parent.document).find("option[text='"+item.taxRateDesc+"']").attr("selected",true);
 		}
     	parent.countSePrice(proIndex);
        parent.layer.closeAll();
  	}
  	
  	function cutString(str){
  		str=str.replace("00","");  
       if(str.substring(str.length-2)=="00"){  
//         否则将字符串尾部删除位再进行递归  
           return cutString(str);   
       }else{
//         如果字符串尾部不为00，返回字符串
           return str;
       }  
  	 }
      //根据页数查询
     	function queryByIndex1(currentPage){
     		$.ajax({
     			type:"GET",
     			url:basePath+"manage/product/queryChildByMergeCoding"+suffix,
     			data:{
     				pageIndex : currentPage,
			        pageSize : pageSize,
			        mergeCode:mergeCode
     			},
     			success:function(data){
     				if("200"==data.code){
                		var rows = data.data.list;
        				var total = data.data.total;
        				if( rows.length > 0){
	    					taxCatArr = [];
	    					$("#invoice1").empty();
	    					var invoice1 = $("#invoice1");
	    					Array.prototype.forEach.call(rows,function(item,index,array) {
    						var strs = [];
    						var number = pageSize*(currentPage-1)+index+1;
    						strs.push('<td>'+cutString(item.mergeCoding)+'</td>');
    						strs.push('<td>'+$Utils.handleUndefined(item.mergeCoding)+'</td>');
    						strs.push('<td>'+$Utils.handleUndefined(item.goodsName)+'</td>');
    						strs.push('<td>'+$Utils.handleUndefined(item.explained)+'</td>');
    						strs.push('<td>'+$Utils.handleUndefined(item.taxRateDesc)+'</td>');
    						strs.push('<td>'+$Utils.handleUndefined(item.addedTaxSpecial)+'</td>');
    						strs.push('<td>'+$Utils.handleUndefined(item.addedTaxBasis)+'</td>');
    						strs.push('<td>'+$Utils.handleUndefined(item.keyword)+'</td>');
    						if(item.mergeFirstLevel == "N"){
		   						strs.push('<td>否</td>');
		   					}else if(item.mergeFirstLevel == "Y"){
		   						strs.push('<td>是</td>');
		   					}
    						strs.push('<td><a href="javascript:void(0)"  onclick="choiceTaxCat('+index+')">选中</a></td>');
    						taxCatArr.push(item);
    						invoice1.append('<tr ondblclick="choiceTaxCat('+index+')">'+strs+'</tr>')
    						PageWrapper.page($("#page"),total,currentPage,queryByIndex1);
//		   				    $("#invoice1").append(strs.join(""));
    		            })
    				}else {
    					$("#invoice1").empty();
    					$("#page").empty();
    				}
    			}
     			}
     		})
     	}  

