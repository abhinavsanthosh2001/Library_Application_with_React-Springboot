package com.project.springbootlobrary.service;

import com.project.springbootlobrary.dao.BookRepo;
import com.project.springbootlobrary.entities.Book;
import com.project.springbootlobrary.requestModels.AddBookRequest;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminService {
    @Autowired
    BookRepo bookRepo;

    public void postBook(AddBookRequest addBookRequest){
        Book book = Book.builder()
                .title(addBookRequest.getTitle())
                .copies(addBookRequest.getCopies())
                .img(addBookRequest.getImg())
                .author(addBookRequest.getAuthor())
                .category(addBookRequest.getCategory())
                .copiesAvailable(addBookRequest.getCopies())
                .description(addBookRequest.getDescription())
                .build();
        bookRepo.save(book);
    }

    public void deleteBookById(Long bookId) {
        bookRepo.deleteById(bookId);
    }

    public void changeQuantity(Long bookId, Boolean add) throws Exception {
        Optional<Book> optionalBook = bookRepo.findById(bookId);
        if(optionalBook.isEmpty()){
            throw new Exception("Book Not Found");
        }
        Book book = optionalBook.get();
        if (add){
            book.setCopiesAvailable(book.getCopiesAvailable()+1);
            book.setCopies(book.getCopies()+1);
        }
        else{
            if (book.getCopiesAvailable()>0){
                book.setCopiesAvailable(book.getCopiesAvailable()-1);
                book.setCopies(book.getCopies()-1);
            }
            else{
                throw new Exception("Wait till readers return the book");
            }
        }


    }
}
