$(function() {
	 
		var validator1 = $("#addAlipayForm").validate({
			//光标离开时校验
			onfocusout:function(element){
				$(element).removeData();
				$(element).valid();
			},
			//获取到焦点时去除错误提示信息
			onfocusin:function(element){
				//console.info(this.settings.focusCleanup); //如果0000000000000为true,则删除错误提示信息
				if(this.settings.focusCleanup){
					$("#"+$(element).attr("id")+"_tip").text("");
					$("#"+$(element).attr("id")+"_tip").parent().removeClass("error");
				}
			},
			focusCleanup:true, //clear the error message when the error element get focus again.
			onkeyup:false,
			highlight: function(element, errorClass){
				$(element).fadeOut(function() {  
					$(element).fadeIn();
				});
			},
			errorPlacement: function(error, element) {
				//element是form表单中出错的元素的jquery对象
				$("#"+element.attr("id")+"_tip").text(error.text());
				$("#"+element.attr("id")+"_tip").parent().addClass("error");
			},
			rules:{
				merchantId:{
					required: true,
					rangelength:[1,50],
					amountReg:true,
					remote:function(){
			        		return {url:basePath+"authorizationManager/checkAlipayId"+suffix + '?t=' + Date.parse(new Date()),type:"post"};
			        	},
				},
				merchantId1:{
					required: true,
			        equalTo: "#merchantId"
			    },
			    mName:{
			        rangelength:[1,64],
			        mNameReg:true
			    },
			    subMName:{
			    	rangelength:[1,64],
			    	subMNameReg:true
			    }
			    
			},
			messages: {
				merchantId:{
			        required: "商户标识不能为空",
			        rangelength:"商户标识不正确",
			        remote: "该商户标识已被使用"
			    },
			    merchantId1:{
			    	required: "商户标识不能为空",
			    	equalTo:"两次商户标识输入不一致",
			    },
			    mName:{
			        rangelength:"品牌全称过长",
			    },
			    subMName:{
			    	rangelength:"商户门店全称过长"
			    }
			    
			}
		});
		
});

$.validator.addMethod('amountReg', function(value, element) { 
	return this.optional(element) || /^[a-zA-Z0-9.@]+$/.test(value);
},"请输入正确的商户标识");
$.validator.addMethod('mNameReg', function(value, element) { 
	return this.optional(element) || /^[a-zA-Z0-9\u0391-\uFFE5]+$/.test(value);
},"中文字母数字");

$.validator.addMethod('subMNameReg', function(value, element) { 
	return this.optional(element) || /^[a-zA-Z0-9\u0391-\uFFE5]+$/.test(value);
},"中文字母数字");



//新增绑定
function alipayAuthorization(){
	if($("#addAlipayForm").valid()){ //表单校验通过
		$http.post(basePath+"authorizationManager/alipay"+suffix,
				{
					merchantId:$("#merchantId").val().trim(),
					mName:$("#mName").val().trim(),
					subMName:$("#subMName").val().trim(),
				},
				function(data) {
					console.info(data);
					if(data.code=="200"||data.code=="201"){
						layer.closeAll();
						alertSuccess();
						queryAlipayssByIndex(1);
					}else if(data.code=="500"){
						layer.closeAll();
						alertSuccess();
					}else if(data.code=="501"){
						layer.closeAll();
						alertSuccess();
					}
		});
	}
}


//每页展示条数
var pageSize = 10;
function queryAlipayssByIndex(currentPage){
	$http.get(basePath+"authorizationManager/getAlipays"+suffix,
			{
				pageIndex : currentPage,
				pageSize : pageSize,
			},
			function(data) {
				if("200"==data.code){
					var json = JSON.parse(data.data.data);
					var rows = json.rows;
					var total = json.total;
					count = rows.length;
					if( rows.length > 0){
						$("#alipays_query").empty();
						Array.prototype.forEach.call(rows,function(item,index,array) {
							var number = pageSize*(currentPage-1)+index+1;
			                var rechargeRecord = new RechargeRecord(item,number);
			                var str = rechargeRecord.fillListData();
			                $("#alipays_query").append(str);
			            })
						var pageCount = Math.floor((total-1)/pageSize)+1;
						PageWrapper.page($("#page1"),total,currentPage,queryAlipayssByIndex);
				    	switchCheck(true);
					}else {
						$("#alipays_query").empty();
						$("#alipays_query").html("<td colspan='6' style='text-align: center;'>暂无数据</td>");
						$("#page1").empty();
				    	switchCheck(false);
					}
				}

			});
}


function unbind(id){
	layer.confirm("<p style='font-size:18px;margin-top: 20px;font-weight: 600;'><i class=\"layui-layer-ico layui-layer-ico0\" style='background: url(../../../images/warning.jpg) no-repeat;width: 50px;height: 37px;position:static;vertical-align: middle;'></i>确定要删除该商品吗？</p><p style='font-size:14px;'>解除绑定后，付款到该支付宝账号的消费者将无法自行开票</p>", {
		icon: -1, title:['&nbsp;'],btn: ['确 定','取 消'],btnAlign: 'c',area: 'auto',maxWidth:450 //按钮
	}, function(){
		$http.post(basePath+"authorizationManager/delAlipay"+suffix,
				{
					merchantId:id
				},
				function(data) {
					console.info(data);
					if(data.code=="200"||data.code=="201"){
						layer.closeAll();
//						alertSuccess();
						queryAlipayssByIndex(1);
					}else if(data.code=="500"){
						layer.closeAll();
//						alertSuccess();
					}else if(data.code=="501"){
						layer.closeAll();
//						alertSuccess();
					}
		});
		
		layer.closeAll();
	}, function(){
		layer.close();
  });
}
