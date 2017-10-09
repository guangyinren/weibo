var CreatedOKLodop7766=null;
var firstLoad = true;
var InvoiceCodeDecrypt = null;
//====判断是否需要安装CLodop云打印服务器:====
function needCLodop(){
    try{
		var ua=navigator.userAgent;
		if(ua)
			return false;
		if (ua.match(/Windows\sPhone/i) !=null) return true;
		if (ua.match(/iPhone|iPod/i) != null) return true;
		if (ua.match(/Android/i) != null) return true;
		if (ua.match(/Edge\D?\d+/i) != null) return true;
		
		var verTrident=ua.match(/Trident\D?\d+/i);
		var verIE=ua.match(/MSIE\D?\d+/i);
		var verOPR=ua.match(/OPR\D?\d+/i);
		var verFF=ua.match(/Firefox\D?\d+/i);
		var x64=ua.match(/x64/i);
		if ((verTrident==null)&&(verIE==null)&&(x64!==null)) 
			return true; 
		else if ( verFF !== null) {
			verFF = verFF[0].match(/\d+/);
			if ((verFF[0]>= 42)||(x64!==null)) return true;
		} 
		else if ( verOPR !== null) {
			verOPR = verOPR[0].match(/\d+/);
			if ( verOPR[0] >= 32 ) return true;
		}
		else if ((verTrident==null)&&(verIE==null)) {
			var verChrome=ua.match(/Chrome\D?\d+/i);		
			if ( verChrome !== null ) {
				verChrome = verChrome[0].match(/\d+/);
				if (verChrome[0]>=42) return true;
			};
		};
		return false;
    } 
	catch(err) 
	{return true;};
};

//====页面引用CLodop云打印必须的JS文件：====
if (needCLodop()) {
	var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
	var oscript = document.createElement("script");
	oscript.src ="http://localhost:8000/CLodopfuncs.js?priority=1";
	head.insertBefore( oscript,head.firstChild );

	//引用双端口(8000和18000）避免其中某个被占用：
	oscript = document.createElement("script");
	oscript.src ="http://localhost:18000/CLodopfuncs.js?priority=0";
	head.insertBefore( oscript,head.firstChild );
};

