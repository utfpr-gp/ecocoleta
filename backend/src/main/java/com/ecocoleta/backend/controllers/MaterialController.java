package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.material.Material;
import com.ecocoleta.backend.domain.material.MaterialDTO;
import com.ecocoleta.backend.services.MaterialService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("material")
public class MaterialController {

    @Autowired
    MaterialService materialService;

    @PostMapping
    @Transactional
    public ResponseEntity newMaterial(@RequestBody MaterialDTO materialDTO) {
        Material material = new Material(materialDTO.name(), materialDTO.score());
        materialService.saveMaterial(material);
        return ResponseEntity.ok().body(new MaterialDTO(material.getId(), material.getName(), material.getScore()));
    }


    //GET MATERIAL BY ID
    @GetMapping("/{id}")
    public ResponseEntity getMaterial(@PathVariable Long id) {
        var material = materialService.getMaterialById(id);

        return ResponseEntity.ok().body(new MaterialDTO(material.get().getId(), material.get().getName(), material.get().getScore()));
    }

    //GET ALL LIST Materials
    @GetMapping("all")
    public ResponseEntity<List<MaterialDTO>> getListAllMaterial() {
        List<Material> materials = materialService.getAllByOrderById();
        List<MaterialDTO> materialsDTO = materials.stream().map(MaterialDTO::new).toList();

        return ResponseEntity.ok().body(materialsDTO);
    }

    //GET ALL Materials PAGEABLE
    @GetMapping("list")
    public ResponseEntity<Page<MaterialDTO>> listMaterials(@PageableDefault(size = 10, sort = {"name"}) Pageable pageable) {
        var page = materialService.getAllByOrderByName(pageable).map(MaterialDTO::new);
        return ResponseEntity.ok(page);
    }

    //update
    @PutMapping
    @Transactional
    public ResponseEntity update(@RequestBody @Valid MaterialDTO materialDTO) {
        var material = materialService.getMaterialById(materialDTO.id());
        material.get().update(materialDTO);

        return ResponseEntity.ok(new MaterialDTO(material.get().getId(), material.get().getName(), material.get().getScore()));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity deleteMaterial(@PathVariable Long id) {
        var material = materialService.getMaterialById(id);
        materialService.deleteMaterial(material.get());

        return ResponseEntity.noContent().build();
    }
}
