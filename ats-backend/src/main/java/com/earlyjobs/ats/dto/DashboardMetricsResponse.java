package com.earlyjobs.ats.dto;

import com.earlyjobs.ats.entity.HiringStage;
import java.util.Map;

public record DashboardMetricsResponse(
        long totalCandidates,
        long hired,
        long rejected,
        Map<HiringStage, Long> stageCounts
) {}