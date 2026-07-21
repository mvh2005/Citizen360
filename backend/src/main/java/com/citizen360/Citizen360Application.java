package com.citizen360;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class Citizen360Application {

    public static void main(String[] args) {
        SpringApplication.run(Citizen360Application.class, args);
    }
}