//====获取LODOP对象的主过程：====
function getLodop(oOBJECT,oEMBED){
    var strHtmInstall="<br><font color='#FF00FF'>首次打印纸质发票请<a href='/download/票通打印控件.exe' target='_self'>点此安装打印服务</a>,安装后请刷新页面。</font>";
    var strHtmUpdate="<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
    var strHtm64_Install="<br><font color='#FF00FF'>首次打印纸质发票请<a href='/download/票通打印控件.exe' target='_self'>点此安装打印服务</a>,安装后请刷新页面。</font>";
    var strHtm64_Update="<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
    var strHtmFireFox="<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
    var strHtmChrome="<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
    var strCLodopInstall="<br><font color='#FF00FF'>CLodop云打印服务(localhost本地)未安装启动!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行安装</a>,安装后请刷新页面。</font>";
    var strCLodopUpdate="<br><font color='#FF00FF'>CLodop云打印服务需升级!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行升级</a>,升级后请刷新页面。</font>";
	var strCLodopUpdate="<br><font color='#FF00FF'>CLodop云打印服务需升级!点击这里</font>";
	var strFirefoxErr="打印功能只支持IE内核浏览器，给您带来的不变请谅解，谢谢！";
	var strChomeErr="打印功能只支持IE内核浏览器，给您带来的不变请谅解，谢谢！";
	var strOtherErr="打印功能只支持IE内核浏览器，给您带来的不变请谅解，谢谢！";
    var LODOP;
    try{
        var isIE = (navigator.userAgent.indexOf('MSIE')>=0) || (navigator.userAgent.indexOf('Trident')>=0);
        if (needCLodop()) {
            try{ LODOP=getCLodop();} catch(err) {};
			if (!LODOP && document.readyState!=="complete") {alert("C-Lodop没准备好，请稍后再试！"); return;};
			if (!LODOP) {
					 if (isIE) 
					 {
						 document.write(strCLodopInstall);
					 }						 
					 else
					 {
						 document.documentElement.innerHTML=strCLodopInstall+document.documentElement.innerHTML;
					 };						
					 return;
			} 
			else 
			{

				if (CLODOP.CVERSION<"2.1.0.2") { 
					if (isIE) 
					{
						document.write(strCLodopUpdate);
					}						 
					else
					{
						document.documentElement.innerHTML=strCLodopUpdate+document.documentElement.innerHTML;
					};						
				};
				if (oEMBED && oEMBED.parentNode) {oEMBED.parentNode.removeChild(oEMBED);};
				if (oOBJECT && oOBJECT.parentNode) {oOBJECT.parentNode.removeChild(oOBJECT);};	
			};
        } 
		else 
		{
            var is64IE  = isIE && (navigator.userAgent.indexOf('x64')>=0);
			var isFirefox = navigator.userAgent.indexOf('Firefox')>=0;
			var isChrome = navigator.userAgent.indexOf('Chrome')>=0;
            //=====如果页面有Lodop就直接使用，没有则新建:==========
            if (oOBJECT!=undefined || oEMBED!=undefined) {
                if (isIE) {LODOP=oOBJECT; }else  {LODOP=oEMBED;};
            } 
			else if (CreatedOKLodop7766==null){
                LODOP=document.createElement("object");
				InvoiceCodeDecrypt = document.createElement("object");
                LODOP.setAttribute("width",0);
                LODOP.setAttribute("height",0);
				InvoiceCodeDecrypt.setAttribute("width",0);
                InvoiceCodeDecrypt.setAttribute("height",0);
                LODOP.setAttribute("style","position:absolute;left:0px;top:-100px;width:0px;height:0px;");
				InvoiceCodeDecrypt.setAttribute("style","position:absolute;left:0px;top:-100px;width:0px;height:0px;");
                if (isIE) 
				{
					LODOP.setAttribute("classid","clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
					InvoiceCodeDecrypt.setAttribute("classid","clsid:6EB99E85-AE3D-4CD8-A09E-830DE52F4F6F");
				}					
				else if(isFirefox)
				{
					LODOP.setAttribute("type","application/x-itst-activex");
					LODOP.setAttribute("classid","{2105C259-1E0C-4534-8141-A753534CB4CA}");
					InvoiceCodeDecrypt.setAttribute("type","application/x-itst-activex");
					InvoiceCodeDecrypt.setAttribute("classid","{6EB99E85-AE3D-4CD8-A09E-830DE52F4F6F}");
				}				
                else if(isChrome)
				{
					LODOP.setAttribute("type","application/x-print-lodop");
					LODOP.setAttribute("classid","{2105C259-1E0C-4534-8141-A753534CB4CA}");
					InvoiceCodeDecrypt.setAttribute("type","application/x-itst-activex");
					InvoiceCodeDecrypt.setAttribute("classid","{6EB99E85-AE3D-4CD8-A09E-830DE52F4F6F}");
				}			
				else{};			
                document.documentElement.appendChild(LODOP);
				document.documentElement.appendChild(InvoiceCodeDecrypt);
                CreatedOKLodop7766=LODOP;
            } 
			else 
			{
				LODOP=CreatedOKLodop7766;
			};				
            //=====Lodop插件未安装时提示下载地址:==========
            if ((LODOP==null)||(typeof(LODOP.VERSION)=="undefined")) {
				if(!firstLoad)
				{
					return;
				};					
				if (is64IE) 
				{
					document.documentElement.innerHTML=strHtmInstall+document.documentElement.innerHTML;
				}					
				else if (isIE)
				{
					document.documentElement.innerHTML=strHtmInstall+document.documentElement.innerHTML;
				}					
				else if(isFirefox)
				{
					alert(strFirefoxErr);
				}
				else if(isChrome)
				{
					alert(strChomeErr);
				}
				else
				{
					alert(strOtherErr);
				};					
				firstLoad = false;
				return LODOP;
            };
        };
        if (LODOP.VERSION<"6.2.1.7") {
			if(!firstLoad)
				return;
            if (needCLodop())
			{
				alert(strHtmUpdate);
			}				
			else if (is64IE)
			{
				alert(strHtmUpdate);
			}				
			else if (isIE) 
			{
				alert(strHtmUpdate);
			}							
			else
			{alert(strOtherErr);};				
			firstLoad = false;
            return LODOP;
        };
        //===如下空白位置适合调用统一功能(如注册语句、语言选择等):===

        //===========================================================
        return LODOP;
    } 
	catch(err) {alert("getLodop出错:"+err);};
};
var LODOP; //声明为全局变量   
function PT_Preview(isCodeDecrypt,invData,invbginfo) {	

	CreateFullBill(isCodeDecrypt,invData,invbginfo);
	LODOP.PREVIEW();		
};
function PT_Design(invData,invbginfo) {		
	CreateFullBill(invData,invbginfo);
	LODOP.PRINT_DESIGN();		
};
		
function PT_Setup(invData,invbginfo) {		
	CreateFullBill(invData,invbginfo);
	LODOP.PRINT_SETUP();		
};
	
function PT_RealPrint(invData,invbginfo) {		
	CreateFullBill(invData,invbginfo);
	//云打印C-Lodop返回结果用回调函数:
	if (LODOP.CVERSION) {
		CLODOP.On_Return=function(TaskID,Value){ if (Value) alert("已发出实际打印命令！"); else alert("放弃打印！"); };
		LODOP.PRINTA();
		return;
	};
	//控件返回结果用语句本身：
	if (LODOP.PRINTA()) 
	   alert("已发出实际打印命令！"); 
	else 
	   alert("放弃打印！"); 
};	
function CreateFullBill(isCodeDecrypt,invData,invbginfo) {
	LODOP=getLodop();
	if(LODOP == null)
		return;
	LODOP.SET_PRINT_PAGESIZE(1,2413,1397,"");
	genbkground();
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(44,424,72,18,invbginfo.province);
	LODOP.SET_PRINT_STYLEA(0,"FontName","楷体");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.SET_PRINT_STYLEA(0,"LetterSpacing",14);
	LODOP.ADD_PRINT_TEXT(14,369,159,27,invbginfo.title);
	LODOP.SET_PRINT_STYLEA(0,"FontName","楷体");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_IMAGE(23,61,70,70,"<img src='"+invData.qrcode+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);
	LODOP.ADD_PRINT_TEXT(82,142,197,21,"校验码 "+invData.checkcode);
	LODOP.ADD_PRINT_TEXT(32,742,75,18,invData.invcode);
	LODOP.ADD_PRINT_TEXT(47,733,85,18,invData.invno);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
	//LODOP.SET_PRINT_STYLEA(0,"LetterSpacing",2);
	//LODOP.SET_PRINT_STYLEA(0,"Bold",1);
	LODOP.ADD_PRINT_TEXT(73,693,118,18,invData.billingdata);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(103,180,317,18,invData.buyer_name);
	fontSize_title(invData.buyer_name);
	LODOP.ADD_PRINT_TEXT(123,196,299,18,invData.buyer_taxid);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
	LODOP.SET_PRINT_STYLEA(0,"LetterSpacing",3);
	LODOP.ADD_PRINT_TEXT(143,180,317,18,invData.buyer_addrtel);
	fontSize_title(invData.buyer_addrtel);
	LODOP.ADD_PRINT_TEXT(163,180,317,18,invData.buyer_bankaccount);
	fontSize_title(invData.buyer_bankaccount);
	LODOP.ADD_PRINT_TEXT(200,61,200,18,invData.commodity[0].name);
	if(isNull(invData.commodity[1].name)&& isNull(invData.commodity[2].name)&& isNull(invData.commodity[3].name)&& isNull(invData.commodity[4].name)&& isNull(invData.commodity[5].name))
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
	}
	else
	{
		fontSize_goodsname(invData.commodity[0].name);
	};		
	LODOP.ADD_PRINT_TEXT(219,61,200,18,invData.commodity[1].name);
	if(isNull(invData.commodity[2].name)&& isNull(invData.commodity[3].name)&& isNull(invData.commodity[4].name)&& isNull(invData.commodity[5].name))
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
	}
	else
	{
		fontSize_goodsname(invData.commodity[1].name);
	};		
	LODOP.ADD_PRINT_TEXT(238,61,200,18,invData.commodity[2].name);
	if(isNull(invData.commodity[3].name)&& isNull(invData.commodity[4].name)&& isNull(invData.commodity[5].name))
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
	}
	else
	{
		fontSize_goodsname(invData.commodity[2].name);
	};		
	LODOP.ADD_PRINT_TEXT(256,61,200,18,invData.commodity[3].name);
	if(isNull(invData.commodity[4].name)&& isNull(invData.commodity[5].name))
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
	}
	else
	{
		fontSize_goodsname(invData.commodity[3].name);
	};		
	LODOP.ADD_PRINT_TEXT(274,61,200,18,invData.commodity[4].name);
	if(isNull(invData.commodity[5].name))
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
	}
	else
	{
		fontSize_goodsname(invData.commodity[4].name);
	};		
	LODOP.ADD_PRINT_TEXT(292,61,200,18,invData.commodity[5].name);
	fontSize_goodsname(invData.commodity[5].name);
	LODOP.ADD_PRINT_TEXT(200,256,98,18,invData.commodity[0].guige);
	if(isNull(invData.commodity[1].guige)&& isNull(invData.commodity[2].guige)&& isNull(invData.commodity[3].guige)&& isNull(invData.commodity[4].guige)&& isNull(invData.commodity[5].guige))
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
	}
	else
	{
		fontSize_guige(invData.commodity[0].guige);
	};
	LODOP.ADD_PRINT_TEXT(220,256,98,18,invData.commodity[1].guige);
	if(isNull(invData.commodity[2].guige)&& isNull(invData.commodity[3].guige)&& isNull(invData.commodity[4].guige)&& isNull(invData.commodity[5].guige))
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
	}
	else
	{
		fontSize_guige(invData.commodity[1].guige);
	};
	LODOP.ADD_PRINT_TEXT(239,256,98,18,invData.commodity[2].guige);
	if(isNull(invData.commodity[3].guige)&& isNull(invData.commodity[4].guige)&& isNull(invData.commodity[5].guige))
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
	}
	else
	{
		fontSize_guige(invData.commodity[2].guige);
	};		
	LODOP.ADD_PRINT_TEXT(257,256,98,18,invData.commodity[3].guige);
	if(isNull(invData.commodity[4].guige)&& isNull(invData.commodity[5].guige))
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
	}
	else
	{
		fontSize_guige(invData.commodity[3].guige);
	};		
	LODOP.ADD_PRINT_TEXT(275,256,98,18,invData.commodity[4].guige);
	if(isNull(invData.commodity[5].guige))
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
	}
	else
	{
		fontSize_guige(invData.commodity[4].guige);
	};		
	LODOP.ADD_PRINT_TEXT(292,256,98,18,invData.commodity[5].guige);
	fontSize_guige(invData.commodity[5].guige);
	LODOP.ADD_PRINT_TEXT(200,357,37,18,invData.commodity[0].unit);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(220,357,37,18,invData.commodity[1].unit);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(239,357,37,18,invData.commodity[2].unit);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(257,357,37,18,invData.commodity[3].unit);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(275,357,37,18,invData.commodity[4].unit);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(292,358,37,18,invData.commodity[5].unit);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(200,398,66,18,invData.commodity[0].number);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(220,398,66,18,invData.commodity[1].number);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(239,398,66,18,invData.commodity[2].number);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(257,398,66,18,invData.commodity[3].number);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(275,398,66,18,invData.commodity[4].number);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(292,398,66,18,invData.commodity[5].number);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(200,466,89,18,invData.commodity[0].price);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(219,466,89,18,invData.commodity[1].price);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(237,466,89,18,invData.commodity[2].price);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(256,466,89,18,invData.commodity[3].price);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(274,466,89,18,invData.commodity[4].price);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(291,466,89,18,invData.commodity[5].price);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(200,557,110,18,invData.commodity[0].sunmoney);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(219,557,110,18,invData.commodity[1].sunmoney);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(237,557,110,18,invData.commodity[2].sunmoney);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(256,557,110,18,invData.commodity[3].sunmoney);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(274,557,110,18,invData.commodity[4].sunmoney);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(291,557,110,18,invData.commodity[5].sunmoney);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(200,671,36,18,invData.commodity[0].tax);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(218,671,36,18,invData.commodity[1].tax);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(236,671,36,18,invData.commodity[2].tax);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(255,671,36,18,invData.commodity[3].tax);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(273,671,36,18,invData.commodity[4].tax);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(290,671,36,18,invData.commodity[5].tax);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(200,710,108,18,invData.commodity[0].taxmoney);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(218,710,108,18,invData.commodity[1].taxmoney);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(236,710,108,18,invData.commodity[2].taxmoney);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(255,710,108,18,invData.commodity[3].taxmoney);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(273,710,108,18,invData.commodity[4].taxmoney);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(290,710,108,18,invData.commodity[5].taxmoney);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	if(isCodeDecrypt)
		LODOP.ADD_PRINT_IMAGE(109,522,269,59,"<img src='"+passwordgen(InvoiceCodeDecrypt.InvoiceCodeDecrypt(invData.ciphertext))+"'/>");
	else
		LODOP.ADD_PRINT_IMAGE(109,522,269,59,"<img src='"+passwordgen(invData.ciphertext)+"'/>");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);
	LODOP.ADD_PRINT_TEXT(381,180,322,18,invData.sales_name);
	fontSize_title(invData.sales_name);
	LODOP.ADD_PRINT_TEXT(399,196,299,18,invData.sales_taxid);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
	LODOP.SET_PRINT_STYLEA(0,"LetterSpacing",3);
	LODOP.ADD_PRINT_TEXT(418,180,322,18,invData.sales_addrtel);
	fontSize_title(invData.sales_addrtel);
	LODOP.ADD_PRINT_TEXT(436,180,322,18,invData.sales_bankaccount);
	fontSize_title(invData.sales_bankaccount);
	LODOP.ADD_PRINT_TEXT(379,522,300,75,invData.remarks);
	LODOP.ADD_PRINT_TEXT(456,135,109,21,invData.payee);
	LODOP.ADD_PRINT_TEXT(456,339,93,21,invData.review);
	LODOP.ADD_PRINT_TEXT(456,516,93,21,invData.drawer);
	LODOP.ADD_PRINT_TEXT(354,286,278,21,invData.money.totalcapital);
	LODOP.SET_PRINT_STYLEA(0,"LetterSpacing",1);
	LODOP.ADD_PRINT_TEXT(352,676,100,21,"￥"+invData.money.total);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.SET_PRINT_STYLEA(0,"LetterSpacing",2);
	LODOP.ADD_PRINT_TEXT(327,559,100,18,"￥"+invData.money.sum);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.SET_PRINT_STYLEA(0,"LetterSpacing",2);
	LODOP.ADD_PRINT_TEXT(327,705,99,18,invData.money.sumtax);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.SET_PRINT_STYLEA(0,"LetterSpacing",2);
	LODOP.ADD_PRINT_ELLIPSE(352,267,13,13,0,1);
	LODOP.ADD_PRINT_LINE(363,269,355,277,0,1);
	LODOP.ADD_PRINT_LINE(355,270,363,278,0,1);

};
function genbkground()
{
	//画背景
	LODOP.PRINT_INITA(0,0,912,528,"");
	LODOP.SET_PRINT_PAGESIZE(1,2413,1397,"");
	LODOP.ADD_PRINT_SHAPE(2,96,57,763,358,0,1,"#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_SHAPE(0,181,58,762,1,0,1,"#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_SHAPE(0,96,96,1,85,0,1,"#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_SHAPE(0,96,487,1,85,0,1,"#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_SHAPE(0,96,511,1,85,0,1,"#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_SHAPE(1,344,58,762,1,0,1,"#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_SHAPE(0,376,57,762,1,0,1,"#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_SHAPE(0,377,92,1,76,0,1,"#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_SHAPE(0,377,489,1,76,0,1,"#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_SHAPE(1,377,513,1,76,0,1,"#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_SHAPE(0,181,253,1,195,0,1,"#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_SHAPE(0,181,354,1,162,0,1,"#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_SHAPE(0,182,397,1,162,0,1,"#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_SHAPE(1,182,467,1,162,0,1,"#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_SHAPE(0,182,556,1,162,0,1,"#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_SHAPE(1,182,669,1,162,0,1,"#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_SHAPE(0,182,709,1,162,0,1,"#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(118,71,19,57,"购买方");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"AlignJustify",1);
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.SET_PRINT_STYLEA(0,"LetterSpacing",9);
	LODOP.ADD_PRINT_TEXT(115,494,21,57,"密码区");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.SET_PRINT_STYLEA(0,"LetterSpacing",9);
	LODOP.ADD_PRINT_TEXT(389,70,22,57,"销售方");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(390,494,20,56,"备\r\n\r\n注");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(184,93,167,18,"货物或应税劳务、服务名称");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(183,287,59,18,"规格型号");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(183,362,36,18,"单位");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");

	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(183,408,43,18,"数 量");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(183,488,54,18,"单 价");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(183,590,57,18,"金  额");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(183,677,36,18,"税率");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(183,742,55,18,"税  额");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(73,626,70,18,"开票日期：");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(104,100,100,18,"名       称：");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(123,98,100,18,"纳税人识别号：");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(142,98,100,18,"地 址、电 话：");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(162,98,100,18,"开户行及账号：");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(326,129,91,18,"合       计");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(354,123,99,18,"价税合计(大写)");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(354,624,51,18,"(小写)");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(381,95,100,18,"名       称：");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(398,94,100,18,"纳税人识别号：");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(418,94,100,18,"地 址、电 话：");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(434,94,100,18,"开户行及账号：");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(456,78,57,18,"收款人：");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(456,289,50,18,"复核：");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_TEXT(456,457,57,18,"开票人：");
	LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
	LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_SHAPE(1,50,297,280,1,0,1,"#800000");
	LODOP.SET_PRINT_STYLEA(0,"PreviewOnly",1);
	LODOP.ADD_PRINT_SHAPE(1,54,297,280,1,0,1,"#800000");
	//结束背景
};
function passwordgen(ciphertext){
	var str = ciphertext; 
	var strlen = str.length;
	var can = document.createElement("canvas");
	can.width = 970*5;
	can.height = 210*5;
	var mod = 0;
	if(strlen == 108)
	{
		mod = 27;
		can.width = 970*5;
	}
	else if(strlen == 112)
	{
		mod = 28;
		can.width = 980*5;
	}
	else {mod = 27;can.width = 970*5;};
	var cans = can.getContext('2d');
	cans.font = 'normal normal 14px Courier';
	cans.fillStyle = 'black';
	cans.textAlign = 'left';
	cans.scale(5,5);
	for(var i = 0;i < str.length;i++)
	{
		if(str.substr(i, 1) == '*')
		{
			cans.font = '56px 宋体';
		}
		else
		{
			cans.font = '56px Courier';
		};
		var r = Math.floor(i/mod);
		var l = i%mod;
		cans.fillText(str.substr(i, 1), l*35, 43+r*55);
	};
	var imgdata = can.toDataURL("image/png");
	return imgdata;
};
function makeqrcode(txt)
{
	var qrDiv = document.createElement("div");
	qrDiv.id = "qrcodediv";
	qrDiv.width = 100;
	qrDiv.height = 100;
	var qrcode = new QRCode(qrDiv, {width : 100,height : 100});
	qrcode.makeCode(txt);
	return qrDiv.childNodes[0].toDataURL("image/png");
};
function strlen(str){
    var len = 0;
    for (var i=0; i<str.length; i++) {
     var c = str.charCodeAt(i);
    //单字节加1
     if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
       len++;
     }
     else {
      len+=2;
     };
    };
    return len;
};
//判断空值
function isNull(value)
{
	if (value == null || value == undefined || value == '') {
		return true;
	} 
	else
	{
		return false;
	};		
};
//购货方、销货方长度计算
function fontSize_title(str)
{
	//正常9号字  52   <52
	//5号字 1行  96   >74
	//6号字 1行  74   >68  <74
	//7号字 1行  68   >56  <68
	//8号字 1行  56   >52  <56
	var len = strlen(str);
	if(len > 74)
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",5);
	}
	else if(len > 68 && len <= 74)
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",6);
	}
	else if(len > 56 && len <= 68)
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	}
	else if(len > 52 && len <= 56)
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	}
	else{};
	
};
//commodity[1].name 商品名长度计算
function fontSize_goodsname(str)
{
	//正常9号字 32   <32
	//5号字 1行  60   >46
	//6号字 1行  46   >42  <46
	//7号字 1行  42   >35  <42
	//8号字 1行  35   >32  <35
	var len = strlen(str);
	if(len > 46)
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",5);
	}
	else if(len > 42 && len <= 46)
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",6);
	}
	else if(len > 35 && len <= 42)
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	}
	else if(len > 32 && len <= 35)
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	}
	else{};
	
};
//commodity[1].guige 计算规格长度
function fontSize_guige(str)
{
	//正常9号字  14   <14
	//5号字 1行  28   >22
	//6号字 1行  22   >18  <22
	//7号字 1行  18   >16  <18
	//8号字 1行  16   >14  <16
	var len = strlen(str);
	if(len > 22)
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",5);
	}
	else if(len > 18 && len <= 22)
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",6);
	}
	else if(len > 16 && len <= 18)
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
	}
	else if(len > 14 && len <= 16)
	{
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
	}
	else{};
};