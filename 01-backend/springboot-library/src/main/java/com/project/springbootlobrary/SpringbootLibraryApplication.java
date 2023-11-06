package com.project.springbootlobrary;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SpringbootLibraryApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringbootLibraryApplication.class, args);
	}

}
