package com.project.springbootlobrary.responseModels;

import lombok.*;
import lombok.experimental.FieldDefaults;

import javax.persistence.Column;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckoutResponse {
    Long bookId;

    String title;

    String author;

    String img;

    String userEmail;

    String reservationDate;

    String collectionDate;
}
