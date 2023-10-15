package com.project.springbootlobrary.entities;

import lombok.*;
import lombok.experimental.FieldDefaults;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "messages")
@Builder
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    Long id;
    @Column(name = "user_email")
    String userEmail;
    @Column(name = "title")
    String title;
    @Column(name = "question")
    String question;
    @Column(name = "admin_email")
    String adminEmail;
    @Column(name = "closed")
    boolean closed;
    @Column(name="response")
    private String response;

}
