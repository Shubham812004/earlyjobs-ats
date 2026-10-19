package com.earlyjobs.ats.dto;

import com.earlyjobs.ats.entity.Candidate;
import com.earlyjobs.ats.entity.HiringStage;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CandidateResponse(
        Long id,
        String fullname,
        String email,
        String phone,
        String jobTitle,
        BigDecimal experienceYears,
        String source,
        HiringStage stage,
        String notes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static CandidateResponse from(Candidate candidate) {
        return new CandidateResponse(
                candidate.getId(),
                candidate.getFullname(),
                candidate.getEmail(),
                candidate.getPhone(),
                candidate.getJobTitle(),
                candidate.getExperienceYears(),
                candidate.getSource(),
                candidate.getStage(),
                candidate.getNotes(),
                candidate.getCreatedAt(),
                candidate.getUpdatedAt()
        );
    }
}
