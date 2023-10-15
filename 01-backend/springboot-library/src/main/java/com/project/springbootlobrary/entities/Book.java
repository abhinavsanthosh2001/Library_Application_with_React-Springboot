package com.project.springbootlobrary.entities;

import lombok.*;
import lombok.experimental.FieldDefaults;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "book")
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    long id;

    @Column(name = "title")
    String title;

    @Column(name = "author")
    String author;

    @Column(name = "description")
    String description;

    @Column(name = "copies")
    int copies;

    @Column(name = "copiesAvailable")
    int copiesAvailable;

    @Column(name = "category")
    String category;

    @Column(name = "img")
    String img;

}
