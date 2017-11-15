package cn.liuyong.weibo.user.dao;

import java.util.List;

import cn.liuyong.weibo.user.model.User;

public interface IUserMapper {

    int deleteByPrimaryKey(String id);

    int insert(User record);

    int insertSelective(User record);

    User selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);

    List<User> selectAllUser();
}
