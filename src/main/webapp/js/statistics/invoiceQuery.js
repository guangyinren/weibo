var type = $Utils.getUrlParameters().type;
//查询用户信息并显示到页面上
$(function () {
	var invoiceTypeEnterprise = $("#invoiceTypeEnterprise",window.top.document).val();
	var invoiceTypeCheck = $("#invoiceTypeCheck",window.top.document).val();
	var invoiceType = JSON.parse(invoiceTypeEnterprise);
	var canEleInvoice = invoiceType.eleInvoice;
	var canSpecialInvoice = invoiceType.specialInvoice;
	var canPaperInvoice = invoiceType.paperInvoice;
	
	if(invoiceTypeCheck=="ELE_PAPER_SPECIAL"){
		if(canPaperInvoice){
			$("#fapzldmli").css("display","block");
			$("#fpzldm").css("display","block");
			$("#select1").css("display","block");
			$("#select0").css("display","block");
		}
		if(canSpecialInvoice){
			$("#fapzldmli").css("display","block");
			$("#fpzldm").css("display","block");
			$("#select2").css("display","block");
			$("#select0").css("display","block");
		}
		if(!canSpecialInvoice&&!canPaperInvoice){
			$("#fpzldm").val("10");
		}
	}else if(invoiceTypeCheck=="ELE_PAPER"){
		if(canPaperInvoice){
			$("#fapzldmli").css("display","block");
			$("#fpzldm").css("display","block");
			$("#select1").css("display","block");
			$("#select0").css("display","block");
		}else{
			$("#fpzldm").val("10");
		}
		
	}else if(invoiceTypeCheck=="ELE_SPECIAL"){
		if(canSpecialInvoice){
			$("#fapzldmli").css("display","block");
			$("#fpzldm").css("display","block");
			$("#select2").css("display","block");
			$("#select0").css("display","block");
		}else{
			$("#fpzldm").val("10");
		}
	}
	
	
	DatetimePicker.startDateLessEndDate($("#startKprq"),"","2016-08-01",new Date(),$("#endKprq"));
	DatetimePicker.endDateMoreStartDate($("#endKprq"),"","2016-08-01",new Date(),$("#startKprq"));
	if(type == 0){
		$("#startKprq").val(getPreviousTime());
		$("#endKprq").val(getNowTime());
	}

    $http.get(basePath + "invoice_query/clerkers" + suffix, "", function (data) {
        var rows = data.data;
        var c = rows.item.length;
        for (var i = 0; i < c; i++) {
            var name = rows.item[i].clerkName;
            var id = rows.item[i].billingClerkId;
            var selNode = $("#select_kpr");
            selNode.append("<option value='" + name + "'>" + name + "</option>");
        }
    });
    var currentIndex = $Utils.getUrlParameters().currentIndex;
    if(!currentIndex){
    	queryByIndex(1);
    }else{
    	queryByIndex(currentIndex);
    }
    var validate1 = $("#query_condition").validate({
        onblur: function (element) {
            $(element).valid();
        },
        rules: {
            input_fpdm: {
                digits: true,
                minlength: 10,
                maxlength: 12
            },
            input_fphm: {
                digits: true,
                minlength: 8,
                maxlength: 8
            },
            input_hjje: {
                number: true
            },
            input_sjh: {
                phoneCN: true,
            },
        },


        messages: {
            input_fpdm: {
                digits: "发票代码只能是数字",
                minlength: "请输入10-12位的发票代码",
                maxlength: "请输入10-12位的发票代码"
            },
            input_fphm: {
                digits: "发票号码只能是数字",
                minlength: "请输入8位的发票号码",
                maxlength: "请输入8位的发票号码"
            },
            input_hjje: {
                required: "发票金额不能为空",
                number: "请输入合法的发票金额"
            },

            input_sjh: {
                isMobile: "请输入正确的手机号"
            }
        }
    });

});


