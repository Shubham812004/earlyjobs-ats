package com.earlyjobs.ats.service;

import com.earlyjobs.ats.dto.DashboardMetricsResponse;
import com.earlyjobs.ats.entity.HiringStage;
import com.earlyjobs.ats.repository.CandidateRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.Map;

@Service
public class DashboardService {

    private final CandidateRepository candidateRepository;

    public DashboardService(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    @Transactional(readOnly = true)
    public DashboardMetricsResponse getMetrics() {

        Map<HiringStage, Long> stageCounts =
                new EnumMap<>(HiringStage.class);

        for (HiringStage stage : HiringStage.values()) {
            stageCounts.put(
                    stage,
                    candidateRepository.countByStage(stage)
            );
        }

        long totalCandidates = stageCounts.values()
                .stream()
                .mapToLong(Long::longValue)
                .sum();

        return new DashboardMetricsResponse(
                totalCandidates,
                stageCounts.get(HiringStage.HIRED),
                stageCounts.get(HiringStage.REJECTED),
                stageCounts
        );
    }
}