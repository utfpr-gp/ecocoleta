package com.ecocoleta.backend.domain.collectMaterial;

import com.ecocoleta.backend.domain.collect.Collect;
import com.ecocoleta.backend.domain.material.Material;
import jakarta.persistence.*;
import lombok.*;

/**
 * Classe para armazenar as informações necessárias para a classe auxiliar n x n
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "collects_materials")
@Entity
@Getter
@Setter
public class CollectMaterial {
    /**
     * Chave composta referenciando um Collect e um Material.
     */
    @EmbeddedId
    private CollectMaterialPK id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("collectId")
    @JoinColumn(name = "collect_id")
    private Collect collect;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("materialId")
    @JoinColumn(name = "material_id")
    private Material material;

    public CollectMaterial(Collect collect, Material material) {
        this.id = new CollectMaterialPK(collect.getId(), material.getId());
        this.collect = collect;
        this.material = material;
    }
}