function queryByIndex(currentPage) {
    //每页展示条数
    var pageSize = 10;

    var kpr = $("#select_kpr").val();
    var kplx = $("#kplx").val();
    var gmfmc = $("#input_gmfmc").val();
    var lxr = $("#input_lxr").val();
    var sjh = $("#input_sjh").val();
    var fpdm = $("#input_fpdm").val();
    var fphm = $("#input_fphm").val();
    var sign = $("#select_sign").val();
    var hjje = $("#input_hjje").val();
    var startKprq = $("#startKprq").val();
    var endKprq = $("#endKprq").val();
    var fpzldm = $("#fpzldm").val();
    var chbz = $("#chbz option:selected").val();
    if (!startKprq == "") {
        startKprq = startKprq + " 00:00:00";
    }
    if (!endKprq == "") {
        endKprq = endKprq + " 23:59:59";
    }
    $http.get(basePath + "invoice_query/common" + suffix,
        {
            pageIndex: currentPage,
            pageSize: pageSize,
            kpr: kpr,
            kplx:kplx,
            gmfmc: gmfmc,
            lxmc: lxr,
            lxsj: sjh,
            fpdm: fpdm,
            fphm: fphm,
            sign: sign,
            hjje: hjje,
            beginTime: startKprq,
            endTime: endKprq,
            fpzldm:fpzldm,
            chbz:chbz
        },
        function (data) {
            if ("200" == data.code) {
                var rows = data.data.rows;
                var total = data.data.total;
                InvoicePrint.printInvoices =[];
                if (rows.length > 0) {
                    //$("#menu_tr").css("display","block");
                    $("#invoice_query").empty();
                    Array.prototype.forEach.call(rows, function (item, index, array) {
                        var number = pageSize * (currentPage - 1) + index + 1;
                        var invoice = new Invoice(item, number,currentPage);
                        var str = invoice.fillListData();
                        InvoicePrint.printInvoices.push(item.fpqqlsh);
                        $("#invoice_query").append(str);
                    })
                    var pageCount = Math.floor((total - 1) / pageSize) + 1;
                    PageWrapper.page($("#page1"), total, currentPage, queryByIndex);

                } else {
                    $("#invoice_query").empty();
                    $("#invoice_query").html("<td colspan='13' style='text-align: center;'>暂无数据</td>");
                    $("#page1").empty();
                }
            }

        });
}

