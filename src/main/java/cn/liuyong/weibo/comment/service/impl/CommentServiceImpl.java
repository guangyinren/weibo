package cn.liuyong.weibo.comment.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;

import cn.liuyong.weibo.comment.dao.ICommentMapper;
import cn.liuyong.weibo.comment.model.Comment;
import cn.liuyong.weibo.comment.service.ICommentService;

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

    @Override
    public Page<Comment> queryCommentByPage(Integer pageNumber, Integer pageSize) {
        PageHelper.startPage(pageNumber, pageSize);
        final List<Comment> list = commentMapper.selectAllComment();
        Page<Comment> pages = (Page<Comment>) (list);
        return pages;
    }

}
