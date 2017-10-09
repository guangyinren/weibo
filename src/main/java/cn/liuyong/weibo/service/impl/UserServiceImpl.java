package cn.liuyong.weibo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import cn.liuyong.weibo.dao.IUserMapper;
import cn.liuyong.weibo.model.User;
import cn.liuyong.weibo.service.IUserService;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private IUserMapper userMapper;

    @Override
    @Transactional(readOnly = false, propagation = Propagation.REQUIRES_NEW)
    public int insertUser(User user) {
        return userMapper.insertSelective(user);
    }

    @Override
    public User getUserById(String id) {
        return userMapper.selectByPrimaryKey(id);
    }

}
