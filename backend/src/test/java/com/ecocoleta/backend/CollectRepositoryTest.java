package com.ecocoleta.backend;

import com.ecocoleta.backend.domain.collect.Collect;
import com.ecocoleta.backend.domain.collect.CollectStatus;
import com.ecocoleta.backend.repositories.CollectRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class CollectRepositoryTest {

    @Autowired
    private CollectRepository collectRepository;

    @Test
    public void testFindByStatusesAndEvaluation() {
        Long userId = 2L; // Substitua pelo ID correto
        List<CollectStatus> statuses = Arrays.asList(CollectStatus.PENDING, CollectStatus.IN_PROGRESS, CollectStatus.PAUSED);
        Boolean isEvaluated = false; // Filtrar por coletas não avaliadas (ou use null para ignorar esse critério)
        Pageable pageable = PageRequest.of(0, 10); // Página 0, 10 registros por página

        List<Collect> collects = collectRepository.findByStatusesAndEvaluation(userId, statuses, isEvaluated, pageable);

        // Teste se a lista não está nula e se contém resultados
        assertNotNull(collects);
        assertFalse(collects.isEmpty());

        // Imprime os resultados para depuração
        collects.forEach(collect -> {
            System.out.println("Collect ID: " + collect.getId());
            System.out.println("Status: " + collect.getStatus());
            System.out.println("Is Evaluated: " + collect.isEvaluated());
        });
    }
}
