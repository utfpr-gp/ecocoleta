//package com.ecocoleta.backend.repositories;
//
//import com.ecocoleta.backend.domain.collect.Collect;
//import com.ecocoleta.backend.domain.collectMaterial.CollectMaterial;
//import com.ecocoleta.backend.domain.collectMaterial.CollectMaterialPK;
//import com.ecocoleta.backend.domain.material.Material;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface CollectMaterialRepository extends JpaRepository<CollectMaterial, CollectMaterialPK> {
//
//    /**
//     * Retorna uma collectMaterial de um coleta e um material
//     *
//     * @param collect
//     * @param material
//     * @return Optional<UserAddress>
//     */
//
//    Optional<CollectMaterial> findCollectMaterialByCollectAndMaterial(Collect collect, Material material);
//
//    /**
//     * Retorna uma lista de Materiais de um coleta
//     *
//     * @param collect
//     * @return material
//     */
//
//    List<CollectMaterial> findByCollect(Collect collect);
//
//    /**
//     * Retorna uma lista de materias de um coleta
//     *
//     * @param material
//     * @return user
//     */
//    List<CollectMaterial> findByMaterial(Material material);
//
//}
