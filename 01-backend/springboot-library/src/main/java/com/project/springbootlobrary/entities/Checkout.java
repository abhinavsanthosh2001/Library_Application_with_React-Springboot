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
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "checkout")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Checkout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    Long id;

    @Column(name = "user_email")
    String userEmail;

    @Column(name = "checkout_date")
    String checkoutDate;

    @Column(name = "return_date")
    String returnDate;

    @Column(name = "book_id")
    Long bookId;

    @Column(name = "renew_count")
    int renewCount;

}
