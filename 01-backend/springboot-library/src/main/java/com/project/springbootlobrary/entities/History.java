package com.project.springbootlobrary.entities;

import lombok.*;
import lombok.experimental.FieldDefaults;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "history")
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    Long id;
    @Column(name = "user_email")
    String userEmail;
    @Column(name = "checkout_date")
    String checkoutDate;
    @Column(name = "returned_date")
    String returnedDate;
    @Column(name = "title")
    String title;
    @Column(name = "author")
    String author;
    @Column(name = "description")
    String description;
    @Column(name = "img")
    String img;
}
