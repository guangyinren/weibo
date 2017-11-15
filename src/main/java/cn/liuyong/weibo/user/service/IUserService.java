package cn.liuyong.weibo.user.service;

import com.github.pagehelper.Page;

import cn.liuyong.weibo.user.model.User;

public interface IUserService {

    int insertUser(User user);

    User getUserById(String id);

    Page<User> queryUserByPage(Integer pageIndex, Integer pageSize);

}
