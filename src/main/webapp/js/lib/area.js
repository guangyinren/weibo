/**
 * Created by Songdan on 2016/5/18.
 * 基于JQuery开发
 */
(function (window, $) {
    function Area(item) {
        this.area_code = item.areaCode;
        this.area_name = item.areaName;
    }

    Area.prototype.toOption = function () {
        var that = this;
        return "<option value='" + that.area_code + "'>" + that.area_name + "</option>";
    };

    /**
     *清空下拉菜单,只保留原来的样子
     */
    function clearSelectElement(id) {
        $("#" + id).empty();
    }

    /**
     * copy对象属性
     * @param source
     * @param target
     * @returns {Object}
     */
    function objectCopy(source,target,isExpand) {
        var result = {};
        for (var key in target) {
            result[key] = target[key];
        }
        for(var key in source) {
            if (isExpand == true) {
                result[key] = source[key];
            }else {
                if (target.hasOwnProperty(key)) {
                    result[key] = source[key];
                }
            }
        }
        return result;
    }

    var areaData = {};
    var provinceData = [];
    var areaUrl = "/js/data/area/area.json";
    var provinceUrl = "/js/data/area/provinces.json";
    $.ajax({
        url: areaUrl,
        async: false,
        dataType: 'json',
        success: function (data) {
            areaData = data;
        }
    });
    $.ajax({
        url: provinceUrl,
        async: false,
        dataType: 'json',
        success: function (data) {
            provinceData = data;
        }
    });
    window.AreaSelect = {
        config:{
            eleId:"demo",
            provinceId:"provinceId",
            cityId:"cityId",
            provinceValue:"",
            cityValue:"",
            defaultProvinceHTML: "<option value=''>选择省</option>",
            defaultCityHTML: "<option value=''>选择市/区</option>"

        },
        areaData:areaData,
        provinceData:provinceData,
        /**
         * 初始化级联菜单
         * @param config {eleId:"承载级联菜单的元素id，页面必须要有此元素，必填项",
            provinceId:"级联菜单中省下拉菜单的元素id，必填项",
            cityId:"级联菜单中市下拉菜单的元素id，必填项",
            provinceValue:"初始化时，省的默认值",
            cityValue:""初始化时，市的默认值}
         */
        init:function(config) {
            var result = objectCopy(config,this.config);
            $("#" + result.eleId).html('' +
                '<select class="order_select" id="' + result.provinceId + '" name="provinces" style="margin-right:15px">' + result.defaultProvinceHTML + '</select>' +
                '<select class="order_select" id="' + result.cityId + '" name="cities">' + result.defaultCityHTML + '</select>'
            );
            var that = this;
            var $select = $("#" + result.provinceId);
            that.fillSelectElement(result.provinceId, provinceData);
            if (result.provinceValue) {
                $select.val(result.provinceValue);
                that.fillSelectElement(result.cityId, areaData[result.provinceValue]);
                if (result.cityValue) {
                    $("#" + result.cityId).val(result.cityValue);
                }
            }
            $select.on("change", function () {
                var selectedValue = $select.val();
                /*
                 *如果选中的值为空，清空二级菜单
                 * 如果不为空，加载对应的城市数据
                 */
                clearSelectElement(result.cityId);
                if (selectedValue == "") {
                    that.revertCitySelect(result.cityId);
                } else {
                    that.fillSelectElement(result.cityId, areaData[selectedValue])
                }
            });
            var object = objectCopy({}, that);
            object.config = result;
            return object;

        },
        select:function(provinceValue,cityValue) {
            var that = this;
            if (provinceValue) {
                var $proSelect = $("#" + that.config.provinceId+" option[value='"+provinceValue+"']");
                $proSelect.prop("selected",true);
                that.fillSelectElement(that.config.cityId, that.areaData[provinceValue]);
                if (cityValue) {
                    $("#" + that.config.cityId+" option[value='"+cityValue+"']").prop("selected",true);
                }
            }
        },
        revertCitySelect: function (id) {
            $("#" + id).html(AreaSelect.config.defaultCityHTML);
        },
        fillSelectElement: function (id, data) {
            if (Object.prototype.toString.call(data) != "[object Array]") {
                console.error("不能填充非数组数据");
                return ;
            }
            var $select = $("#" + id);
            for(var i = 0;i<data.length;i++) {
                var item = data[i];
                $select.append(new Area(item).toOption());
            }
        }
    };
/*
    Object.defineProperty(AreaSelect, "areaData", {
        writable: false,
        enumerable:true,
        value: areaData
    });
    Object.defineProperty(AreaSelect, "provinceData", {
        writable: false,
        enumerable:true,
        value: provinceData
    });
*/
})(window, jQuery);
