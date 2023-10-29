package com.project.springbootlobrary.service;

import com.project.springbootlobrary.dao.BookRepo;
import com.project.springbootlobrary.dao.CheckoutRepo;
import com.project.springbootlobrary.dao.ReserveBookRepo;
import com.project.springbootlobrary.entities.Book;
import com.project.springbootlobrary.entities.Checkout;
import com.project.springbootlobrary.entities.Reserve;
import com.project.springbootlobrary.requestModels.AddBookRequest;
import com.project.springbootlobrary.responseModels.CheckoutResponse;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class AdminService {
    @Autowired
    BookRepo bookRepo;

    @Autowired
    CheckoutRepo checkoutRepo;

    @Autowired
    ReserveBookRepo reserveBookRepo;

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

    public Book checkoutBook(String userEmail, Long bookId) throws Exception {
        Optional<Book> book = bookRepo.findById(bookId);
        int countByUserEmail = checkoutRepo.countByUserEmail(userEmail);
        Checkout checkoutByUser = checkoutRepo.findByUserEmailAndBookId(userEmail, bookId);
        if (book.isEmpty() || checkoutByUser != null || book.get().getCopiesAvailable()<=0|| countByUserEmail>=5) {
            throw new Exception("Book Does not exist or already checked out by user");
        }
        //book.get().setCopiesAvailable(book.get().getCopiesAvailable()-1); removed as count is reduced when book is reserved
        //bookRepo.save(book.get());
        deleteReserve(userEmail, bookId);
        Checkout checkout = Checkout.builder()
                .userEmail(userEmail)
                .bookId(bookId)
                .checkoutDate(LocalDate.now().toString())
                .returnDate(LocalDate.now().plusDays(7).toString())
                .build();
        checkoutRepo.save(checkout);
        return book.get();

    }
    public List<CheckoutResponse> getReservesByEmail(String userEmail) {
        List<Reserve> reserves = reserveBookRepo.findByUserEmail(userEmail);
        List<CheckoutResponse> reservedBooks = new ArrayList<>();
        reserves.forEach(reserve -> {
            Optional<Book> bookOptional = bookRepo.findById(reserve.getBookId());
            if(bookOptional.isPresent()) {
                Book reservedBook = bookOptional.get();
                CheckoutResponse checkoutResponse = CheckoutResponse.builder()
                        .img(reservedBook.getImg())
                        .userEmail(userEmail)
                        .reservationDate(reserve.getReserveDate())
                        .author(reservedBook.getAuthor())
                        .bookId(reservedBook.getId()).title(reservedBook.getTitle())
                        .build();
                reservedBooks.add(checkoutResponse);
            }

        });

        return reservedBooks;
    }

    public void deleteReserve(String userEmail, Long bookId) throws Exception {
        Reserve byUserEmailAndBookId = reserveBookRepo.findByUserEmailAndBookId(userEmail, bookId);
        if (byUserEmailAndBookId!=null){
            reserveBookRepo.deleteById(byUserEmailAndBookId.getId());
            Optional<Book> byBookId = bookRepo.findById(bookId);
            if(byBookId.isEmpty()){
                throw new Exception("No book present with this Id");
            }
            byBookId.get().setCopiesAvailable(byBookId.get().getCopiesAvailable()+1);
            bookRepo.save(byBookId.get());
        }
    }

    public void checkoutBooks(String userEmail, List<Long> bookIds) throws Exception {
        long count = checkoutRepo.findBooksByUserEmail(userEmail).size();
        if (count+bookIds.size()>5){
            throw new Exception("Checkout Limit Exceeded");
        }
        bookIds.forEach(bookId->{
            try {
                checkoutBook(userEmail, bookId);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
    }
}
