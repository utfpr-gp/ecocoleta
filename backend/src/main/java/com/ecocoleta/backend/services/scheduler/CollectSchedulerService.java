package com.ecocoleta.backend.services.scheduler;

import com.ecocoleta.backend.domain.collect.Collect;
import com.ecocoleta.backend.domain.collect.CollectStatus;
import com.ecocoleta.backend.repositories.CollectRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Logger;

@Service
public class CollectSchedulerService {

    private final CollectRepository collectRepository;
    private static final Logger LOGGER = Logger.getLogger(CollectSchedulerService.class.getName());

    public CollectSchedulerService(CollectRepository collectRepository) {
        this.collectRepository = collectRepository;
    }

    @Scheduled(fixedRate = 3600000)  // Rodar a cada 1 hora
    public void checkPendingCollects() {
        LocalDateTime sixHoursAgo = LocalDateTime.now().minusHours(6);  // Calcula o tempo de 6 horas atrás

        List<Collect> outdatedCollects = collectRepository.findOutdatedCollects(sixHoursAgo);

        for (Collect collect : outdatedCollects) {
            // Lógica para tratar coletas não finalizadas
            collect.setWasteCollector(null);  // Resetar o wasteCollectorId
            collect.setInitTime(null);  // Resetar o initTime
            collect.setStatus(CollectStatus.PENDING);  // Atualizar status para 'PENDING'
            collectRepository.save(collect);
        }

        LOGGER.info(outdatedCollects.size() + " outdated collects processed");
    }
}
