package com.project.springbootlobrary.responseModels;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReserveResponse {
    Long bookId;

    String title;

    String author;

    String img;

    String userEmail;

    String reservationDate;
}
