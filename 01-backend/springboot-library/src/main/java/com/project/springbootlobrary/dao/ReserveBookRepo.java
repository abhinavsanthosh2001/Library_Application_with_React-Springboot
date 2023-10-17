package com.project.springbootlobrary.dao;

import com.project.springbootlobrary.entities.Checkout;
import com.project.springbootlobrary.entities.Reserve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReserveBookRepo extends JpaRepository<Reserve, Long> {

    Reserve findByUserEmailAndBookId(String userEmail, Long bookId);

}
