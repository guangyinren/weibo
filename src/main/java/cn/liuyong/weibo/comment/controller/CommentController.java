package cn.liuyong.weibo.comment.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.Page;

import cn.liuyong.weibo.comment.model.Comment;
import cn.liuyong.weibo.comment.service.ICommentService;
import cn.liuyong.weibo.util.RuntimeConstant;

@Controller
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    private ICommentService commentService;

    @RequestMapping("/saveComment")
    public void toIndex(HttpServletRequest request, HttpServletResponse response) {
        // commentService.insertComment(comment);
        response.setContentType("application/json;charset=UTF-8");
        ObjectMapper mapper = new ObjectMapper();
        try {
            mapper.writeValue(response.getWriter(), new HashMap<String, Object>() {

                {
                    put(RuntimeConstant.CODE, 200);
                    put(RuntimeConstant.MSG, "");
                    put(RuntimeConstant.DATA, null);
                }
            });
        }
        catch (JsonGenerationException e) {
            e.printStackTrace();
        }
        catch (JsonMappingException e) {
            e.printStackTrace();
        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping("/queryCommentByPage")
    @ResponseBody
    public Map<String, Object> queryCommentByPage(Integer pageNumber, Integer pageSize, HttpServletResponse response) {
        Page<Comment> commentPage = commentService.queryCommentByPage(pageNumber, pageSize);
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("total", commentPage.getTotal());
        dataMap.put("rows", commentPage.getResult());
        return dataMap;
    }

}
