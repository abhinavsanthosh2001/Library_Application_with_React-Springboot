package com.project.springbootlobrary.controller;


import com.project.springbootlobrary.entities.Book;
import com.project.springbootlobrary.requestModels.AddBookRequest;
import com.project.springbootlobrary.responseModels.CheckoutResponse;
import com.project.springbootlobrary.service.AdminService;
import com.project.springbootlobrary.service.BookService;
import com.project.springbootlobrary.utils.ExtractJWT;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminController {
    @Autowired
    AdminService adminService;

    @Autowired
    BookService bookService;

    @PostMapping("/secure/add/book")
    public void postBook(@RequestHeader(value = "Authorization") String token,
                         @RequestBody AddBookRequest addBookRequest
                         ) throws Exception {
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if(admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only.");
        }
        adminService.postBook(addBookRequest);
    }

    @DeleteMapping("/secure/delete/book")
    public void deleteBook(@RequestHeader(value = "Authorization") String token,
                           @RequestParam Long bookId) throws Exception {
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if(admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only.");

        }

        adminService.deleteBookById(bookId);
    }
    @PutMapping("/secure/changeQuantity/book")
    public void changeQuantity(@RequestHeader(value = "Authorization") String token,
                           @RequestParam Long bookId, @RequestParam boolean add) throws Exception {
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if(admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only.");
        }
        adminService.changeQuantity(bookId, add);
    }

    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId, @RequestParam String userEmail) throws Exception{
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if(admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only.");

        }
        return adminService.checkoutBook(userEmail, bookId);
    }

    @GetMapping("/secure/getReserves")
    public List<CheckoutResponse> getReservedBooks(@RequestHeader(value = "Authorization") String token, @RequestParam String userEmail) throws Exception {
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if(admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only.");

        }
        return adminService.getReservesByEmail(userEmail);
    }

    @DeleteMapping("secure/deleteReserve")
    public void deleteReserve(@RequestHeader(value = "Authorization") String token, @RequestParam String userEmail, @RequestParam Long bookId) throws Exception {
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if(admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only.");

        }
        adminService.deleteReserve(userEmail, bookId);
    }

}
