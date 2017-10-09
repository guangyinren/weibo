/**
 * 判断日期，时间大小
 * 
 * @param {Object}
 *            startDate 起始日期
 * @param {Object}
 *            endDate 截止日期
 * @param {Object}
 *            canEq 是否可以相等
 * @return true||false
 */
function compareTime(startDate, endDate, canEq) {
	var result = false;
	var allStartDate = null;
	var allStartDate = null;
	var startDateTemp = startDate.split(" ");
	var endDateTemp = endDate.split(" ");
	var arrStartDate = startDateTemp[0].split("-");
	var arrEndDate = endDateTemp[0].split("-");
	if (startDateTemp.length > 1 && endDateTemp.length > 1) {
		var arrStartTime = startDateTemp[1].split(":");
		var arrEndTime = endDateTemp[1].split(":");
		allStartDate = new Date(arrStartDate[0], parseInt(arrStartDate[1] - 1), arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);
		allEndDate = new Date(arrEndDate[0], parseInt(arrEndDate[1] - 1), arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2]);
	} else {
		allStartDate = new Date(arrStartDate[0], parseInt(arrStartDate[1] - 1), arrStartDate[2]);
		allEndDate = new Date(arrEndDate[0], parseInt(arrEndDate[1] - 1), arrEndDate[2]);
	}
	if (canEq) {
		if (allStartDate.getTime() > allEndDate.getTime()) {
			result = false;
		} else {
			result = true;
		}
	} else {
		if (allStartDate.getTime() >= allEndDate.getTime()) {
			result = false;
		} else {
			result = true;
		}
	}
	return result;
}
/**
 * 去空格工具
 * 
 * @param {Object}
 *            value
 * @return {TypeName}
 */
function trim(value) {
	return value.replace(/\s+/g, "");
}
/**
 * 校验是否为数字
 * 
 * @param {Object}
 *            value
 * @return true||false
 */
function checkNum(value) {
	if (isNaN(value)) {
		// 不是数字返回false
		return false;
	}
	// 是数字返回true
	return true;
}
/**
 * 检查字符串是否以某值开头
 * 
 * @param {Object}
 *            value:字符串
 * @param {Object}
 *            startValue:检验是否包含的值
 * @return true||false
 */
function startWith(value, startValue) {
	var reg = new RegExp("^" + startValue);
	return reg.test(value);
}
/**
 * 检查字符串是否以某值结尾
 * 
 * @param {Object}
 *            value:字符串
 * @param {Object}
 *            endValue:检验是否包含的值
 * @return true||false
 */
function endWith(value, endValue) {
	var reg = new RegExp(endValue + "$");
	return reg.test(value);
}

function formatNumber(num, precision, separator) {
	var parts;
	// 判断是否为数字
	if (!isNaN(parseFloat(num)) && isFinite(num)) {
		// 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
		// 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
		// 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
		// 的值变成了 12312312.123456713
		num = Number(num);
		// 处理小数点位数
		num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
		// 分离数字的小数部分和整数部分
		parts = num.split('.');
		// 整数部分加[separator]分隔, 借用一个著名的正则表达式
		parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));

		return parts.join('.');
	}
	return NaN;
}

/**
 * 获取url路径参数
 * @returns {*}
 */
function getUrlParameters(){
	var query = location.search.substring(1);
	var entries = query.split("&");
	return Array.prototype.reduce.call(entries,function(obj,item){
		var param = item.split("=");
		obj[param[0]] = param[1];
		return obj;
	},{});
}

function getElementValueById(id){
	return document.getElementById(id).value.trim();
}

