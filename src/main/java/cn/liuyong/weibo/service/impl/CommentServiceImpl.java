package cn.liuyong.weibo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import cn.liuyong.weibo.dao.ICommentMapper;
import cn.liuyong.weibo.model.Comment;
import cn.liuyong.weibo.service.ICommentService;

@Service
public class CommentServiceImpl implements ICommentService {

    @Autowired
    private ICommentMapper commentMapper;

    @Override
    @Transactional(readOnly = false, propagation = Propagation.REQUIRES_NEW)
    public int insertComment(Comment comment) {
        return commentMapper.insertSelective(comment);
    }

    @Override
    public Comment getCommentById(String id) {
        return commentMapper.selectByPrimaryKey(id);
    }

}
