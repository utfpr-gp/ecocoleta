package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.collect.CollectDTO;
import com.ecocoleta.backend.services.CollectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("collect")
public class CollectController {

    @Autowired
    private CollectService collectService;

    //Nova coleta
    @PostMapping
    @Transactional
    public ResponseEntity agendar(@RequestBody @Valid CollectDTO data) {
//        TESTE ******
        System.out.println(data);
        return ResponseEntity.ok(new CollectDTO(true, null, null, null, null,null,null));
    }

    //solicitação de coleta, delete, etc...
}