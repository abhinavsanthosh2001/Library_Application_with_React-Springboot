package com.project.springbootlobrary.controller;

import com.project.springbootlobrary.requestModels.ReviewRequest;
import com.project.springbootlobrary.service.ReviewService;
import com.project.springbootlobrary.utils.ExtractJWT;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/reviews")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewController {
    @Autowired
    ReviewService reviewService;

    @PostMapping("/secure")
    public void postReview(@RequestHeader(value = "Authorization") String token, @RequestBody ReviewRequest request) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if (userEmail==null){
            throw new Exception("User Email is missing");
        }
        reviewService.postReview(userEmail, request);
    }

    @GetMapping("/secure/user/book")
    public boolean reviewBookByUser(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if (userEmail==null){
            throw new Exception("User Email is missing");
        }
        return reviewService.userReviewListed(userEmail, bookId);
    }


}
