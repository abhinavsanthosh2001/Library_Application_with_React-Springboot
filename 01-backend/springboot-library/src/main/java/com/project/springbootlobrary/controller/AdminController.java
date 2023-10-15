package com.project.springbootlobrary.controller;


import com.project.springbootlobrary.requestModels.AddBookRequest;
import com.project.springbootlobrary.service.AdminService;
import com.project.springbootlobrary.utils.ExtractJWT;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminController {
    @Autowired
    AdminService adminService;

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

}
