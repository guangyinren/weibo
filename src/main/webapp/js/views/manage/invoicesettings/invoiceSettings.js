/**
]
 * 开票设置.js
 */
$(function () {
	var check = true;
	if($("#role_",window.top.document).val() == "ADMIN" || $("#role_",window.top.document).val() == "ADMIN_ALL"){
		$("#basic_but_div").css("display","block");
		$("#tax_but_div").css("display","block");
	}else{
		check = false;
		$("#bank_name").attr("readonly","readonly");
		$("#account_number").attr("readonly","readonly");
		$("#contact_phone").attr("readonly","readonly");
	}

    window.invoiceSettings = $.fn.invoiceSettings = {
        settings: {},
        payerTypes: {},
        initTax: function initTax(list) {
            $("#types").empty();
            $("#rates").empty();
            Array.prototype.forEach.call(list, function (item, index) {
                var type = "";
                if (index == 0) {
                    type = '<b  class="radio-lu radio-rate-type" data-value="' + item.taxpayerTypeId + '" /></b><span class="m-r-100">' + item.description + '</span>';
                } else {
                    type = '<b  class="radio-lu radio-rate-type" data-value="' + item.taxpayerTypeId + '" /></b><span>一般纳税人</span>'
                }
                $("#types").append(type);
                var taxRates = item.taxRates;
                var rateHTML = "";
                if (index == 0) {
                    rateHTML += '<div class="tab-cont1" id="rates_' + item.taxpayerTypeId + '">';
                } else {
                    rateHTML += '<div class="tab-cont1" id="rates_' + item.taxpayerTypeId + '" style="display:none;">';
                }
                taxRates.forEach(function (item, index) {
                    rateHTML += '<label style="margin-right: 0%;width:25%"><b class="radio-lu1 radio-rate" data-value="' + item.taxRateId + '" /></b><span class="m-r-100">' + item.frontName + '</span></label>';
                })
                rateHTML += '</div>';
                $("#rates").append(rateHTML);
            });
            $(".radio-lu").on('click', function () {
                $(".tab-cont1").hide();
                $("#rates_" + $(this).
                    data("value")).show()
            });
            $Utils.makeClassRadio("radio-rate-type", "radio-lu-sel");
           if(check){
               $Utils.makeClassMulti("radio-rate",
                   "radio-lu-sel1");
           }
            invoiceSettings.payerTypes = $Utils.
                convertArray2Obj(list
                , {
                    mapKey: "taxpayerTypeId",
                    arrKeys: [{
                        arrKey: "taxRates",
                        convertRule: {
                            mapKey: "taxRateId",
                            arrKeys: []
                        }
                    }]
                });
        },
        initPackage: function (packageList) {
            $("#select_list").empty();
            var arr = [];
            var length = packageList.length;
            packageList.forEach(function (item, index) {
                if (item.validStatus == 'INVALID') {
                    arr.push('<p class="b-p-line"><b class="radio-lu-package radio-type disable" data-value="" /></b>' + item.description + '</p>');
                } else {
                    packageID = item.tariffPackageId;
                    arr.push('<p class="b-p-line"><b class="radio-lu-package radio-type package-able" data-value="' + item.tariffPackageId + '" /></b>' + item.description + '</p>');
                }
            });
            $("#select_list").append(arr.join(""));
            $Utils.makeClassRadio("package-able", "radio-lu-sel");

        },
        initPage: function () {
            $http.get(basePath + "manage/invoice/setting/basic" + suffix, {}, function (data) {
                if (data.code == 200) {
                    var serverData = data.data;
                    var taxList = serverData.taxRates;
//                    var packageList = serverData.tariffPackages;
                    invoiceSettings.initTax(taxList);
//                    invoiceSettings.initPackage(packageList)
                }
            }, false);
        },
        initItem: function (item) {
            invoiceSettings.settings = item;
            $("#bank_name").val(item.enterpriseBankAccountName);
            $("#account_number").val(item.enterpriseAccountNumber);
            $("#contact_phone").val(item.enterpriseContactPhone);
            if (item.taxpayerTypeId && item.taxRateId) {
                $Utils.resetRadio("radio-rate-type", "radio-lu-sel", item.taxpayerTypeId);
                $Utils.resetMulti("radio-rate", "radio-lu-sel1", item.taxRateId.split("|"));
                $(".tab-cont1").hide();
                $("#rates_" + item.taxpayerTypeId).show();
            }
            /*if (item.tariffPackageDetail.tariffPackageId) {
                $Utils.resetRadio("package-able", "radio-lu-sel", item.tariffPackageDetail.tariffPackageId);
            }*/

        },
        index: function () {
            $http.get(basePath + "manage/invoice/setting/index" + suffix, {}, function (data) {
                if (data.code == 200) {
                    var serverData = data.data;
                    var item = serverData.item;
                    invoiceSettings.initItem(item);
                }
            })
        },
        getSignture: function () {
            $("#signture_url").prop("src", basePath + "manage/invoice/setting/signature" + suffix);
        },
        saveBasic: function () {
            var bankName = $("#bank_name").val().trim();
            var accountNumber = $("#account_number").val().trim();
            var contactPhone = $("#contact_phone").val().trim();
            if (invoiceSettings.settings.enterpriseBankAccountName === bankName && invoiceSettings.settings.enterpriseAccountNumber === accountNumber && invoiceSettings.settings.enterpriseContactPhone === contactPhone) {
                layer.tips("没有数据变化", "#basic_tip", {
                    tips: [2, 'red']
                });
                return false;
            }
            if ($("#basic_form").valid()) {
                $http.post(basePath + "manage/invoice/setting/save/basic" + suffix, {
                    enterpriseBankAccountName: bankName,
                    enterpriseAccountNumber: accountNumber,
                    enterpriseContactPhone: contactPhone
                }, function (data) {
                    if (data.code == 200 && data.data.flag == true) {
                        invoiceSettings.settings.enterpriseBankAccountName = bankName;
                        invoiceSettings.settings.enterpriseAccountNumber = accountNumber;
                        invoiceSettings.settings.enterpriseContactPhone = contactPhone;
                        layer.tips("开票信息保存成功", "#basic_tip", {
                            tips: [2, 'green']
                        });
                    } else {
                        layer.tips("开票信息保存失败", "#basic_tip", {
                            tips: [2, 'red']
                        })
                    }
                });
            }
        },
        savePackge: function () {

        },
        saveTax: function () {
            var type = $(".radio-rate-type.radio-lu-sel").data("value");
            var rateEles = $(".radio-rate.radio-lu-sel1");
            var payerType = invoiceSettings.payerTypes[type];
            var unRate = [];
            var rateStr = [];
            if (payerType) {
                var typeId = payerType.taxpayerTypeId;
                for (var i = 0; i < rateEles.length; i++) {
                    var rate = $(rateEles[i]).data("value");
                    var taxRate = payerType.taxRates[rate];
                    if (taxRate) {
                        rateStr.push(rate);
                    } else {
                    	unRate.push(rate);
                        $(rateEles[i]).removeClass("radio-lu-sel1");
                        continue;
                    }
                }
            } else {
                layer.tips("请选择纳税人类型", "#tax_tip", {
                    tips: [2, 'red']
                });
                return false;
            }
            if (invoiceSettings.settings.taxpayerTypeId === typeId && $Utils.arraysEqual(rateStr, invoiceSettings.settings.taxRateId.split("|"))) {
                layer.tips("没有数据变化", "#tax_tip", {
                    tips: [2, 'red']
                });
                return false;
            }
            if (rateStr.length == 0) {
                layer.tips("请选择正确的税率", "#tax_tip", {
                    tips: [2, 'red']
                });
                $Utils.resetRadio("radio-rate", "radio-lu-sel1", unRate);
                return false;
            }
            $http.post(basePath + "manage/invoice/setting/save/tax" + suffix, {
                taxpayerTypeId: typeId,
                taxRateId: rateStr.join("|")
            }, function (data) {
                if (data.code == 200 && data.data.flag == true) {
                    invoiceSettings.settings.taxpayerTypeId = typeId;
                    invoiceSettings.settings.taxRateId = rateStr.join("|");
                    layer.tips("税率保存成功", "#tax_tip", {
                        tips: [2, 'green']
                    });
                } else {
                    layer.tips("税率保存失败", "#tax_tip", {
                        tips: [2, 'red']
                    });
                }
            });
        },
        saveSignture: function () {
            //上传图片
        }
    }
    invoiceSettings.getSignture();
    invoiceSettings.initPage();
    invoiceSettings.index();
    $("#tax_btn").on("click", function () {
        invoiceSettings.saveTax();
    })
    $("#basic_btn").on("click", function () {
        invoiceSettings.saveBasic();
    })
    $("#signture_btn").on("click", function () {
        invoiceSettings.saveBasic();
    })


})

