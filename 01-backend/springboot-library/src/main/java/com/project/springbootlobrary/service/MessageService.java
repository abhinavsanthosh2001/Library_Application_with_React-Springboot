package com.project.springbootlobrary.service;

import com.project.springbootlobrary.dao.MessageRepo;
import com.project.springbootlobrary.entities.Message;
import com.project.springbootlobrary.requestModels.AdminQuestionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class MessageService {
    @Autowired
    MessageRepo messageRepo;

    public void postMessage(Message messageRequest, String userEmail){
        Message message = Message.builder()
                .title(messageRequest.getTitle())
                .question(messageRequest.getQuestion())
                .userEmail(userEmail)
                .build();
        messageRepo.save(message);
    }
    public void putMessage(AdminQuestionRequest adminQuestionRequest,String userEmail) throws Exception {
        Optional<Message> message = messageRepo.findById(adminQuestionRequest.getId());
        if(message.isEmpty()){
            throw new Exception("Message not Found");
        }
        message.get().setAdminEmail(userEmail);
        message.get().setResponse(adminQuestionRequest.getResponse());
        message.get().setClosed(true);
        messageRepo.save(message.get());
    }
}
