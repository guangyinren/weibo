package cn.liuyong.weibo.service;

import cn.liuyong.weibo.model.User;

public interface IUserService {

    int insertUser(User user);

    User getUserById(String id);

}
