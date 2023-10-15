package com.project.springbootlobrary.service;

import com.project.springbootlobrary.dao.BookRepo;
import com.project.springbootlobrary.dao.CheckoutRepo;
import com.project.springbootlobrary.dao.HistoryRepo;
import com.project.springbootlobrary.entities.Book;
import com.project.springbootlobrary.entities.Checkout;
import com.project.springbootlobrary.entities.History;
import com.project.springbootlobrary.responseModels.ShelfCurrentLoansResponse;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;


@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookService {
    @Autowired
    BookRepo bookRepo;
    @Autowired
    CheckoutRepo checkoutRepo;

    @Autowired
    HistoryRepo historyRepo;

    public Book checkoutBook(String userEmail, Long bookId) throws Exception {
        Optional<Book> book = bookRepo.findById(bookId);
        Checkout checkoutByUser = checkoutRepo.findByUserEmailAndBookId(userEmail, bookId);
        if (book.isEmpty() || checkoutByUser != null || book.get().getCopiesAvailable()<=0){
            throw new Exception("Book Does not exist or already checked out by user");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable()-1);
        bookRepo.save(book.get());
        Checkout checkout = Checkout.builder()
                .userEmail(userEmail)
                .bookId(bookId)
                .checkoutDate(LocalDate.now().toString())
                .returnDate(LocalDate.now().plusDays(7).toString())
                .build();
        checkoutRepo.save(checkout);
        return book.get();

    }

    public Boolean checkedOutByUser(Long bookId, String userEmail){
        Checkout checkoutByUser = checkoutRepo.findByUserEmailAndBookId(userEmail, bookId);
        return checkoutByUser != null;

    }

    public int getBookCountByUser(String userEmail) {
        return checkoutRepo.countByUserEmail(userEmail);
    }
    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws ParseException {
        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();
        List<Checkout> checkoutList = checkoutRepo.findBooksByUserEmail(userEmail);
        List<Long> bookIdList = checkoutList.stream().map(Checkout::getBookId).toList();
        List<Book> books = bookRepo.findBooksByBookIds(bookIdList);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        for (Book book:books){
            Optional<Checkout> checkout = checkoutList.stream()
                    .filter(checkout1 -> checkout1.getBookId() == book.getId()).findFirst();

            if(checkout.isPresent()){
                Date returnDate = sdf.parse(checkout.get().getReturnDate());
                Date todayDate = sdf.parse(LocalDate.now().toString());
                TimeUnit time = TimeUnit.DAYS;

                long difference_In_Time =time.convert(returnDate.getTime()-todayDate.getTime(),
                        TimeUnit.MILLISECONDS);
                shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(book, (int) difference_In_Time));
            }
        }
        return shelfCurrentLoansResponses;
    }

    public void returnBook(String userEmail, Long bookId) throws Exception {
        Optional<Book> book = bookRepo.findById(bookId);
        Checkout validateCheckout = checkoutRepo.findByUserEmailAndBookId(userEmail, bookId);
        if(book.isEmpty() || validateCheckout == null){
            throw new Exception("Book not exist or not check out by user");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable()+1);
        bookRepo.save(book.get());
        checkoutRepo.deleteById(validateCheckout.getId());
        History history = History.builder()
                .userEmail(userEmail)
                .checkoutDate(validateCheckout.getCheckoutDate())
                .description(book.get().getDescription())
                .title(book.get().getTitle())
                .img(book.get().getImg())
                .author(book.get().getAuthor())
                .returnedDate(LocalDate.now().toString())
                .build();
        historyRepo.save(history);

    }

    public void renewBook(String userEmail, Long bookId) throws ParseException {
        Checkout validateCheckout = checkoutRepo.findByUserEmailAndBookId(userEmail, bookId);
        if (validateCheckout==null){

        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        assert validateCheckout != null;
        Date returnDate = sdf.parse(validateCheckout.getReturnDate());
        Date todayDate = sdf.parse(LocalDate.now().toString());
        if(returnDate.compareTo(todayDate)>0 || returnDate.compareTo(todayDate)==0){
            validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepo.save(validateCheckout);
        }

    }


}
