package cn.liuyong.weibo.user.model;

import java.io.Serializable;

/**
 * 发表评论用户实体
 * 
 * @author liuyong
 * @date 2017年10月7日
 */
public class User implements Serializable {

    /**
     * @fields serialVersionUID : TODO(用一句话描述这个变量表示什么)
     */
    private static final long serialVersionUID = -4569040024613576410L;

    /**
     * id
     */
    private String id;

    /**
     * 用户昵称
     */
    private String screen_name;

    private String profile_image_url;

    private String verified;

    private String verified_type;

    private String mbtype;

    private String profile_url;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getScreen_name() {
        return screen_name;
    }

    public void setScreen_name(String screen_name) {
        this.screen_name = screen_name;
    }

    public String getProfile_image_url() {
        return profile_image_url;
    }

    public void setProfile_image_url(String profile_image_url) {
        this.profile_image_url = profile_image_url;
    }

    public String getVerified() {
        return verified;
    }

    public void setVerified(String verified) {
        this.verified = verified;
    }

    public String getVerified_type() {
        return verified_type;
    }

    public void setVerified_type(String verified_type) {
        this.verified_type = verified_type;
    }

    public String getMbtype() {
        return mbtype;
    }

    public void setMbtype(String mbtype) {
        this.mbtype = mbtype;
    }

    public String getProfile_url() {
        return profile_url;
    }

    public void setProfile_url(String profile_url) {
        this.profile_url = profile_url;
    }

}
