package com.project.springbootlobrary.dao;

import com.project.springbootlobrary.entities.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

@Repository
public interface HistoryRepo extends JpaRepository<History, Long> {

    Page<History> findBooksByUserEmail(@RequestParam("email") String userEmail, Pageable pageable);

}
