package cn.liuyong.weibo.service;

import cn.liuyong.weibo.model.Comment;

public interface ICommentService {

    int insertComment(Comment comment);

    Comment getCommentById(String id);

}
