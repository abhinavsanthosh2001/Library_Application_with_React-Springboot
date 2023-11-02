package com.project.springbootlobrary.responseModels;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CheckoutResponse {
    Long bookId;

    String title;

    String author;

    String userEmail;

    String reservationDate;

    String returnDate;

    String img;

    String collectionDate;
}
