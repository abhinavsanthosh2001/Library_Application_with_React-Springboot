package com.project.springbootlobrary.requestModels;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Optional;
import java.util.PrimitiveIterator;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewRequest {
    double rating;
    Long bookId;
    Optional<String> reviewDescription;
}
