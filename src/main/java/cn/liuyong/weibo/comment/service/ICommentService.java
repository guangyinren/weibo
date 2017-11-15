package cn.liuyong.weibo.comment.service;

import com.github.pagehelper.Page;

import cn.liuyong.weibo.comment.model.Comment;

public interface ICommentService {

    int insertComment(Comment comment);

    Comment getCommentById(String id);

    Page<Comment> queryCommentByPage(Integer pageNumber, Integer pageSize);

}
