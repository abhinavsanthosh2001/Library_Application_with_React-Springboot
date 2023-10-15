package com.project.springbootlobrary.responseModels;

import com.project.springbootlobrary.entities.Book;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShelfCurrentLoansResponse {
    Book book;
    int daysLeft;

}