function exportExcel() {
	var kpr = $("#select_kpr").val();
    var gmfmc = $("#input_gmfmc").val();
    var lxr = $("#input_lxr").val();
    var sjh = $("#input_sjh").val();
    var fpdm = $("#input_fpdm").val();
    var fphm = $("#input_fphm").val();
    var sign = $("#select_sign").val();
    var hjje = $("#input_hjje").val();
    var startKprq = $("#startKprq").val();
    var endKprq = $("#endKprq").val();
    var fpzldm = $("#fpzldm").val();
    var kplx = $("#kplx").val();
    var chbz = $("#chbz option:selected").val();
    if (!startKprq == "") {
        startKprq = startKprq + " 00:00:00";
    }
    if (!endKprq == "") {
        endKprq = endKprq + " 23:59:59";
    }
    $http.get(basePath + "invoice_query/printQuery" + suffix,
        {
            kpr: kpr,
            gmfmc: gmfmc,
            lxmc: lxr,
            lxsj: sjh,
            fpdm: fpdm,
            fphm: fphm,
            sign: sign,
            hjje: hjje,
            beginTime: startKprq,
            endTime: endKprq,
            fpzldm: fpzldm,
            kplx:kplx,
            chbz:chbz
        },
        function (data) {
            if ("200" == data.code) {
            	var invoiceList = data.data.invoiceList;
            	if(invoiceList.length>=0){
            		var enterpriseRegInfo = data.data.enterpriseRegInfo;
            		var innerHtml = "<div class='print_div'><table id='ta'>";
            		innerHtml += 
            			"<tr>" +
            			"<td colspan='10' style='text-align:center;' width='5%'>增值税普通发票明细表</td>"+
            			"</tr>";
            		innerHtml += 
            			"<tr>" +
            			"<td colspan='10' style='text-align:left;' width='5%'>制表日期："+new Date().format('yyyy年MM月dd日 hh:mm:ss')+"</td>"+
            			"</tr>";
            		innerHtml += 
            			"<tr>" +
            			"<td colspan='10' style='text-align:left;' width='5%'>纳税人登记号："+enterpriseRegInfo.taxpayerNum+"</td>"+
            			"</tr>";
            		innerHtml += 
            			"<tr>" +
            			"<td colspan='10' style='text-align:left;' width='5%'>企业名称："+enterpriseRegInfo.enterpriseName+"</td>"+
            			"</tr>";
            		innerHtml += 
            			"<tr>" +
            			"<td colspan='10' style='text-align:left;' width='5%'>地址电话："+enterpriseRegInfo.enterpriseAddress +'  '+ enterpriseRegInfo.contactsPhone+"</td>"+
            			"</tr>";
            		innerHtml += 
            			"<tr>" +
            			"<td colspan='10' style='text-align:left;' width='5%'>单位：元</td>"+
            			"</tr>";
            		innerHtml += 
                		"<tr>" +
	                		"<td class='kp-num'>序号</td>"+
	                		"<td class='kp-num'>发票种类</td>"+
	                		"<td class='xsd-num'>销售单据号</td>"+
	            			"<td class='buyer' style='text-align: center'>购买方名称</td>"+
	            			"<td class='fp-num'>收票人手机号</td>"+
	            			"<td class='fp-num'>收票人邮箱</td>"+
	            			"<td class='fp-num'>发票代码</td>"+
	            			"<td class='fp-num'>发票号码</td>"+
	            			"<td class='fp-num'>原发票号码</td>"+
	            			"<td class='kp-date'>开票日期</td>"+
	            			"<td class='kp-je' style='text-align: center'>开票金额</td>"+
	            			"<td class='kp-se' style='text-align: center'>开票税额</td>"+
	            			"<td class='kp-hj' style='text-align: center'>价税合计金额</td>"+
	            			"<td class='kp-type'>开票人</td>"+
	            			"<td class='kp-type'>开票类型</td>"+
	            			"<td class='kp-type'>作废或冲红状态</td>"+
                		"</tr>";
            		var zje = 0;
            		var zse = 0;
            		var zjshjje = 0;
            		
            		for(var i = 0; i < invoiceList.length; i++){
            			zje=math.add(invoiceList[i].je,zje);
            			zse=math.add(invoiceList[i].se,zse);
            			zjshjje=math.add(invoiceList[i].jshjje,zjshjje);
            			innerHtml += "<tr>";
            			innerHtml += "<td class='kp-num' style='text-align:center;'>" + (i+1) + "</td>";
            			if(invoiceList[i].fpzldm == "04"){
            				innerHtml += "<td class='kp-num'>纸质增值税普通发票</td>";
            	        }else if(invoiceList[i].fpzldm == "10"){
            	        	innerHtml += "<td class='kp-num'>电子增值税普通发票</td>";
            	        }else if(invoiceList[i].fpzldm == "01"){
            	        	innerHtml += "<td class='kp-num'>纸质增值税专用发票</td>";
            	        }
            			innerHtml += "<td class='xsd-num'  style=\"mso-number-format:'\@';\">" + transferData(invoiceList[i].xsdjh) + "</td>";
            			innerHtml += "<td class='buyer'>" + invoiceList[i].gmfmc + "</td>";
            			innerHtml += "<td class='fp-num'>" + invoiceList[i].lxsj + "</td>";
            			innerHtml += "<td class='fp-num'>" + invoiceList[i].lxyx + "</td>";
            			innerHtml += "<td class='fp-num'>" + invoiceList[i].fphm + "</td>";
            			if(invoiceList[i].kplx=="2"){
            				innerHtml += "<td class='fp-num'>" + invoiceList[i].yfpHm + "</td>";
            			}else{
            				innerHtml += "<td class='fp-num'></td>";
            			}
            			innerHtml += "<td class='kp-date'>" + invoiceList[i].kprq + "</td>";
            			innerHtml += "<td class='kp-je'>" + invoiceList[i].je + "</td>";
            			innerHtml += "<td class='kp-se'>" + invoiceList[i].se + "</td>";
            			innerHtml += "<td class='kp-hj'>" + invoiceList[i].jshjje + "</td>";
            			innerHtml += "<td class='kp-hj'>" + invoiceList[i].kpr + "</td>";
            			if(invoiceList[i].kplx=="1"){
            				innerHtml += "<td style='text-align:center;'>蓝票</td>";
            			}else{
            				innerHtml += "<td style='text-align:center;'>红票</td>";
            			}
            			//作废或冲红状态
            	   		 if(invoiceList[i].zfbz == "NOT_DESTROY"){
            	   			 if(invoiceList[i].chbz == "REDING"){
            	       			 strs.push('<td>冲红中</td>');
            	       		 }
            	       		 if(invoiceList[i].chbz == "ALREADY_RED"){
            	       			 strs.push('<td>已冲红</td>');
            	       		 }
            	       		 if(invoiceList[i].chbz == "RED_FAIL"){
            	           		strs.push('<td>冲红失败</td>');
            	       		 }
            	       		 if(invoiceList[i].chbz == "NOT_RED"){
            	       			 strs.push('<td></td>');
            	       		 }
            	       		 if(!invoiceList[i].chbz){
            	       			 strs.push('<td></td>');
            	       		 }
            	   		 }else if(invoiceList[i].zfbz == "DESTROYING"){
            	   			 strs.push('<td>作废中</td>');
            	   		 }else if(invoiceList[i].zfbz == "ALREADY_DESTROY"){
            	   			 strs.push('<td>已作废</td>');
            	   		 }else if(invoiceList[i].zfbz == "DESTROY_FAIL"){
            	   			 if(invoiceList[i].chbz == "REDING"){
            	       			 strs.push('<td>冲红中</td>');
            	       		 }
            	       		 if(invoiceList[i].chbz == "ALREADY_RED"){
            	       			 strs.push('<td>已冲红</td>');
            	       		 }
            	       		 if(invoiceList[i].chbz == "RED_FAIL"){
            	           		strs.push('<td>冲红失败</td>');
            	       		 }
            	       		 if(invoiceList[i].chbz == "NOT_RED"){
            	       			 strs.push('<td>作废失败</td>');
            	       		 }
            	   		 }else if(!invoiceList[i].zfbz){
            	   			 if(invoiceList[i].chbz == "REDING"){
            	       			 strs.push('<td>冲红中</td>');
            	       		 }
            	       		 if(invoiceList[i].chbz == "ALREADY_RED"){
            	       			 strs.push('<td>已冲红</td>');
            	       		 }
            	       		 if(invoiceList[i].chbz == "RED_FAIL"){
            	           		strs.push('<td>冲红失败</td>');
            	       		 }
            	       		 if(!invoiceList[i].chbz){
            	       			 strs.push('<td></td>'); 
            	       		 }
            	   		 }
            			innerHtml += "</tr>";
            		}
            		innerHtml += "<tr>";
        			innerHtml += "<td class='kp-num' style='text-align:center;'colspan='7'>合计</td>";
        			innerHtml += "<td class='kp-je'>" + zje.toFixed(2) + "</td>";
        			innerHtml += "<td class='kp-se'>" + zse.toFixed(2) + "</td>";
        			innerHtml += "<td class='kp-hj'>" + zjshjje.toFixed(2) + "</td>";
        			innerHtml += "</tr>";
            		innerHtml += "</table></div>";
            		document.getElementById("explorerId").innerHTML=innerHtml;
        		
            		explorerExcel(ta,"发票明细数据"+$("#startKprq").val().replace(new RegExp(/(-)/g),"")+"-"+$("#endKprq").val().replace(new RegExp(/(-)/g),""));
            		document.getElementById("explorerId").innerHTML="";
            	}else{
            		
            	}
            }
        });
}

