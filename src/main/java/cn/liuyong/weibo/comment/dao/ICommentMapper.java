package cn.liuyong.weibo.comment.dao;

import java.util.List;

import cn.liuyong.weibo.comment.model.Comment;

public interface ICommentMapper {

    int deleteByPrimaryKey(String id);

    int insert(Comment record);

    int insertSelective(Comment record);

    Comment selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(Comment record);

    int updateByPrimaryKey(Comment record);

    List<Comment> selectAllComment();
}
