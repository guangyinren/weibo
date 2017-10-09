 $(function () {
	 createTree();   
	 $("#search").bind('click',function(){
		 var keyword = $("#keyword").val();
		 solrsearchquery(1);
	 });
	 $('#keyword').keydown(function(e){
		 var keyword = $("#keyword").val();
		 solrsearchquery(1);
	 });
 });
 var  pageSize=5;  
 var mergeCode;
 var cusArr = [];
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
     
     //根据页数查询
 function solrsearchquery(currentPage){
   		cusArr = [];
   	    var keyword = $("#keyword").val();
   	 $.ajax({
 		type:"GET",
 		url:basePath+"manage/product/searchTaxCategoryByKeyWord"+suffix,
 		data:{
 			keyword:keyword,
 	        pageIndex:currentPage-1
 		},
 		success:function(data){
 			if("200"==data.code){
 	            if(data.data!=null){
 	    		    var rows = data.data.page;
 	    		    var total = data.data.rowCount;
 	    			if( rows.length > 0){
 	    					$("#invoice1").empty();
 	    					var invoice = $("#invoice1");
 	    					var pageCount = Math.floor((total-1)/pageSize)+1;
 	    					Array.prototype.forEach.call(rows,function(item,index,array) {
 	    						var strs = [];
 	    						var number = pageSize*(currentPage-1)+index+1;
 	    						strs.push('<tr ondblclick="fillCus('+index+')">');
 	    						strs.push('<td>'+judgeNull(cutString(item.mergeCoding))+'</td>');
 	    						strs.push('<td>'+judgeNull(item.mergeCoding)+'</td>');
 	    						strs.push('<td>'+judgeNull(item.goodsName)+'</td>');
 	    						strs.push('<td>'+judgeNull(item.explained)+'</td>');
 	    						strs.push('<td>'+judgeNull(item.taxRate)+'</td>');
 	    						strs.push('<td>'+judgeNull(item.addedTaxSpecial)+'</td>');
 	    						strs.push('<td>'+judgeNull(item.addedTaxBasis)+'</td>');
 	    						strs.push('<td>'+judgeNull(item.keyword)+'</td>');
 	    						if(item.mergeFirstLevel == "N"){
 			   						strs.push('<td>否</td>');
 			   					}else if(item.mergeFirstLevel == "Y"){
 			   						strs.push('<td>是</td>');
 			   					}
 	    						cusArr.push(item);
 	    						strs.push('<td><input type="button" value="选中" id="selectedTax'+index+'" style="border: 0;background-color: white;color: #1a92c5;"/></td>');
 	    						strs.push('</tr>');
 	    						invoice.append(strs.join(""))
 	    						PageWrapper.page($("#page"),total,currentPage,solrsearchquery);
 	    						
 	    						//$("#gmfMc",parent.document).val(item.customerName==null?"":item.customerName);
 	    						$("#selectedTax"+index).bind('click',function(){
 	    							choiceTaxCat(item);
 	    						}
 	    						);
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
   	
      	function queryByIndex1(currentPage){
      		cusArr = [];
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
      	 					$("#invoice1").empty();
      	 					var invoice1 = $("#invoice1");
      	 					//var pageCount = Math.floor(total/pageSize) == 0?Math.floor(total/pageSize):Math.floor(total/pageSize)+1;
      	 					Array.prototype.forEach.call(rows,function(item,index,array) {
      	 						var strs = [];
      	 						var number = pageSize*(currentPage-1)+index+1;
      	 						strs.push('<tr ondblclick="fillCus('+index+')">');
      	 						strs.push('<td>'+judgeNull(cutString(item.mergeCoding))+'</td>');
      	 						strs.push('<td>'+judgeNull(item.mergeCoding)+'</td>');
      	 						strs.push('<td>'+judgeNull(item.goodsName)+'</td>');
      	 						strs.push('<td>'+judgeNull(item.explained)+'</td>');
      	 						strs.push('<td>'+judgeNull(item.taxRateDesc)+'</td>');
      	 						strs.push('<td>'+judgeNull(item.addedTaxSpecial)+'</td>');
      	 						strs.push('<td>'+judgeNull(item.addedTaxBasis)+'</td>');
      	 						strs.push('<td>'+judgeNull(item.keyword)+'</td>');
      	 						if(item.mergeFirstLevel == "N"){
    		   						strs.push('<td>否</td>');
    		   					}else if(item.mergeFirstLevel == "Y"){
    		   						strs.push('<td>是</td>');
    		   					}
      	 						cusArr.push(item);
      	 						strs.push('<td><input type="button" value="选中" id="selectedTax'+index+'" style="border: 0;background-color: white;color: #1a92c5;"/></td>');
      	 						strs.push('</tr>');
      	 						invoice1.append(strs.join(""))
      	 						$("#selectedTax"+index).bind('click',function(){
      	 							choiceTaxCat(item);
      							});
      	 		            })
      	 		            PageWrapper.page($("#page"),total,currentPage,queryByIndex1);
      	 				}else {
      	 					$("#invoice1").empty();
      	 					$("#page").empty();
      	 				}
      	 			}
      			}
      		})
      	}
      	function fillCus(index){
      		var item=cusArr[index];
      		choiceTaxCat(item);
      	}
      	
      //选择税收分类填充
       	function choiceTaxCat(item){
			 var selectObj=parent.document.getElementById("discountedPolicyType");
			 selectObj.options.length = 0; 
         	$("#taxClassificationCode",parent.document).val(item.mergeCoding);
         	$("#itemName",parent.document).val(item.goodsName);
             var addedTaxSpecialString = item.addedTaxSpecial;
             var addedTaxSpecialList= new Array(); //定义一数组 
            if(addedTaxSpecialString!=null&&addedTaxSpecialString!=""){
               addedTaxSpecialList=addedTaxSpecialString.split(/,|，/); //字符分割  
             }
             for(var i=0;i<addedTaxSpecialList.length;i++){
            	selectObj.options.add(new Option(addedTaxSpecialList[i],addedTaxSpecialList[i]));
             }
             if(addedTaxSpecialList.length==0){
           	 $("#discounted",parent.document).val("N");
           	 $("#discounted",parent.document).attr("disabled",true);
           	 $("#discountedPolicyType",parent.document).append("<option value=''></option>");
           	$("#discountedPolicyType",parent.document).val();
           	$("#discountedPolicyType option[value='']",parent.document).remove();
            }else{
           	$("#discounted",parent.document).val("Y");
           	$("#discounted",parent.document).attr("disabled",false);
            }
             var select = parent.document.getElementById('discounted');
//            var rateobject=parent.document.getElementById("taxRate");
//            rateobject.options.length = 0; 
            var taxRateDescString = item.taxRateDesc;
            var taxRateDescList= new Array(); //定义一数组 
	           if(taxRateDescString!=null&&taxRateDescString!=""){
	            	taxRateDescList=taxRateDescString.split(/,|，/); //字符分割  
	           }
	           
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
		   	       							var selectTax=parent.document.getElementById("taxRate");
		   	       							if(selectTax!=null){
		   	       								for(var i=0;i<selectTax.options.length;i++ ){
		   	       									if(item.taxRateDesc==selectTax.options[i].text){
		   	       										$("#taxRate",parent.document).val(selectTax.options[i].value);
		   	       										break;
		   	       									}
		   	       								}
		   	       							}
		   	       						 }
		   	       						 else{
		   	       							 //一般纳税人
		   	       							 var raxRates = data.data.list[1].taxRates;
		   	       							 var selectTax=parent.document.getElementById("taxRate");
		   	       							 if(selectTax!=null){
		   	       								for(var i=0;i<selectTax.options.length;i++ ){
		   	       									if(item.taxRateDesc==selectTax.options[i].text){
//		   	       										$("#taxRate",parent.document).find('option[text="13%"]',parent.document).attr("selected",true);
		   	       										$("#taxRate",parent.document).val(selectTax.options[i].value);
		   	       										break;
		   	       									}
		   	       								}
		   	       							 } 
		   	       						 }
		   	       					 }
		   	       					  
		   	       				  }
		   	       				parent.layer.closeAll();
		       					}
		       				})
		       			}
		       		}
	       		}
	       	})
       	}  	
      //判断对象是否为空
    	function judgeNull(str){
    		if(str==null){
    			str="";
    		}
    		return str;
    	}