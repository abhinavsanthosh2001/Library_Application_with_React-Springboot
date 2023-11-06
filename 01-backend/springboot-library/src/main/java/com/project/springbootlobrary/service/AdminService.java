package com.project.springbootlobrary.service;

import com.project.springbootlobrary.dao.BookRepo;
import com.project.springbootlobrary.dao.CheckoutRepo;
import com.project.springbootlobrary.dao.HistoryRepo;
import com.project.springbootlobrary.dao.ReserveBookRepo;
import com.project.springbootlobrary.entities.Book;
import com.project.springbootlobrary.entities.Checkout;
import com.project.springbootlobrary.entities.Reserve;
import com.project.springbootlobrary.requestModels.AddBookRequest;
import com.project.springbootlobrary.responseModels.CheckoutResponse;
import com.project.springbootlobrary.responseModels.ReserveResponse;
import com.project.springbootlobrary.responseModels.UserCard;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
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
    @Autowired
    HistoryRepo historyRepo;

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

    public void renewBookByAdmin(String userEmail, Long bookId) throws Exception {
        Checkout validateCheckout = checkoutRepo.findByUserEmailAndBookId(userEmail, bookId);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        assert validateCheckout != null;
        Date returnDate = sdf.parse(validateCheckout.getReturnDate());
        Date todayDate = sdf.parse(LocalDate.now().toString());
        if(returnDate.compareTo(todayDate)>0 || returnDate.compareTo(todayDate)==0){
            validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepo.save(validateCheckout);
        }
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
                .renewCount(0)
                .build();
        checkoutRepo.save(checkout);
        return book.get();

    }
    public List<CheckoutResponse> getCheckoutsByEmail(String userEmail) {
        List<Checkout> reserves = checkoutRepo.findBooksByUserEmail(userEmail);
        List<CheckoutResponse> checkedBooks = new ArrayList<>();
        reserves.forEach(reserve ->{
            Optional<Book> bookOptional = bookRepo.findById(reserve.getBookId());
            if(bookOptional.isPresent()){
                Book checkedBook = bookOptional.get();
                CheckoutResponse checkoutResponse = CheckoutResponse.builder()
                        .title(checkedBook.getTitle())
                        .bookId(checkedBook.getId())
                        .author(checkedBook.getAuthor())
                        .img(checkedBook.getImg())
                        .userEmail(userEmail)
                        .reservationDate(reserve.getCheckoutDate())
                        .returnDate(reserve.getReturnDate())
                        .build();
                checkedBooks.add(checkoutResponse);
            }
        });
        return checkedBooks;
    }
    public List<ReserveResponse> getReservesByEmail(String userEmail) {
        List<Reserve> reserves = reserveBookRepo.findByUserEmail(userEmail);
        List<ReserveResponse> reservedBooks = new ArrayList<>();
        reserves.forEach(reserve -> {
            Optional<Book> bookOptional = bookRepo.findById(reserve.getBookId());
            if(bookOptional.isPresent()) {
                Book reservedBook = bookOptional.get();
                ReserveResponse reserveResponse = ReserveResponse.builder()
                        .img(reservedBook.getImg())
                        .userEmail(userEmail)
                        .reservationDate(reserve.getReserveDate())
                        .author(reservedBook.getAuthor())
                        .bookId(reservedBook.getId()).title(reservedBook.getTitle())
                        .build();
                reservedBooks.add(reserveResponse);
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

    public UserCard getUserDetails(String userEmail) {
        int countCheckoutsByUserEmail = checkoutRepo.findBooksByUserEmail(userEmail).size();
        int countHistoryByUserEmail = historyRepo.countByUserEmail(userEmail);
        int countReservationsByUserEmail = reserveBookRepo.countByUserEmail(userEmail);
        return UserCard.builder()
                .userEmail(userEmail)
                .reservedBooks(countReservationsByUserEmail)
                .checkedoutBooks(countCheckoutsByUserEmail)
                .historyCount(countHistoryByUserEmail)
                .build();
    }


}
