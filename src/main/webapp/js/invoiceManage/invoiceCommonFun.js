/**
 * Created by liuyong on 2017/7/20.
 * 发票页面公用函数
 * @author liuyong
 */
//数字长度过长以tips形式展示
function tipVal(obj){
	var numberVal = $(obj).val();
	var id = $(obj).attr("id");
	if(numberVal && numberVal.length > 11){
		layer.tips(numberVal,"#"+id+"",{tips:[1,'green']});
	}
}

//判断商品信息是否完善
function checkProInfo(id){
	var productName = $.trim($("#productName"+id+"").val());
	var specificationModel = $.trim($("#specificationModel"+id+"").val());
	var meteringUnit = $.trim($("#meteringUnit"+id+"").val());
	var totalPrice = $.trim($("#totalPrice"+id+"").val());
	var quantity = $.trim($("#quantity"+id+"").val());
	var price = $.trim($("#price"+id+"").val());
	if(specificationModel.length > 0 && meteringUnit.length > 0){
		if(one2HundredStrRegex.test(productName) && twoPosiDecRegex.test(totalPrice) && parseFloat(totalPrice) > parseFloat(0) && 
				eightDecRegex.test(quantity) && parseFloat(quantity) > parseFloat(0) && 
				eightDecRegex.test(price) && parseFloat(price) > parseFloat(0) && 
				one2TwentyStrRegex.test(specificationModel) && one2SixteenStrRegex.test(meteringUnit)){
			return true;
		}else{
			return false;
		}
	}else if(specificationModel.length > 0 && meteringUnit.length <= 0){
		if(one2HundredStrRegex.test(productName) && twoPosiDecRegex.test(totalPrice) && parseFloat(totalPrice) > parseFloat(0) && 
				eightDecRegex.test(quantity) && parseFloat(quantity) > parseFloat(0) && 
				eightDecRegex.test(price) && parseFloat(price) > parseFloat(0) && 
				one2TwentyStrRegex.test(specificationModel)){
			return true;
		}else{
			return false;
		}
	}else if(specificationModel.length <= 0 && meteringUnit.length > 0){
		if(one2HundredStrRegex.test(productName) && twoPosiDecRegex.test(totalPrice) && parseFloat(totalPrice) > parseFloat(0) && 
				eightDecRegex.test(quantity) && parseFloat(quantity) > parseFloat(0) && 
				eightDecRegex.test(price) && parseFloat(price) > parseFloat(0) && 
				one2SixteenStrRegex.test(meteringUnit)){
			return true;
		}else{
			return false;
		}
	}else{
		if(one2HundredStrRegex.test(productName) && twoPosiDecRegex.test(totalPrice) && parseFloat(totalPrice) > parseFloat(0) && 
				eightDecRegex.test(quantity) && parseFloat(quantity) > parseFloat(0) && 
				eightDecRegex.test(price) && parseFloat(price) > parseFloat(0)){
			return true;
		}else{
			return false;
		}
	}
}

function checkInt(param){
	  var zeroToOneReg = /^[0-9]+(.[0-9]{0,1})?$/; 
	  var twoToSevReg = /^[0-9]+(.[0-9]{2,7})?$/; 
	  var eigthtToMoreReg = /^[0-9]+(.[0-9]{8,})$/;
	  if(math.isInteger(param)){
		  param = parseFloat(param).toFixed(2);
		  return param;
	  }
      if(zeroToOneReg.test(param)){
          param = math.round(param,2);
      }else if(twoToSevReg.test(param)){
      
      }else if(eigthtToMoreReg.test(param)){
          param = math.round(param,8);
      }
	  return param;
}

/**
 * 为table指定行添加一行
 * tab 表id
 * row 行数，如：0->第一行 1->第二行 -2->倒数第二行 -1->最后一行
 * trHtml 添加行的html代码
 */
function addTr(tab, row, trHtml){
   var $tr=$("#"+tab+" tr").eq(row);
   if($tr.size()==0){
	   layer.msg('指定的table id或行数不存在！', {icon:2,time:2000}, function(){
			 //do something
		});
      return;
   }
   $tr.after(trHtml);
}

//客户信息模态框
function cusTanchu(){
	layer.open({
	  type: 2,
		skin:'black-lay',
	  title: "选择客户信息",
	  area: ['80%', '90%'],
	  offset: ['10px', '100px'],
	  shadeClose: true, //开启遮罩关闭
	  shade: [0.8, '#393D49'],
	  scrollbar:true,
	  content: ['../invoiceManage/choiceCustomer.shtml','no']
	});
}

var proIndex = "";
//商品信息模态框
function proTanchu(index){
	var discId = $("#"+index+"_1");
	if(discId.length != 0){
		layer.msg('该商品已打折，请重新选择',{icon:2,time:2000},function(){
			 //do something
		});
	}else{
		proIndex = index;
		layer.open({
		  type: 2,
		  title: "选择商品信息",
		  skin:"black-lay",
		  area: ['80%','90%'],
		  offset: ['10px','100px'],
		  shadeClose: true, //开启遮罩关闭
		  shade: [0.8, '#393D49'],
		  content: ['../invoiceManage/choiceProduct.shtml','no']
		});
	}
}