function printExcel() {
    var kprId = $("#select_kpr").val();
    var gmfmc = $("#input_gmfmc").val();
    var lxr = $("#input_lxr").val();
    var sjh = $("#input_sjh").val();
    var fpdm = $("#input_fpdm").val();
    var fphm = $("#input_fphm").val();
    var sign = $("#select_sign").val();
    var hjje = $("#input_hjje").val();
    var startKprq = $("#startKprq").val();
    var endKprq = $("#endKprq").val();
    if (!startKprq == "") {
        startKprq = startKprq + " 00:00:00";
    }
    if (!endKprq == "") {
        endKprq = endKprq + " 23:59:59";
    }
    $http.get(basePath + "invoice_query/printQuery" + suffix,
        {
            kprId: kprId,
            gmfmc: gmfmc,
            lxmc: lxr,
            lxsj: sjh,
            fpdm: fpdm,
            fphm: fphm,
            sign: sign,
            hjje: hjje,
            beginTime: startKprq,
            endTime: endKprq,
        },
        function (data) {
            if ("200" == data.code) {
            	var invoiceList = data.data.invoiceList;
            	if(invoiceList.length>0){
            		
            		var enterpriseRegInfo = data.data.enterpriseRegInfo;
            		var innerHtml = "<div class='print_div'><table id='tb'>";
            		innerHtml += 
            			"<tr>" +
            			"<td colspan='10' style='text-align:center;' width='5%'>增值税普通发票明细表</td>"+
            			"</tr>";
            		innerHtml += 
            			"<tr>" +
            			"<td colspan='10' style='text-align:left;' width='5%'>制表日期："+new Date().format('yyyy年MM月dd日 hh:mm:ss')+"</td>"+
            			"</tr>";
            		innerHtml += 
            			"<tr>" +
            			"<td colspan='10' style='text-align:left;' width='5%'>纳税人登记号："+enterpriseRegInfo.taxpayerNum+"</td>"+
            			"</tr>";
            		innerHtml += 
            			"<tr>" +
            			"<td colspan='10' style='text-align:left;' width='5%'>企业名称："+enterpriseRegInfo.enterpriseName+"</td>"+
            			"</tr>";
            		innerHtml += 
            			"<tr>" +
            			"<td colspan='10' style='text-align:left;' width='5%'>地址电话："+enterpriseRegInfo.enterpriseAddress +'  '+ enterpriseRegInfo.contactsPhone+"</td>"+
            			"</tr>";
            		innerHtml += 
            			"<tr>" +
            			"<td colspan='10' style='text-align:left;' width='5%'>单位：元</td>"+
            			"</tr>";
            		innerHtml += 
                		"<tr>" +
	                		"<td class='kp-num'>序号</td>"+
	            			"<td class='kp-type'>开票类型</td>"+
	            			"<td class='xsd-num'>销售单据号</td>"+
	            			"<td class='buyer' style='text-align: center'>购买方名称</td>"+
	            			"<td class='fp-num'>发票号码</td>"+
	            			"<td class='fp-num'>原发票号码</td>"+
	            			"<td class='kp-date'>开票日期</td>"+
	            			"<td class='kp-je' style='text-align: center'>开票金额</td>"+
	            			"<td class='kp-se' style='text-align: center'>开票税额</td>"+
	            			"<td class='kp-hj' style='text-align: center'>价税合计金额</td>"+
                		"</tr>";
            		var zje = 0;
            		var zse = 0;
            		var zjshjje = 0;
            		for(var i = 0; i < invoiceList.length; i++){
            			zje=math.add(invoiceList[i].je,zje);
            			zse=math.add(invoiceList[i].se,zse);
            			zjshjje=math.add(invoiceList[i].jshjje,zjshjje);
            			innerHtml += "<tr>";
            			innerHtml += "<td class='kp-num' style='text-align:center;'>" + (i+1) + "</td>";
            			if(invoiceList[i].kplx=="1"){
            				innerHtml += "<td style='text-align:center;'>蓝票</td>";
            			}else{
            				innerHtml += "<td style='text-align:center;'>红票</td>";
            			}
            			innerHtml += "<td class='xsd-num'>" + transferData(invoiceList[i].xsdjh) + "</td>";
            			innerHtml += "<td class='buyer'>" + invoiceList[i].gmfmc + "</td>";
            			innerHtml += "<td class='fp-num'>" + invoiceList[i].fphm + "</td>";
            			if(invoiceList[i].kplx=="2"){
            				innerHtml += "<td class='fp-num'>" + invoiceList[i].yfpHm + "</td>";
            			}else{
            				innerHtml += "<td class='fp-num'></td>";
            			}
            			innerHtml += "<td class='kp-date'>" + invoiceList[i].kprq + "</td>";
            			innerHtml += "<td class='kp-je'>" + invoiceList[i].je + "</td>";
            			innerHtml += "<td class='kp-se'>" + invoiceList[i].se + "</td>";
            			innerHtml += "<td class='kp-hj'>" + invoiceList[i].jshjje + "</td>";
            			innerHtml += "</tr>";
            		}
            		innerHtml += "<tr>";
            		innerHtml += "<td class='kp-num' style='text-align:center;'colspan='7'>合计</td>";
        			innerHtml += "<td class='kp-je'>" + zje.toFixed(2) + "</td>";
        			innerHtml += "<td class='kp-se'>" + zse.toFixed(2) + "</td>";
        			innerHtml += "<td class='kp-hj'>" + zjshjje.toFixed(2) + "</td>";
        			innerHtml += "</tr>";
            		innerHtml += "</table></div>";
            		document.getElementById("printId").innerHTML=innerHtml;
            		$("#printId").jqprint();
            		document.getElementById("printId").innerHTML="";
            	}else{
            		
            	}
            	
            }
        });
}

