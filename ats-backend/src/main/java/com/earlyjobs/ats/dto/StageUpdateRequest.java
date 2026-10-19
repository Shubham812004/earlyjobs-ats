package com.earlyjobs.ats.dto;

import com.earlyjobs.ats.entity.HiringStage;
import jakarta.validation.constraints.NotNull;

public record StageUpdateRequest(
        @NotNull(message = "Hiring stage is required")
        HiringStage stage
        )
{ }
