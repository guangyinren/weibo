 $(function () {
	 createTree();     	 
	 $("#search").bind('click',function(){
		 var keyword = $("#keyword").val();
		 solrsearchquery(1);
	 });
});
 var  pageSize=10;  
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
                 enable:true
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
//         for(var i=0;i<nodes.length;i++){
//            mergeCode = mergeCode+nodes[i].mergeCoding+",";
//         }
//         mergeCode = mergeCode.substring(0,mergeCode.length-1); 
         mergeCode = treeNode.mergeCoding;
         queryByIndex1(1,mergeCode); 
     }  
     $http.get("/manage/tax_category/head_node"+suffix,{},function(data) {
         var zNodes = data.data.item;
         zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
         var nodes = zTreeObj.getNodes();
         for (var i = 0; i < nodes.length; i++) { //设置节点展开
        	 zTreeObj.expandNode(nodes[i], true, false, true);
         }
     })
 }
     
     var taxCatArr = [];
     //根据页数查询
   	function solrsearchquery(currentPage){
   	  var keyword = $("#keyword").val();
      $http.get("/manage/product/searchTaxCategoryByKeyWord"+suffix,{
         keyword:keyword,
         pageIndex:currentPage-1
        },function(data) {
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
    						strs.push('<td>'+$Utils.handleUndefined(item.mergeFirstLevel)+'</td>');
    						strs.push('<td><a href="javascript:void(0)"  onclick="choiceTaxCat('+index+')">选中</a>');
    						taxCatArr.push(item);
    						if(number%2==0){
    							invoice.append('<tr class="alt" ondblclick="choiceTaxCat('+index+')">'+strs+'</tr>')	
    						}else{
    						    invoice.append('<tr ondblclick="choiceTaxCat('+index+')">'+strs+'</tr>')
    						}

    						laypage({
    							cont: $('#page'), //容器。值支持id名、原生dom对象，jquery对象,
    							pages: pageCount, //总页数
    							curr: currentPage, //当前页
    							skip: true, //是否开启跳页
    							skin: '#179d60',
    							groups: 3, //连续显示分页数
    							jump: function(obj, first){ //触发分页后的回调
    				                if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
    				                	solrsearchquery(obj.curr);
    				                }
    				            }
    			            });
    		            })
    				}else {
    					$("#invoice1").empty();
    					$("#page").empty();
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
      	$("#taxClassificationName"+proIndex+"",parent.document).val(item.goodsName);
      	var addedTaxSpecial = item.addedTaxSpecial;
      	if(addedTaxSpecial != null){
      		if(addedTaxSpecial.indexOf("免税") != -1){
          		$("#taxRate"+proIndex+"",parent.document).val("0");
          	}else{
          		$("#taxRate"+proIndex+"",parent.document).val(item.taxRate);
          	}
      	}
      	parent.countSePrice(proIndex);
        parent.layer.closeAll();
   	}
   	
   	function cutString(str){
   		str=str.replace("00","");  
        if(str.substring(str.length-2)=="00"){  
//          否则将字符串尾部删除位再进行递归  
            return cutString(str);   
        }else{
//          如果字符串尾部不为00，返回字符串
            return str;
        }  
   	 }
       //根据页数查询
      	function queryByIndex1(currentPage,mergeCode){
              $http.get("/manage/product/queryChildByMergeCoding"+suffix,{
        	        pageIndex : currentPage,
 			        pageSize : pageSize,
 			        mergeCode:mergeCode
              },function(data) {
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
 						strs.push('<td>'+$Utils.handleUndefined(item.taxRateValue)+'</td>');
 						strs.push('<td>'+$Utils.handleUndefined(item.addedTaxSpecial)+'</td>');
 						strs.push('<td>'+$Utils.handleUndefined(item.addedTaxBasis)+'</td>');
 						strs.push('<td>'+$Utils.handleUndefined(item.keyword)+'</td>');
 						strs.push('<td>'+$Utils.handleUndefined(item.mergeFirstLevel)+'</td>');
 						strs.push('<td><a href="javascript:void(0)"  onclick="choiceTaxCat('+index+')">选中</a></td>');
 						taxCatArr.push(item);
 						if(number%2==0){
 							invoice1.append('<tr class="alt" ondblclick="choiceTaxCat('+index+')">'+strs+'</tr>')	
 						}else{
 						    invoice1.append('<tr ondblclick="choiceTaxCat('+index+')">'+strs+'</tr>')
 						}

						laypage({
							cont: $('#page'), //容器。值支持id名、原生dom对象，jquery对象,
							pages: total, //总页数
							curr: currentPage, //当前页
							skip: true, //是否开启跳页
							skin: '#179d60',
							groups: 3, //连续显示分页数
							jump: function(obj, first){ //触发分页后的回调
				                if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
				                	queryByIndex1(obj.curr,mergeCode);
				                }
				            }
			            });
 		            })
 				}else {
 					$("#invoice1").empty();
 					$("#page").empty();
 				}
 			}         })  
      	} 
      	