$.validator.setDefaults({
    //光标离开时校验
    onfocusout: function (element) {
        $(element).valid();
    },
    //获取到焦点时去除错误提示信息
    onfocusin: function (element) {
        if (this.settings.focusCleanup) {
            $("#" + $(element).attr("id") + "_tip").text("");
        }
    },
    focusCleanup: true, //clear the error message when the error element get focus again.
    onkeyup: false,
    highlight: function (element, errorClass) {
        $(element).fadeOut(function () {
            $(element).fadeIn();
        });
    },
    errorPlacement: function (error, element) {
    	if(error.text() != "" && error.text() != null){
	    	layer.tips(error.text(),"#" + element.attr("id"),{tips:[1,'red']});
	      }
    }
});
$.validator.addMethod("bankName", function (value, element, param) {
    if(value) {
        return bankNameRegex.test(value);
    }
    return true;
}, bankNameRegexErrMsg);
$.validator.addMethod("contactPhone", function (value, element, param) {
//    if(value) {
        return mobileOrGhRegex.test(value);
//    }
//    return true;
}, "联系电话不符合格式");
$.validator.addMethod("accountNumber", function (value, element, param) {
    if(value) {
        return bankAccountRegex.test(value);
    }
    return true;
}, bankAccountRegexErrMsg);
$("#basic_form").validate({
    rules: {
        bankName: {
            bankName:true
        },
        accountNumber: {
            accountNumber: true
        },
        contactPhone: {
        	required:true,
            contactPhone: true
        }
    },
    messages: {
        bankName:bankNameRegexErrMsg,
        accountNumber:bankAccountRegexErrMsg,
        contactPhone:{
        	required:"企业联系电话不能为空",
        	contactPhone:"企业联系电话格式不正确"
        }
    }
});

