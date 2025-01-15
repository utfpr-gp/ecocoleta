//package com.ecocoleta.backend.controllers;
//
//import com.ecocoleta.backend.domain.material.Material;
//import com.ecocoleta.backend.domain.material.MaterialDTO;
//import com.ecocoleta.backend.infra.exception.ValidException;
//import com.ecocoleta.backend.services.MaterialService;
//import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.web.PageableDefault;
//import org.springframework.http.ResponseEntity;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("material")
//public class MaterialController {
//
//    @Autowired
//    MaterialService materialService;
//
//    /**
//     * Cria um novo material.
//     * @param materialDTO Dados do material a ser criado.
//     * @return ResponseEntity com o DTO do material criado.
//     */
//    @PostMapping
//    @Transactional
//    public ResponseEntity<MaterialDTO> newMaterial(@RequestBody @Valid MaterialDTO materialDTO) {
//        try {
//            Material material = new Material(materialDTO.name(), materialDTO.score());
//            materialService.saveMaterial(material);
//            return ResponseEntity.ok().body(new MaterialDTO(material.getId(), material.getName(), material.getScore()));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(null); // Retorna erro com resposta vazia
//        }
//    }
//
//    /**
//     * Recupera um material pelo ID.
//     * @param id ID do material.
//     * @return ResponseEntity com os dados do material.
//     */
//    @GetMapping("/{id}")
//    public ResponseEntity<MaterialDTO> getMaterial(@PathVariable Long id) {
//        try {
//            var material = materialService.getMaterialById(id)
//                    .orElseThrow(() -> new ValidException("Material não encontrado!"));
//
//            return ResponseEntity.ok().body(new MaterialDTO(material.getId(), material.getName(), material.getScore()));
//        } catch (ValidException e) {
//            return ResponseEntity.badRequest().body(null); // Retorna erro com resposta vazia
//        }
//    }
//
//    /**
//     * Recupera todos os materiais.
//     * @return ResponseEntity com a lista de materiais.
//     */
//    @GetMapping("all")
//    public ResponseEntity<List<MaterialDTO>> getListAllMaterial() {
//        try {
//            List<Material> materials = materialService.getAllByOrderById();
//            List<MaterialDTO> materialsDTO = materials.stream().map(MaterialDTO::new).toList();
//            return ResponseEntity.ok().body(materialsDTO);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(null); // Retorna erro com resposta vazia
//        }
//    }
//
//    /**
//     * Recupera os materiais com paginação.
//     * @param pageable Dados de paginação.
//     * @return ResponseEntity com a lista paginada de materiais.
//     */
//    @GetMapping("list")
//    public ResponseEntity<Page<MaterialDTO>> listMaterials(@PageableDefault(size = 10, sort = {"name"}) Pageable pageable) {
//        try {
//            var page = materialService.getAllByOrderByName(pageable).map(MaterialDTO::new);
//            return ResponseEntity.ok(page);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(null); // Retorna erro com resposta vazia
//        }
//    }
//
//    /**
//     * Atualiza um material existente.
//     * @param materialDTO Dados atualizados do material.
//     * @return ResponseEntity com os dados do material atualizado.
//     */
//    @PutMapping
//    @Transactional
//    public ResponseEntity<MaterialDTO> update(@RequestBody @Valid MaterialDTO materialDTO) {
//        try {
//            var material = materialService.getMaterialById(materialDTO.id())
//                    .orElseThrow(() -> new ValidException("Material não encontrado!"));
//
//            material.update(materialDTO);
//
//            return ResponseEntity.ok(new MaterialDTO(material.getId(), material.getName(), material.getScore()));
//        } catch (ValidException e) {
//            return ResponseEntity.badRequest().body(null); // Retorna erro com resposta vazia
//        }
//    }
//
//    /**
//     * Deleta um material.
//     * @param id ID do material a ser deletado.
//     * @return ResponseEntity com o status da operação.
//     */
//    @DeleteMapping("/{id}")
//    @Transactional
//    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
//        try {
//            var material = materialService.getMaterialById(id)
//                    .orElseThrow(() -> new ValidException("Material não encontrado!"));
//
//            materialService.deleteMaterial(material);
//            return ResponseEntity.noContent().build();
//        } catch (ValidException e) {
//            return ResponseEntity.badRequest().body(null); // Retorna erro com resposta vazia
//        }
//    }
//}
