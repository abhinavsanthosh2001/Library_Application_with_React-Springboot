package com.project.springbootlobrary.dao;

import com.project.springbootlobrary.entities.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheckoutRepo extends JpaRepository<Checkout, Long> {
    Checkout findByUserEmailAndBookId(String userEmail, Long bookId);

    int countByUserEmail(String userEmail);

    List<Checkout> findBooksByUserEmail(String userEmail);
}
