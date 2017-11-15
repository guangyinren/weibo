package cn.liuyong.weibo.comment.service;

import cn.liuyong.weibo.comment.model.Comment;

public interface ICommentService {

    int insertComment(Comment comment);

    Comment getCommentById(String id);

}
