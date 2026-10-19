package com.earlyjobs.ats.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "candidates",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_candidate_email",
                        columnNames = "email"
                )
        }
)
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 120)
    private String fullname;

    @Column(nullable = false, length = 180)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "job_title", nullable = false, length = 120)
    private String jobTitle;

    @Column(name = "experience_years", precision = 4, scale = 1)
    private BigDecimal experienceYears;

    @Column(length = 50)
    private String source;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false,  length = 20)
    private HiringStage stage = HiringStage.APPLIED;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Candidate() {

    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;

        if(stage == null){
            stage = HiringStage.APPLIED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public BigDecimal getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(BigDecimal experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public HiringStage getStage() {
        return stage;
    }

    public void setStage(HiringStage stage) {
        this.stage = stage;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

}
