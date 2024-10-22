package com.project.springbootlobrary.service;

import com.project.springbootlobrary.dao.BookRepo;
import com.project.springbootlobrary.dao.CheckoutRepo;
import com.project.springbootlobrary.dao.HistoryRepo;
import com.project.springbootlobrary.dao.ReserveBookRepo;
import com.project.springbootlobrary.entities.Book;
import com.project.springbootlobrary.entities.Checkout;
import com.project.springbootlobrary.entities.History;
import com.project.springbootlobrary.entities.Reserve;
import com.project.springbootlobrary.responseModels.CheckoutResponse;
import com.project.springbootlobrary.responseModels.CollectionDateResponse;
import com.project.springbootlobrary.responseModels.ShelfCurrentLoansResponse;
import lombok.AccessLevel;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.type.LocalDateType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static com.fasterxml.jackson.databind.type.LogicalType.DateTime;


@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class BookService {
    @Autowired
    BookRepo bookRepo;
    @Autowired
    CheckoutRepo checkoutRepo;

    @Autowired
    HistoryRepo historyRepo;

    @Autowired
    ReserveBookRepo reserveBookRepo;

    final int renewLimit = 1;


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
                shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(book, (int) difference_In_Time,checkout.get().getRenewCount()<renewLimit&&(int)difference_In_Time>=0));
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

    public void renewBook(String userEmail, Long bookId) throws Exception {
        Checkout validateCheckout = checkoutRepo.findByUserEmailAndBookId(userEmail, bookId);
        if (validateCheckout==null){
            throw new Exception("Checkout Details not found");
        }
        if(validateCheckout.getRenewCount()>=renewLimit){
            throw new Exception("Renew Limit Exceeded");
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date returnDate = sdf.parse(validateCheckout.getReturnDate());
        Date todayDate = sdf.parse(LocalDate.now().toString());
        if(returnDate.compareTo(todayDate)>0 || returnDate.compareTo(todayDate)==0){
            validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            validateCheckout.setRenewCount(validateCheckout.getRenewCount()+1);
            checkoutRepo.save(validateCheckout);
        }else{
            throw new Exception("Cannot renew once return date is exceeded.");
        }

    }


    public Boolean isBooked(String userEmail, Long bookId) {
        Reserve byUserEmailAndBookId = reserveBookRepo.findByUserEmailAndBookId(userEmail, bookId);
        return byUserEmailAndBookId !=null && !byUserEmailAndBookId.getBlocked();
    }
    public Boolean isBlocked(String userEmail, Long bookId) {
        Reserve byUserEmailAndBookId = reserveBookRepo.findByUserEmailAndBookId(userEmail, bookId);
        return byUserEmailAndBookId !=null && byUserEmailAndBookId.getBlocked();
    }

    public void reserveBook(String userEmail, Long bookId) throws Exception {
        if (isBooked(userEmail, bookId) || isBooked(userEmail, bookId)){
            throw new Exception("Book Already reserved by user or currently blocked by admin");
        }
        Optional<Book> book = bookRepo.findById(bookId);
        if(book.isEmpty() ){
            throw new Exception("Book not exist");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable()-1);
        Reserve reserve = Reserve.builder().bookId(bookId).userEmail(userEmail).reserveDate(LocalDate.now().toString()).blocked(false).build();
        reserveBookRepo.save(reserve);
    }

    public CollectionDateResponse getCollectionDate(String userEmail, Long bookId) throws ParseException {
        Reserve byUserEmailAndBookId = reserveBookRepo.findByUserEmailAndBookId(userEmail, bookId);
        if (byUserEmailAndBookId != null && byUserEmailAndBookId.getReserveDate()!=null) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date reserveDate = sdf.parse(byUserEmailAndBookId.getReserveDate());
            Date collectionDate = new Date(reserveDate.getTime() + (1000 * 60 * 60 * 24) * 3);
            LocalDate date = collectionDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

            return new CollectionDateResponse(date.toString());
        }
        return new CollectionDateResponse("");
    }

    @Scheduled(cron = "1 * * * * MON-FRI")
    public void deleteBookReserves(){
        List<Reserve> reserveList = reserveBookRepo.findAll();
        reserveList.forEach(reserve->{
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            try {
                LocalDate reserveDate = sdf.parse(reserve.getReserveDate()).toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                LocalDate currentDate = LocalDate.now();
                if (reserve.getBlocked()){
                    if (currentDate.isAfter(reserveDate.plusDays(10))) {
                        reserveBookRepo.deleteById(reserve.getId());
                    }
                }
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }

        });
    }

    @Scheduled(cron = "1 * * * * MON-FRI")
    public void manageBookReserves() {
        List<Reserve> reserveList = reserveBookRepo.findAll();
        reserveList.forEach(reserve -> {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            try {
                LocalDate reserveDate = sdf.parse(reserve.getReserveDate()).toInstant().atZone(ZoneId.systemDefault())
                        .toLocalDate();
                LocalDate currentDate = LocalDate.now();
                if (!reserve.getBlocked() && currentDate.isAfter(reserveDate.plusDays(3))) {
                    reserve.setBlocked(true);
                    reserveBookRepo.save(reserve);
                }
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        });
    }

    public int getReserveCountByUser(String userEmail) {
        return reserveBookRepo.countByUserEmail(userEmail);

    }

    public List<CheckoutResponse> getReserves(String userEmail) {
        List<Reserve> reserves = reserveBookRepo.findByUserEmail(userEmail);
        List<CheckoutResponse> reservedBooks = new ArrayList<>();
        reserves.forEach(reserve -> {
            Optional<Book> bookOptional = bookRepo.findById(reserve.getBookId());
            if(bookOptional.isPresent()) {
                Book reservedBook = bookOptional.get();
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                Date reserveDate;
                try {
                    reserveDate = sdf.parse(reserve.getReserveDate());
                } catch (ParseException e) {
                    throw new RuntimeException(e);
                }
                Date collectionDate = new Date(reserveDate.getTime() + (1000 * 60 * 60 * 24) * 3);
                LocalDate date = collectionDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

                CheckoutResponse checkoutResponse = CheckoutResponse.builder()
                        .img(reservedBook.getImg())
                        .collectionDate(date.toString())
                        .reservationDate(reserve.getReserveDate())
                        .author(reservedBook.getAuthor())
                        .bookId(reservedBook.getId())
                        .title(reservedBook.getTitle())
                        .build();
                reservedBooks.add(checkoutResponse);
            }

        });

        return reservedBooks;
    }

}
