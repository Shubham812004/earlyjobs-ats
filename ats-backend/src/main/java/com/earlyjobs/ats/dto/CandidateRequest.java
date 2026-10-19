package com.earlyjobs.ats.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CandidateRequest(

        @NotBlank(message = "Full name is required")
        @Size(max = 120)
        String fullname,

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email")
        @Size(max = 180)
        String email,

        @Size(max = 20)
        String phone,

        @NotBlank(message = "Job title is required")
        @Size(max = 120)
        String jobTitle,

        @NotNull(message = "Experience is required")
        @DecimalMin(
                value = "0.0",
                message = "Experience cannot be negative"
        )
        BigDecimal experienceYears,

        @Size(max = 50)
        String source,

        @Size(max = 5000)
        String notes

) {}