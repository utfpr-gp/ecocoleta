package com.ecocoleta.backend.domain.collect;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Converter
public class CollectMaterialsConverter implements AttributeConverter<List<CollectMaterials>, String> {

    // Converte a lista de enums para String (para salvar no banco)
    @Override
    public String convertToDatabaseColumn(List<CollectMaterials> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return null;
        }
        return attribute.stream()
                .map(Enum::name) // Converte cada enum para o nome (VIDRO, PAPEL, etc.)
                .collect(Collectors.joining(",")); // Junta os valores em uma String separada por vírgula
    }

    // Converte a String para uma lista de enums (ao carregar do banco)
    @Override
    public List<CollectMaterials> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return List.of();
        }
        return Arrays.stream(dbData.split(",")) // Divide a string por vírgula
                .map(CollectMaterials::valueOf) // Converte cada nome de volta para enum
                .collect(Collectors.toList());
    }
}
