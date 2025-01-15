//package com.ecocoleta.backend.repositories;
//
//import com.ecocoleta.backend.domain.material.Material;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface MaterialsRepository extends JpaRepository<Material, Long> {
//
//    Material findMaterialByName(String name);
//
//    Page<Material> getAllByOrderByName(Pageable pageable);
//
//    List<Material> getAllByOrderById();
//}