//税收分类模态框
function taxTanchu(index){
	var discId = $("#"+index+"_1");
	if(discId.length != 0){
		layer.msg('该商品已打折，请重新选择',{icon:2,time:2000},function(){
			 //do something
		});
	}else{
		proIndex = index;
		layer.open({
		  type: 2,
		  title: "税收分类编码表",
		  area: ['80%','90%'],
		  skin:"black-lay ",
		  scrollbar:true,
		  offset: ['10px','100px'],
		  shadeClose: true, //开启遮罩关闭
		  shade: [0.8, '#393D49'],
		  content: ['../invoiceManage/choiceTaxCategory.shtml','no'],
		  end:function(){
			}
		});
	}
}

//查询税率列表
function getTaxRates(){
	$.ajax({
		type:"GET",
		url:basePath+"manage/taxrate/getTaxRatesByRegInfoId"+suffix,
		dataType:"json",
		success:function(data){
			if(data.code==200){
				var rows = data.data.data;
				if(rows.length > 0){
					raxRates = rows;
					var selectObj=document.getElementById("taxRate1");
					for(var i=0;i<rows.length;i++){
						//将0%强制转换成0.00
						var taxRateValueStr = rows[i].taxRateValue;
						if(rows[i].frontName == "0%"){
							taxRateValueStr = taxRateValueStr.toFixed(2);
						}
						selectObj.options.add(new Option(rows[i].frontName,taxRateValueStr));
		             }
				}else{
					$("#failMsg").text("请先进行开票设置");
					var dakai = layer.open({
						  title : false,
						  type: 1, 
						  closeBtn: 0, //不显示关闭按钮
						  shadeClose: true, //开启遮罩关闭
						  content: $("#failModal")
					});
					window.parent.addTab('开票设置','/pages/manage/invoicesettings/invoiceSettings.shtml','icon-s7');	
					window.parent.closeCurrTab('电子发票开具');
				}
			}
		}
	})
}

//填充销售方信息
function fillSellerInfo(){
	$.ajax({
		url:basePath+"invoiceQuery/queryClerkResInfo"+suffix,
		data:{},
		type:"get",
		success:function(data){
			if("200"==data.code){
				var item = data.data.item;
				$("#xsfMc").val($Utils.handleUndefined(item.xsfMc));
				$("#xsfNsrsbh").val($Utils.handleUndefined(item.xsfNsrsbh));
				$("#skr").val($Utils.handleUndefined(item.clerkName));
				$("#kpr").val($Utils.handleUndefined(item.clerkName));
		        var xsfDzdh = item.xsfDzdh.replace(/\|/g,"");
		        $("#xsfDzdh").val($Utils.handleUndefined(xsfDzdh));
		        $("#xsfdh").val($Utils.handleUndefined(item.xsfdh));
		        $("#xsfKhh").val($Utils.handleUndefined(item.xsfKhh));
		        $("#xsfYhzh").val($Utils.handleUndefined(item.xsfYhzh));
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			layer.alert('系统繁忙,请稍候再试',{icon:2}, function(){
        		layer.closeAll();
			});  
	    }
	})
}

//复核人取值
function getFhrVal(){
	var fhr = CookieObj.getCookie("fhr");
	if(fhr){
		$("#fhr").val(fhr);
	}
}

//在线提示
function onlineFun(){
	if(onlineNum == 1) {
		
	}else{
		layer.tips(onlineStr + "在线","#onlineId",{tips:[1,'#76EE00']});
	}
}
//离线提示
function offlineFun(){
	var infoPlatform = $("#infoPlatform",window.top.document).val();
	if(infoPlatform == 5){
		if(offlineNum == 1) {
			layer.tips("请检查发票儿盒子是否接通网络，是否正常连接电源，如上述方法未能解决问题，请致电010-56189071联系我们的客服人员","#offlineId",{tips:[1,'#FF0000']});
		}else{
			layer.tips(offlineStr + "离线<br>请检查发票儿盒子是否接通网络，是否正常连接电源，如上述方法未能解决问题，请致电010-56189071联系我们的客服人员","#offlineId",{tips:[1,'#FF0000']});
		}
	}else{
		if(offlineNum == 1) {
			layer.tips("请检查票通宝设备是否接通网络，是否正常连接电源，如上述方法未能解决问题，请致电010-56189071联系我们的客服人员","#offlineId",{tips:[1,'#FF0000']});
		}else{
			layer.tips(offlineStr + "离线<br>请检查票通宝设备是否接通网络，是否正常连接电源，如上述方法未能解决问题，请致电010-56189071联系我们的客服人员","#offlineId",{tips:[1,'#FF0000']});
		}
	}
}

