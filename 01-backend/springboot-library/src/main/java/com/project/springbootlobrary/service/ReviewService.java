package com.project.springbootlobrary.service;

import com.project.springbootlobrary.dao.BookRepo;
import com.project.springbootlobrary.dao.ReviewRepo;
import com.project.springbootlobrary.entities.Review;
import com.project.springbootlobrary.requestModels.ReviewRequest;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;

@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewService {
    @Autowired
    ReviewRepo reviewRepo;

    public void postReview(String userEmail, ReviewRequest reviewRequest) throws Exception {
        Review validateReview = reviewRepo.findByUserEmailAndBookId(userEmail, reviewRequest.getBookId());
        if (validateReview != null) {
            throw new Exception("Review already created");
        }

        Review review = new Review();
        review.setBookId(reviewRequest.getBookId());
        review.setRating(reviewRequest.getRating());
        review.setUserEmail(userEmail);
        if (reviewRequest.getReviewDescription().isPresent()) {
            review.setReviewDescription(reviewRequest.getReviewDescription().map(
                    Object::toString
            ).orElse(null));
        }
        review.setDate(Date.valueOf(LocalDate.now()));
        reviewRepo.save(review);
    }

    public boolean userReviewListed(String userEmail, Long bookId) throws Exception {
        Review validateReview = reviewRepo.findByUserEmailAndBookId(userEmail, bookId);
        return validateReview != null;
    }


    }
