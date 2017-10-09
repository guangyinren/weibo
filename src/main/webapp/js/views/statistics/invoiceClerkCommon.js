/**
 * Created by Songdan on 2016/4/15.
 */
/**
 * Invoice Constructor
 * @author SongDan
 */
function Invoice(item,index){
    try{
    	//序号
    	this.index = index;
    	//开票员
        this.kpr=item.kpr?item.kpr:"";
        //开票时间起
        this.beginTime=item.beginTime?item.beginTime:"";
        //开票时间止
        this.endTiime=item.endTiime?item.endTiime:"";
        //发票种类代码
        this.fpzldm=item.fpzldm?item.fpzldm:"";
        //开票成功数量
        this.number=item.number?item.number:"";
        //开票总税额
        this.zse=item.zse?item.zse:"";
        //开票总合计金额
        this.zje=item.zje?item.zje:"";
    }catch(e){
        console.info(e);
    }
}

Invoice.prototype={
    /**
     * 填充数据，返回填充后的字符串
     * @returns {string}
     */
    fillListData: function () {
        var strs = [];
        strs.push('<tr>');
        strs.push('<td>'+this.index+'</td>');
        strs.push('<td>'+this.kpr+'</td>');
        strs.push('<td>'+this.beginTime+'</td>');
        strs.push('<td>'+this.endTiime+'</td>');
        if(this.fpzldm == "04" || this.fpzldm == 04){
        	strs.push('<td>纸质增值税普通发票</td>');
        }else if(this.fpzldm == "01" || this.fpzldm == 01){
        	strs.push('<td>纸质增值税专用发票</td>');
        }else if(this.fpzldm == "10" || this.fpzldm == 10){
        	strs.push('<td>电子增值税普通发票</td>');
        }
        strs.push('<td>'+this.number+'</td>');
        strs.push('<td>'+this.zse+'</td>');
        strs.push('<td>'+this.zje+'</td>');
        strs.push('</tr>');
        return strs.join("");
    },
    fillDetailData:function() {
    	$("#kpr").val(this.kpr);
    	$("#gmfMc").val(this.gmfmc);
    	$("#beginTime").val(this.beginTime);
    	$("#endTiime").val(this.endTiime);
    	$("#number").val(this.number);
    	$("#zse").val(this.zse);
    	$("#zje").text(this.zje);
    },
}

