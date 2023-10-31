package com.project.springbootlobrary.responseModels;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCard {
    String userEmail;
    long checkedoutBooks;
    long reservedBooks;
    long historyCount;
}
