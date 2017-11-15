package cn.liuyong.weibo.user.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;

import cn.liuyong.weibo.user.dao.IUserMapper;
import cn.liuyong.weibo.user.model.User;
import cn.liuyong.weibo.user.service.IUserService;

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

    @Override
    public Page<User> queryUserByPage(Integer pageIndex, Integer pageSize) {
        PageHelper.startPage(pageIndex, pageSize);
        final List<User> list = userMapper.selectAllUser();
        Page<User> pages = (Page<User>) (list);
        return pages;
    }

}
