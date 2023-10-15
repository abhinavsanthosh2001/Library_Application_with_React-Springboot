package com.project.springbootlobrary.requestModels;


import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddBookRequest {
    String title;
    String author;
    String description;
    int copies;
    String category;
    String img;
}
