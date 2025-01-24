package com.ecocoleta.backend.domain.collect;

public enum CollectMaterials {
    VIDRO("VIDRO"),
    PAPEL("PAPEL"),
    PLASTICO("PLASTICO"),
    METAL("METAL"),
    ELETRONICO("ELETRONICO"),
    OUTROS("OUTROS");

    private String material;

    CollectMaterials(String material) {
        this.material = material;
    }

    public String getMaterial() {
        return material;
    }
}
