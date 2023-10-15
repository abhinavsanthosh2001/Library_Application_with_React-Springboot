package com.project.springbootlobrary.controller;

import com.project.springbootlobrary.entities.Message;
import com.project.springbootlobrary.requestModels.AdminQuestionRequest;
import com.project.springbootlobrary.service.MessageService;
import com.project.springbootlobrary.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/messages")
public class MessageController {
    @Autowired
    MessageService messageService;

    @PostMapping("/secure/add/message")
    public void postMessage(@RequestHeader(value = "Authorization") String token, @RequestBody Message message){
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        messageService.postMessage(message,userEmail);
    }

    @PutMapping("/secure/admin/message")
    public void putMapping(@RequestHeader(value = "Authorization") String token, @RequestBody AdminQuestionRequest adminQuestionRequest) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if(admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only.");
        }
        messageService.putMessage(adminQuestionRequest,userEmail);
    }
}
