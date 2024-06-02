package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.material.Material;
import com.ecocoleta.backend.repositories.MaterialsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaterialService {

    @Autowired
    private MaterialsRepository materialsRepository;

    public Material findMaterialByName(String name) {
        return materialsRepository.findMaterialByName(name);
    }

    public Optional<Material> getMaterialById(Long id) {
        return materialsRepository.findById(id);
    }

    public Page<Material> getAllByOrderByName(Pageable pageable) {
        return materialsRepository.getAllByOrderByName(pageable);
    }

    public List<Material> getAllByOrderById() {
        return materialsRepository.getAllByOrderById();
    }

    public Material saveMaterial(Material material) {
        return materialsRepository.save(material);
    }

    public void deleteMaterial(Material material) {
        materialsRepository.delete(material);
    }
}
