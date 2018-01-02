/**
 * Created by liuyong on 2017/7/18.
 * 发票页面计算函数
 * @author liuyong
 */
//计算函数
//光标离开数量时进行相应计算
function countQuPrSeByQu(index){
	var quantity = $("#quantity"+index+"").val();
	var price = $("#price"+index+"").val();
	var totalPrice = $("#totalPrice"+index+"").val();
	if(quantity != '' && eightDecRegex.test(quantity) && parseFloat(quantity) > parseFloat(0)){
		if(price == '' && totalPrice == ''){
			
		}else if(price != '' && totalPrice == ''){
			if(eightDecRegex.test(price) && parseFloat(price) > parseFloat(0)){
				totalPrice = math.multiply(math.bignumber(quantity),math.bignumber(price));
				if(twoPosiDecRegex.test(totalPrice)){
					$("#price"+index+"").val(checkInt(""+price+""));
					$("#quantity"+index+"").val(checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(totalPrice);
					countSePrice(index);
				}else{
					$("#price"+index+"").val(checkInt(""+price+""));
					$("#quantity"+index+"").val(checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(totalPrice);
					layer.tips("商品金额过大，请检查当前商品行的单价或数量","#totalPrice"+index+"",{tips:[1,'red']});
				}
			}else{
				layer.tips("请输入小数点前后不超过8位的正数","#price"+index+"",{tips:[1,'red']});
			}
		}else if(price == '' && totalPrice != ''){
			if(twoPosiDecRegex.test(totalPrice) && parseFloat(totalPrice) > parseFloat(0)){
				price = math.divide(math.bignumber(totalPrice),math.bignumber(quantity));
				price = checkInt(""+price+"");
				if(eightDecRegex.test(price)){
					$("#price"+index+"").val(price);
					$("#quantity"+index+"").val(checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(totalPrice);
					countSePrice(index);
				}else{
					$("#price"+index+"").val(price);
					$("#quantity"+index+"").val(checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(totalPrice);
					layer.tips("单价位数过长，请检查当前商品行的数量或金额","#price"+index+"",{tips:[1,'red']});
				}
			}else{
				layer.tips("请输入不超过8位的正数，可保留2位小数","#totalPrice"+index+"",{tips:[1,'red']});
			}
		}else{
			if(eightDecRegex.test(price) && parseFloat(price) > parseFloat(0)){
				totalPrice = math.multiply(math.bignumber(quantity),math.bignumber(price));
				$("#price"+index+"").val(checkInt(""+price+""));
				$("#quantity"+index+"").val(checkInt(""+quantity+""));
				$("#totalPrice"+index+"").val(totalPrice);
				countSePrice(index);
			}else{
				layer.tips("请输入小数点前后不超过8位的正数","#price"+index+"",{tips:[1,'red']});
			}
		}
	}else{
		layer.tips("请输入小数点前后不超过8位的正数","#quantity"+index+"",{tips:[1,'red']});
	}
}

//光标离开单价时进行相应计算
function countQuPrSeByPr(index){
	var quantity = $("#quantity"+index+"").val();
	var price = $("#price"+index+"").val();
	var totalPrice = $("#totalPrice"+index+"").val();
	if(price != '' && eightDecRegex.test(price) && parseFloat(price) > parseFloat(0)){
		if(quantity == '' && totalPrice == ''){
			
		}else if(quantity != '' && totalPrice == ''){
			if(eightDecRegex.test(quantity) && parseFloat(quantity) > parseFloat(0)){
				totalPrice = math.multiply(math.bignumber(quantity),math.bignumber(price));
				$("#price"+index+"").val(checkInt(""+price+""));
				$("#quantity"+index+"").val(checkInt(""+quantity+""));
				$("#totalPrice"+index+"").val(totalPrice);
				countSePrice(index);
			}else{
				layer.tips("请输入小数点前后不超过8位的正数","#quantity"+index+"",{tips:[1,'red']});
			}
		}else if(quantity == '' && totalPrice != ''){
			if(twoPosiDecRegex.test(totalPrice) && parseFloat(totalPrice) > parseFloat(0)){
				quantity = math.divide(math.bignumber(totalPrice),math.bignumber(price));
				quantity = checkInt(""+quantity+"");
				if(eightDecRegex.test(quantity)){
					$("#price"+index+"").val(checkInt(""+price+""));
					$("#quantity"+index+"").val(quantity);
					$("#totalPrice"+index+"").val(totalPrice);
					countSePrice(index);
				}else{
					$("#price"+index+"").val(checkInt(""+price+""));
					$("#quantity"+index+"").val(quantity);
					$("#totalPrice"+index+"").val(totalPrice);
					layer.tips("数量位数过长，请检查当前商品行的单价或数量","#quantity"+index+"",{tips:[1,'red']});
				}
			}else{
				layer.tips("请输入不超过8位的正数，可保留2位小数","#totalPrice"+index+"",{tips:[1,'red']});
			}
		}else{
			if(eightDecRegex.test(quantity) && parseFloat(quantity) > parseFloat(0)){
				totalPrice = math.multiply(math.bignumber(quantity),math.bignumber(price));
				$("#price"+index+"").val(checkInt(""+price+""));
				$("#quantity"+index+"").val(checkInt(""+quantity+""));
				$("#totalPrice"+index+"").val(totalPrice);
				countSePrice(index);
			}else{
				layer.tips("请输入小数点前后不超过8位的正数","#quantity"+index+"",{tips:[1,'red']});
			}
		}
	}else{
		layer.tips("单价为小数点前后不超过8位的正数","#price"+index+"",{tips:[1,'red']});
	}
}

//鼠标离开金额后进行相应计算
function countQuPrSeByTotal(index){
	var quantity = $("#quantity"+index+"").val();
	var price = $("#price"+index+"").val();
	var totalPrice = $("#totalPrice"+index+"").val();
	if(totalPrice != '' && twoPosiDecRegex.test(totalPrice) && parseFloat(totalPrice) > parseFloat(0)){
		if(quantity == '' && price == ''){
//			countSePrice(index);
		}else if(quantity == '' && price != ''){
			if(eightDecRegex.test(price) && parseFloat(price) > parseFloat(0)){
				quantity = math.divide(math.bignumber(totalPrice),math.bignumber(price));
				quantity = checkInt(""+quantity+"");
				if(eightDecRegex.test(quantity)){
					$("#price"+index+"").val(checkInt(""+price+""));
					$("#quantity"+index+"").val();
					$("#totalPrice"+index+"").val(totalPrice);
					countSePrice(index);
				}else{
					$("#price"+index+"").val(checkInt(""+price+""));
					$("#quantity"+index+"").val(quantity);
					$("#totalPrice"+index+"").val(totalPrice);
					layer.tips("数量位数过长，请检查当前商品行的单价或数量","#quantity"+index+"",{tips:[1,'red']});
				}
			}else{
				layer.tips("请输入小数点前后不超过8位的正数","#price"+index+"",{tips:[1,'red']});
			}
		}else if(quantity != '' && price == ''){
			if(eightDecRegex.test(quantity) && parseFloat(quantity) > parseFloat(0)){
				price = math.divide(math.bignumber(totalPrice),math.bignumber(quantity));
				price = checkInt(""+price+"");
				if(eightDecRegex.test(price)){
					$("#price"+index+"").val(price);
					$("#quantity"+index+"").val(checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(totalPrice);
					countSePrice(index);
				}else{
					$("#price"+index+"").val(price);
					$("#quantity"+index+"").val(checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(totalPrice);
					layer.tips("单价位数过长，请检查当前商品行的数量或金额","#price"+index+"",{tips:[1,'red']});
				}
			}else{
				layer.tips("请输入小数点前后不超过8位的正数","#quantity"+index+"",{tips:[1,'red']});
			}
		}else{
			if(eightDecRegex.test(quantity) && parseFloat(quantity) > parseFloat(0)){
				price = math.divide(math.bignumber(totalPrice),math.bignumber(quantity));
				price = checkInt(""+price+"");
				if(eightDecRegex.test(price)){
					$("#price"+index+"").val(price);
					$("#quantity"+index+"").val(checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(totalPrice);
					countSePrice(index);
				}else{
					$("#price"+index+"").val(price);
					$("#quantity"+index+"").val(checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(totalPrice);
					layer.tips("单价位数过长，请检查当前商品行的数量或金额","#price"+index+"",{tips:[1,'red']});
				}
			}else{
				layer.tips("请输入小数点前后不超过8位的正数","#quantity"+index+"",{tips:[1,'red']});
			}
		}
	}else{
		layer.tips("请输入不超过8位的正数，可保留2位小数","#totalPrice"+index+"",{tips:[1,'red']});
	}
}

//计算商品税额
function countSePrice(index){
	var countPrice = $("#totalPrice"+index+"").val();
	if(countPrice == ''){
		
	}else{
		var sePrice = 0;
		var taxRate = $("#taxRate"+index+" option:selected").val();
		if(0 == hsbz || "0" == hsbz){
			var quantity = $("#quantity"+index+"").val();
			var price = $("#price"+index+"").val();
			var totalPrice = math.multiply(math.bignumber(quantity),math.bignumber(price));
			if(taxRate){
				sePrice = math.multiply(math.bignumber(totalPrice),math.bignumber(taxRate));
			}
		}else if(1 == hsbz || "1" == hsbz){
			//换算为不含税金额
			if(!taxRate){
				return;
			}
			var totalTaxVal = math.add(math.bignumber(taxRate),math.bignumber(1));
			var totalPrice = math.divide(math.bignumber(countPrice),math.bignumber(totalTaxVal));
			//计算税额
			sePrice = math.multiply(math.bignumber(totalPrice),math.bignumber(taxRate));
		}
		$("#totalPrice"+index+"").val(parseFloat(countPrice).toFixed(2));
		$("#sePrice"+index+"").val(sePrice.toFixed(2));
		countAllPrice();
	}
}

//计算总金额,总税额,价税合计
function countAllPrice(){
	/*//商品总金额
	var allCountPrice = 0;
	//商品总税额
	var allSePrice = 0;
	//获取所有单价数量
	var ckbs=$("input[name=checkTr]");
	ckbs.each(function(){
		 var id = $(this).parent().parent().attr("id");
		 if(id.indexOf("_") == -1){
			 var quantity = $("#quantity"+id+"").val();
			 var price = $("#price"+id+"").val();
			 var totalPrice = math.multiply(quantity,price);
			 var taxRate = $("#taxRate"+index+" option:selected").val();
			 allCountPrice = math.add(allCountPrice,totalPrice);
			 var sePrice = 0;
			 if(0 == hsbz || "0" == hsbz){
				sePrice = math.multiply(totalPrice,taxRate);
			 }else if(1 == hsbz || "1" == hsbz){
				//换算为不含税金额
				var totalTaxVal = math.add(taxRate,1);
				var totalPriceFlag = math.divide(totalPrice,totalTaxVal);
				//计算税额
				sePrice = math.multiply(totalPriceFlag,taxRate);
			 }
			 allSePrice = math.add(allSePrice,sePrice);
		 }else{
			 var totalPrice = $("#totalPrice"+id+"").val();
			 var sePrice = $("#sePrice"+id+"").val();
			 allCountPrice = math.add(allCountPrice,totalPrice);
			 allSePrice = math.add(allSePrice,sePrice);
		 }
	});
	if(0 == hsbz || "0" == hsbz){
		var allPrice = math.add(allCountPrice,allSePrice);
	}else if(1 == hsbz || "1" == hsbz){
		var allPrice = allCountPrice;
	}
	allCountPrice = allCountPrice.toFixed(2);
	allSePrice = allSePrice.toFixed(2);
	allPrice = allPrice.toFixed(2);
	if(twoPosiDecRegex.test(allCountPrice) && twoPosiDecRegex.test(allSePrice)){
		if(twoPosiDecRegex.test(allPrice)){
			$("#hjje").val(allCountPrice);
			$("#hjse").val(allSePrice);
			$("#jshjxx").val(allPrice);
			$("#jshjdx").val($Utils.convertMoneyToChinese(allPrice));
		}else{
			$("#hjje").val(allCountPrice);
			$("#hjse").val(allSePrice);
			$("#jshjxx").val(allPrice);
			$("#jshjdx").val($Utils.convertMoneyToChinese(allPrice));
			layer.tips("价税合计金额过大，请检查输入的商品行信息","#jshjxx",{tips:[1,'red']});
		}
	}else if(!twoPosiDecRegex.test(allCountPrice) || !twoPosiDecRegex.test(allSePrice)){
		$("#hjje").val(allCountPrice);
		$("#hjse").val(allSePrice);
		layer.tips("合计金额过大，请检查输入的商品行信息","#hjje",{tips:[1,'red']});
	}*/
	
	
	//计算所有商品金额
	var priceInputs = $("input[name=totalPrice]");
	var allCountPrice = 0;
	var allSePrice = 0;
	var allPrice = 0;
	priceInputs.each(function(){
		if(!isNaN($(this).val()) && $(this).val() != null && $(this).val() != ""){
			allCountPrice = math.add(math.bignumber(allCountPrice),math.bignumber($(this).val()));
		}
	});
	//计算所有商品税额
	var sePriceInputs = $("input[name=sePrice]");
	sePriceInputs.each(function(){
		if(!isNaN($(this).val()) && $(this).val() != null && $(this).val() != ""){
			allSePrice = math.add(math.bignumber(allSePrice),math.bignumber($(this).val()));
		}
	});
	if(0 == hsbz || "0" == hsbz){
		allPrice = math.add(math.bignumber(allCountPrice),math.bignumber(allSePrice));
	}else if(1 == hsbz || "1" == hsbz){
		allPrice = allCountPrice;
	}
	allCountPrice = allCountPrice.toFixed(2);
	allSePrice = allSePrice.toFixed(2);
	allPrice = allPrice.toFixed(2);
	if(twoPosiDecRegex.test(allCountPrice) && twoPosiDecRegex.test(allSePrice)){
		if(twoPosiDecRegex.test(allPrice)){
			$("#hjje").val(allCountPrice);
			$("#hjse").val(allSePrice);
			$("#jshjxx").val(allPrice);
			$("#jshjdx").val($Utils.convertMoneyToChinese(allPrice));
		}else{
			$("#hjje").val(allCountPrice);
			$("#hjse").val(allSePrice);
			$("#jshjxx").val(allPrice);
			$("#jshjdx").val($Utils.convertMoneyToChinese(allPrice));
			layer.tips("价税合计金额过大，请检查输入的商品行信息","#jshjxx",{tips:[1,'red']});
		}
	}else if(!twoPosiDecRegex.test(allCountPrice) || !twoPosiDecRegex.test(allSePrice)){
		$("#hjje").val(allCountPrice);
		$("#hjse").val(allSePrice);
		layer.tips("合计金额过大，请检查输入的商品行信息","#hjje",{tips:[1,'red']});
	}
}

//含税不含税
function taxOrNoTax(){
	var radioId = $('input:radio[name="taxOrNoTax"]:checked').attr("id");
	// if("含税" == $("#taxOrNoTaxEle").text()){
	if(radioId == "hasTax"){
		hsbz = 1;
		$("#priceText").text("单价(含税)");
		$("#moneyText").text("金额(含税)");
		//获取所有商品行单价
		//根据不含税单价推算含税单价 不含税单价*(1+税率)=含税单价
		//获取所有商品行单价
		var proTrs = $("input[id^='price']");
		proTrs.each(function(){
			//获取当前行id
			var id = $(this).parent().parent().attr("id");
			//获取税率
			var taxVal = $("#taxRate"+id+" option:selected").val();
			var totalTaxVal = math.add(math.bignumber(taxVal),math.bignumber(1));
			//获取单价
			var noTaxPrice = $(this).val();
			if(noTaxPrice){
				//换算为含税单价
				var taxPrice = math.multiply(math.bignumber(noTaxPrice),math.bignumber(totalTaxVal));
				$(this).val(checkInt(taxPrice));
//				var quantity = $("#quantity"+id+"").val();
//				var totalPrice = math.multiply(noTaxPrice,quantity);
				var totalPrice = $("#totalPrice"+id+"").val();
				var sePrice = $("#sePrice"+id+"").val();
				totalPrice = math.add(math.bignumber(totalPrice),math.bignumber(sePrice));
				$("#totalPrice"+id+"").val(totalPrice.toFixed(2));
                //countQuPrSeByPr(id);
				//判断是否有折扣行
				var discId = $("#"+id+"_1");
				if(discId.length != 0){
					//如果有折扣行进行相应处理
					var discTotalPrice = $("#totalPrice"+id+"_1").val();
					var discSePrice = $("#sePrice"+id+"_1").val();
					var taxProJeVal = math.add(math.bignumber(discTotalPrice),math.bignumber(discSePrice));
					$("#totalPrice"+id+"_1").val(taxProJeVal);
					/*var discVal = $("#taxRateValue"+id+"_1").text();
					var proJeVal = $("#totalPrice"+id+"").val();
					var dicJeVal = math.multiply(math.bignumber(proJeVal),math.bignumber(discVal));
					dicJeVal = math.divide(math.bignumber(dicJeVal),math.bignumber(100));
					//换算为不含税金额,计算税额
					var totalTaxVal = math.add(math.bignumber(taxVal),math.bignumber(1));
					var noTaxProJeVal = math.divide(math.bignumber(proJeVal),math.bignumber(totalTaxVal));
					var noTaxDicJeVal = math.multiply(math.bignumber(noTaxProJeVal),math.bignumber(discVal));
					noTaxDicJeVal = math.divide(math.bignumber(noTaxDicJeVal),math.bignumber(100));
					var dicSeVal = math.multiply(math.bignumber(noTaxDicJeVal),math.bignumber(taxVal));
					dicJeVal = dicJeVal.toFixed(2)
					dicJeVal = math.multiply(math.bignumber(dicJeVal),math.bignumber(-1));
					dicSeVal = dicSeVal.toFixed(2);
					dicSeVal = math.multiply(math.bignumber(dicSeVal),math.bignumber(-1));
					$("#totalPrice"+id+"_1").val(dicJeVal);
					$("#sePrice"+id+"_1").val(dicSeVal);*/
				}
				countAllPrice();
			}
		});
	}else{
		$("#priceText").text("单价(不含税)");
		$("#moneyText").text("金额(不含税)");
		hsbz = 0;
		//获取所有商品行单价
		//根据含税单价推算不含税单价 含税单价/(1+税率)=不含税单价
		//获取所有商品行单价
		var proTrs = $("input[id^='price']");
		proTrs.each(function(){
			//获取当前行id
			var id = $(this).parent().parent().attr("id");
			//获取税率
			var taxVal = $("#taxRate"+id+" option:selected").val();
			var totalTaxVal = math.add(math.bignumber(taxVal),math.bignumber(1));
			//获取单价
			var noTaxPrice = $(this).val();
			if(noTaxPrice){
				//换算为含税单价
				var taxPrice = math.divide(math.bignumber(noTaxPrice),math.bignumber(totalTaxVal));
				$(this).val(checkInt(taxPrice));
//				var quantity = $("#quantity"+id+"").val();
//				var totalPrice = math.multiply(noTaxPrice,quantity);
				var totalPrice = $("#totalPrice"+id+"").val();
				var sePrice = $("#sePrice"+id+"").val();
				totalPrice = math.subtract(math.bignumber(totalPrice),math.bignumber(sePrice));
				$("#totalPrice"+id+"").val(totalPrice.toFixed(2));
				//countQuPrSeByPr(id);
				//判断是否有折扣行
				var discId = $("#"+id+"_1");
				if(discId.length != 0){
					//如果有折扣行进行相应处理
					var discTotalPrice = $("#totalPrice"+id+"_1").val();
					var discSePrice = $("#sePrice"+id+"_1").val();
					var noTaxProJeVal = math.subtract(math.bignumber(discTotalPrice),math.bignumber(discSePrice));
					$("#totalPrice"+id+"_1").val(noTaxProJeVal);
					/*var discVal = $("#taxRateValue"+id+"_1").text();
					var proJeVal = $("#totalPrice"+id+"").val();
					var dicJeVal = math.multiply(math.bignumber(proJeVal),math.bignumber(discVal));
					dicJeVal = math.divide(math.bignumber(dicJeVal),math.bignumber(100));
					dicJeVal = dicJeVal.toFixed(2);
					var dicSeVal = math.multiply(math.bignumber(dicJeVal),math.bignumber(taxVal));
					dicJeVal = math.multiply(math.bignumber(dicJeVal),math.bignumber(-1));
					dicSeVal = dicSeVal.toFixed(2);
					dicSeVal = math.multiply(math.bignumber(dicSeVal),math.bignumber(-1));
					$("#totalPrice"+id+"_1").val(dicJeVal);
					$("#sePrice"+id+"_1").val(dicSeVal);*/
				}
				countAllPrice();
			}
		});
	}
}

//差额页面含税不含税
function taxOrNoTaxCe(){
	var radioId = $('input:radio[name="taxOrNoTax"]:checked').attr("id");
	//获取价税合计
	var jshj = $("#jshjxx").val();
	//获取扣除额
	var balanceTotal = $("#balanceTotalHid").val();
	if(radioId == "hasTax"){
		hsbz = 1;
		$("#priceText").text("单价(含税)");
		$("#moneyText").text("金额(含税)");
		//获取所有商品行
		var proTrs = $("input[id^='price']");
		proTrs.each(function(){
			//获取当前行id
			var id = $(this).parent().parent().attr("id");
			var taxRate = $("#taxRate"+id+" option:selected").val();
			if(!taxRate){
				return;
			}
			var totalTaxVal = math.add(taxRate,1);
			if(!jshj || jshj == '0.00'){
				return;
			}
			//计算含税金额
			var quantity = $("#quantity"+id+"").val();
			var price = $("#price"+id+"").val();
			var noTaxJe = math.multiply(quantity,price);
			var ce = math.subtract(noTaxJe,balanceTotal);
			var temVal = math.multiply(ce,totalTaxVal);
			var hasTaxJe = math.add(temVal,balanceTotal);
			var quantity = $("#quantity"+id+"").val();
			var newPrice = math.divide(hasTaxJe,quantity);
			$("#price"+id+"").val(newPrice.toFixed(8));
			$("#totalPrice"+id+"").val(hasTaxJe.toFixed(2));
			//判断是否有折扣行
			var discId = $("#"+id+"_1");
			if(discId.length != 0){
				/*var se = $("#sePrice"+id+"").val();
				var temDicVal = math.add(noTaxJe,se);
				//新的折扣额，税额
				var dicVal = $("#taxRateValue"+id+"_1").text();
				var newDicJe = math.multiply(temDicVal,dicVal);
				newDicJe = math.multiply(newDicJe,-1);
				$("#totalPrice"+id+"_1").val(newDicJe.toFixed(2));*/
				var dicJe = $("#totalPrice"+id+"_1").val();
				var se = $("#sePrice"+id+"_1").val();
				var newDicJe = math.add(dicJe,se);
				$("#totalPrice"+id+"_1").val(newDicJe.toFixed(2));
			}
			/*//计算税额
			var ce = math.subtract(jshj,balanceTotal);
			var temVal = math.divide(ce,totalTaxVal);
			var se = math.multiply(temVal,taxRate);
			var quantity = $("#quantity"+id+"").val();
			var price = math.divide(jshj,quantity);
			$("#price"+id+"").val(price.toFixed(8));
			$("#totalPrice"+id+"").val(jshj);
			$("#sePrice"+id+"").val(se.toFixed(2));
			//计算折扣行相关
			//折扣率
			var dicVal = $("#taxRateValue"+id+"_1").text();
			//折扣金额
			var dicJe = math.multiply(jshj,dicVal);
			//折扣税额
			var temJshj = math.divide(jshj,totalTaxVal);
			var dicSe = math.multiply(temJshj,dicVal);
			dicSe = math.multiply(dicSe,taxRate);*/
		});
	}else{
		$("#priceText").text("单价(不含税)");
		$("#moneyText").text("金额(不含税)");
		hsbz = 0;
		//获取所有商品行
		var proTrs = $("input[id^='price']");
		proTrs.each(function(){
			//获取当前行id
			var id = $(this).parent().parent().attr("id");
			var taxRate = $("#taxRate"+id+" option:selected").val();
			if(!taxRate){
				return;
			}
			var totalTaxVal = math.add(taxRate,1);
			if(!jshj || jshj == '0.00'){
				return;
			}
			//计算不含税金额
			var quantity = $("#quantity"+id+"").val();
			var price = $("#price"+id+"").val();
			var hasTaxJe = math.multiply(quantity,price);
			var ce = math.subtract(hasTaxJe,balanceTotal);
			var temVal = math.divide(ce,totalTaxVal);
			var noTaxJe = math.add(temVal,balanceTotal);
			var newPrice = math.divide(noTaxJe,quantity);
			$("#price"+id+"").val(newPrice.toFixed(8));
			$("#totalPrice"+id+"").val(noTaxJe.toFixed(2));
			//判断是否有折扣行
			var discId = $("#"+id+"_1");
			if(discId.length != 0){
				/*var dicVal = $("#taxRateValue"+id+"_1").text();
				var newDicJe = math.multiply(hasTaxJe,dicVal);
				newDicJe = math.divide(newDicJe,totalTaxVal);
				newDicJe = math.multiply(newDicJe,-1);
				$("#totalPrice"+id+"_1").val(newDicJe.toFixed(2));*/
				var dicJe = $("#totalPrice"+id+"_1").val();
				var se = $("#sePrice"+id+"_1").val();
				var newDicJe = math.subtract(dicJe,se);
				$("#totalPrice"+id+"_1").val(newDicJe.toFixed(2));
			}
			/*//计算税额
			var ce = math.subtract(jshj,balanceTotal);
			var temVal = math.divide(ce,totalTaxVal);
			var se = math.multiply(temVal,taxRate);
			var proJe = math.subtract(jshj,se);
			var quantity = $("#quantity"+id+"").val();
			var price = math.divide(proJe,quantity);
			$("#price"+id+"").val(price.toFixed(8));
			$("#totalPrice"+id+"").val(proJe.toFixed(2));
			$("#sePrice"+id+"").val(se.toFixed(2));
			//折扣率
			var dicVal = $("#taxRateValue"+id+"_1").text();
			//折扣金额
			var dicJe = math.divide(jshj,totalTaxVal);
			dicJe = math.multiply(dicJe,dicVal);
			//折扣税额
			var dicSe = math.divide(jshj,totalTaxVal);
			dicSe = math.multiply(dicSe,dicVal);
			dicSe = math.multiply(dicSe,taxRate);
			$("#totalPrice"+id+"_1").val(math.multiply(dicJe,-1).toFixed(2));
			$("#sePrice"+id+"_1").val(math.multiply(dicSe,-1).toFixed(2));*/
		});
	}
	countAllPrice();
}

