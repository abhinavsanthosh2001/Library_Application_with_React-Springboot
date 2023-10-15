package com.project.springbootlobrary.dao;

import com.project.springbootlobrary.entities.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Repository
public interface BookRepo extends JpaRepository<Book,Long> {
    Page<Book> findByTitleContaining(@RequestParam("title") String title, Pageable pageable);
    Page<Book> findByCategory(@RequestParam("title") String category, Pageable pageable);


    @Query(value = "SELECT * FROM BOOK WHERE id IN :book_ids",nativeQuery = true)
    List<Book> findBooksByBookIds(@Param("book_ids") List<Long> bookIdList);
}
