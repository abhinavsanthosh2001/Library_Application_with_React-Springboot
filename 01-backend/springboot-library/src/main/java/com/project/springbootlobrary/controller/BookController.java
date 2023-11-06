package com.project.springbootlobrary.controller;

import com.project.springbootlobrary.responseModels.CheckoutResponse;
import com.project.springbootlobrary.responseModels.CollectionDateResponse;
import com.project.springbootlobrary.responseModels.ShelfCurrentLoansResponse;
import com.project.springbootlobrary.service.BookService;
import com.project.springbootlobrary.utils.ExtractJWT;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/books")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookController {
    @Autowired
    BookService bookService;

    @PutMapping("/secure/return")
    public void returnBook(@RequestParam Long bookId,@RequestHeader(value = "Authorization") String token) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        bookService.returnBook(userEmail, bookId);
    }

    @PutMapping("/secure/renew/loan")
    public void renewBook(@RequestParam Long bookId,@RequestHeader(value = "Authorization") String token) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        bookService.renewBook(userEmail, bookId);
    }
    @GetMapping("/secure/ischeckedout/byuser")
    public Boolean isCheckedOut(@RequestParam Long bookId,@RequestHeader(value = "Authorization") String token) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return bookService.checkedOutByUser(bookId, userEmail);
    }
    @GetMapping("/secure/currentloans/count")
    public int bookCountOfUser(@RequestHeader(value = "Authorization") String token){
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return  bookService.getBookCountByUser(userEmail);
    }
    @GetMapping("/secure/reserveCount/count")
    public int getReserveCount(@RequestHeader(value = "Authorization") String token){
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return  bookService.getReserveCountByUser(userEmail);
    }

    @GetMapping("/secure/currentloans")
    public List<ShelfCurrentLoansResponse> currentLoans(@RequestHeader(value = "Authorization") String token)
            throws ParseException {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return bookService.currentLoans(userEmail);
    }

    @GetMapping("/secure/isBooked/byUser")
    public Boolean isBooked(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId)
            throws ParseException {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return bookService.isBooked(userEmail, bookId);
    }
    @GetMapping("/secure/isBlocked/byAdmin")
    public Boolean isBlocked(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId)
            throws ParseException, InterruptedException {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return bookService.isBlocked(userEmail, bookId);
    }

    @PostMapping("/secure/Reserve")
    public void ReserveBook(@RequestParam Long bookId,@RequestHeader(value = "Authorization") String token) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        bookService.reserveBook(userEmail, bookId);
    }

    @GetMapping("/secure/collectionDate")
    public CollectionDateResponse getCollectionDate(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) throws ParseException {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return bookService.getCollectionDate(userEmail, bookId);
    }
    @GetMapping("secure/getReserves")
    public List<CheckoutResponse> getReserves(@RequestHeader(value = "Authorization") String token)
            throws ParseException {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return bookService.getReserves(userEmail);
    }
}
