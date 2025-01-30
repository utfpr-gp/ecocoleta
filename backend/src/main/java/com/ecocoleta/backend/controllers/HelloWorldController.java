package com.ecocoleta.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
public class HelloWorldController {

    @GetMapping
    public ResponseEntity<String> helloWorld(){

        return ResponseEntity.ok().body("Hello ecocoleta");
    }
}
