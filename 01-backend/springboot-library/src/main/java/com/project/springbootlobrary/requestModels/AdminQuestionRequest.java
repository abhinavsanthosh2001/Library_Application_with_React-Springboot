package com.project.springbootlobrary.requestModels;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminQuestionRequest {
    long id;
    String response;
}