//查看纸质发票
function viewPaperInvoice(fpqqlsh){
	window.location.href = basePath + "pages/statistics/paperInvoiceDetail.shtml?fpqqlsh=" + fpqqlsh;
}

//查看电子发票
function viewElecInvoice(fpqqlsh){
	window.location.href = basePath + "pages/statistics/elecInvoiceDetail.shtml?fpqqlsh=" + fpqqlsh;
}

function timeStamp2String(time) {
    var datetime = new Date();
    datetime.setTime(time);
    datetime.getTime();
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}
function getNowTime() {
    var datetime = new Date();
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    return year + "-" + month + "-" + date;
}
function getPreviousTime() {
    var datetime = new Date();
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth()) : datetime.getMonth();
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    if("00"==month){
    	month="01";
    	date="01";
    }
    return year + "-" + month + "-" + date;
}
/** 
 * 时间对象的格式化; 
 */  
Date.prototype.format = function(format) {  
    /* 
     * eg:format="yyyy-MM-dd hh:mm:ss"; 
     */  
    var o = {  
        "M+" : this.getMonth() + 1, // month  
        "d+" : this.getDate(), // day  
        "h+" : this.getHours(), // hour  
        "m+" : this.getMinutes(), // minute  
        "s+" : this.getSeconds(), // second  
        "q+" : Math.floor((this.getMonth() + 3) / 3), // quarter  
        "S" : this.getMilliseconds()  
        // millisecond  
    }  
  
    if (/(y+)/.test(format)) {  
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4  
                        - RegExp.$1.length));  
    }  
  
    for (var k in o) {  
        if (new RegExp("(" + k + ")").test(format)) {  
            format = format.replace(RegExp.$1, RegExp.$1.length == 1  
                            ? o[k]  
                            : ("00" + o[k]).substr(("" + o[k]).length));  
        }  
    }  
    return format;  
}  

function transferData(str){
	if(typeof(str) == "undefined" || str == "undefined"){
		return "";
	}else{
		return str;
	}
}

//打印单个发票
function singlePrint(fpqqlsh){
	sdPrint({
        printable: basePath+"invoice/print/single"+suffix+"?fpqqlsh="+fpqqlsh,
        pid: "batch_print_single"
    });
}
