$(function(){
	$.ajax({
			type:"POST",
			url:basePath+"tp/css/info"+suffix,
			dataType:"json",
			async:false,
			success:function(data){
				var info = data.data.info;
				$("#headerLogo").css("background-image","url("+info.headerLogo+")");
				$("#headerSpan02").text(info.headerSpan02);
				$("#footerP1").html(info.footerP1);
				$("#contactDiv1").html(info.contactDiv1);
				$("#loginImgPic").attr("src",info.loginImgPic);
				$("#indexSpan01").css("background-image","url("+info.indexSpan01+")");
				$("#indexDiv01").attr("src",info.indexDiv01);
				if("0"==info.indexP01){
					$("#indexSpan02").css("display","block");
					$("#indexSpan03").css("display","block");
				}else if("1"==info.indexP01){
					$("#registerA01").attr("href","agreement-zhongshuiyun.shtml")
					$("#indexSpan04").css("display","none");
					$("#indexSpan05").css("display","none");
					$("#headerRegister").attr("href","http://96005656.com/tfkz/busPro/eleInvapply/");
					$("#loginRegister").attr("href","http://96005656.com/tfkz/busPro/eleInvapply/");
					$("#kc_rcyw5").css("display","none");
					addCssByLink("/images/favicon-zsy.ico")
				}else if("2"==info.indexP01){
					$("#registerA01").attr("href","agreement-qingtian.shtml")
					$("#indexSpan04").css("display","none");
					$("#indexSpan05").css("display","none");
					$("#kc_rcyw5").css("display","none");
					addCssByLink("/images/favicon-qt.ico")
				}else if("3"==info.indexP01){
					$("#registerA01").attr("href","agreement-gag.shtml")
					$("#indexSpan04").css("display","none");
					$("#indexSpan05").css("display","none");
					$("#kc_rcyw5").css("display","none");
					addCssByLink("/images/favicon-gag.ico")
				}else if("4"==info.indexP01){
					$("#registerA01").attr("href","agreement-xplc.shtml")
					$("#indexSpan04").css("display","none");
					$("#indexSpan05").css("display","none");
					$("#kc_rcyw5").css("display","none");
					addCssByLink("/images/favicon-xplc.ico")
				}else if("5"==info.indexP01){
					$("#registerA01").attr("href","agreement-fap.shtml")
					$("#indexSpan04").css("display","none");
					$("#indexSpan05").css("display","none");
					$("#kc_rcyw5").css("display","none");
					$("#shouyeImg01").attr("src","/images/home-pic3-fap.png");
					$("#productImg01").attr("src","/images/product-pic3-fap.png");
					$("#shouyeSpan01").text("安装本平台寄送的发票儿 · 盒子");
					$("#productDiv01").text("金税盘接入发票儿 · 盒子，插上网线，安装完成！");
					$("#processSpan01").html("平台管理员认证企业注册信息，认证通过后，平台服务人员给企业联系人寄送发票儿 · 盒子设备");
					$("#processSpan02").html("企业安装服务平台工作人员寄送的发票儿 · 盒子，根据操作手册设置后连接网络");
					$("#ptbQueryPageSpan01").html("发票儿 · 盒子管理");
					$("#invoiceRepertoryQueryPageDiv01").html("当前功能仅可查询电子发票的结存数量，如果无法查询到结存，可联系我们客服人员升级发票儿 · 盒子设备");
					$("#indexPageLi01").html('<a href="javascript:addTab(\'发票儿 · 盒子管理\',\'/pages/statistics/ptbQuery.shtml\',\'icon-s7\')">发票儿 · 盒子管理</a>');
					$("#ptbQueryPageSpan01").html('发票儿 · 盒子管理');
					$("#elecInvoiceMakePageH01").html('发票儿 · 盒子状态');
					$("#balanceInvoiceEditPageH01").text('发票儿 · 盒子状态');
					$("#balanceInvoiceMakePageH01").text('发票儿 · 盒子状态');
					$("#paperInvoiceMakePageH01").text('发票儿 · 盒子状态');
					$("#specialInvoiceEditNoMakePageH01").text('发票儿 · 盒子状态');
					$("#specialInvoiceEditNoMakePageH01").text('发票儿 · 盒子状态');
					$("#specialInvoiceMakePageH01").text('发票儿 · 盒子状态');
					addCssByLink("/images/favicon-fap.ico")
				}
			}
		});

	
});
function addCssByLink(url){  
    var doc=document;  
    var link=doc.createElement("link");  
    link.setAttribute("rel", "icon");  
    link.setAttribute("type", "image/x-icon");  
    link.setAttribute("href", url);  
  
    var heads = doc.getElementsByTagName("head");  
    if(heads.length)  
        heads[0].appendChild(link);  
    else  
        doc.documentElement.appendChild(link);  
}  