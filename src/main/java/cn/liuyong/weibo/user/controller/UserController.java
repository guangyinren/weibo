package cn.liuyong.weibo.user.controller;

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

import cn.liuyong.weibo.user.model.User;
import cn.liuyong.weibo.user.service.IUserService;
import cn.liuyong.weibo.util.RuntimeConstant;

@Controller
@RequestMapping("user")
public class UserController {

    @Autowired
    private IUserService userService;

    @RequestMapping("/saveUser")
    public void toIndex(HttpServletRequest request, HttpServletResponse response) {
        // userService.insertComment(comment);
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

    @RequestMapping("/queryUserByPage")
    @ResponseBody
    public Map<String, Object> queryUserByPage(Integer pageNumber, Integer pageSize, HttpServletResponse response) {
        Page<User> userPage = userService.queryUserByPage(pageNumber, pageSize);
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("total", userPage.getTotal());
        dataMap.put("rows", userPage.getResult());
        return dataMap;
    }

}
