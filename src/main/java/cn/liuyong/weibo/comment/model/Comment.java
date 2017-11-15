package cn.liuyong.weibo.comment.model;

import java.io.Serializable;

import cn.liuyong.weibo.user.model.User;

/**
 * 微博评论接口返回主体
 * 
 * @author liuyong
 * @date 2017年10月7日
 */
public class Comment implements Serializable {

    /**
     * @fields serialVersionUID : TODO(用一句话描述这个变量表示什么)
     */
    private static final long serialVersionUID = -4289276643921057216L;

    /**
     * 评论id
     */
    private String id;

    /**
     * 创建时间
     */
    private String created_at;

    /**
     * 来源（手机型号）
     */
    private String source;

    /**
     * 发表用户
     */
    private User user;

    private String user_id;

    /**
     * 评论内容
     */
    private String text;

    /**
     * 父评论
     */
    private String reply_id;

    /**
     * 父评论内容
     */
    private String reply_text;

    /**
     * 点赞数
     */
    private int like_counts;

    private boolean liked;

    private String mod_type;

    private String type;

    private String url;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCreated_at() {
        return created_at;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getReply_id() {
        return reply_id;
    }

    public void setReply_id(String reply_id) {
        this.reply_id = reply_id;
    }

    public String getReply_text() {
        return reply_text;
    }

    public void setReply_text(String reply_text) {
        this.reply_text = reply_text;
    }

    public int getLike_counts() {
        return like_counts;
    }

    public void setLike_counts(int like_counts) {
        this.like_counts = like_counts;
    }

    public boolean isLiked() {
        return liked;
    }

    public void setLiked(boolean liked) {
        this.liked = liked;
    }

    public String getMod_type() {
        return mod_type;
    }

    public void setMod_type(String mod_type) {
        this.mod_type = mod_type;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

}
