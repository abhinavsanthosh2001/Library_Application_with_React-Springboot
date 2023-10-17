package com.project.springbootlobrary.entities;

import lombok.*;
import lombok.experimental.FieldDefaults;

import javax.persistence.*;

@Table(name = "reserve_books")
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Builder
public class Reserve {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    long id;

    @Column(name = "book_id")
    long bookId;

    @Column(name = "user_email")
    String userEmail;

    @Column(name = "reserve_date")
    String reserveDate;
}
