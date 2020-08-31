package com.example.demo.controller;

import com.example.demo.entity.Person;
import com.example.demo.service.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PersonController {
    @Autowired
    private PersonRepository personRepository;

    @GetMapping(value = "/person")
    public List<Person> findAll() {
        return personRepository.findAll();
    }
}
