package cn.liuyong.weibo.model;

import java.io.Serializable;
import java.util.List;

/**
 * 微博评论接口返回主体
 * 
 * @author liuyong
 * @date 2017年10月7日
 */
public class Cardgroup implements Serializable {

    /**
     * @fields serialVersionUID : TODO(用一句话描述这个变量表示什么)
     */
    private static final long serialVersionUID = -4289276643921057216L;

    private String mod_type;

    private String previous_cursor;

    private String next_cursor;

    private List<Comment> card_group;

    public String getMod_type() {
        return mod_type;
    }

    public void setMod_type(String mod_type) {
        this.mod_type = mod_type;
    }

    public String getPrevious_cursor() {
        return previous_cursor;
    }

    public void setPrevious_cursor(String previous_cursor) {
        this.previous_cursor = previous_cursor;
    }

    public String getNext_cursor() {
        return next_cursor;
    }

    public void setNext_cursor(String next_cursor) {
        this.next_cursor = next_cursor;
    }

    public List<Comment> getCard_group() {
        return card_group;
    }

    public void setCard_group(List<Comment> card_group) {
        this.card_group = card_group;
    }

}
