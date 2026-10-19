package com.earlyjobs.ats.repository;

import com.earlyjobs.ats.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import com.earlyjobs.ats.entity.HiringStage;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate,Long> {
    boolean existsByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCaseAndIdNot(String email,Long id);

    List<Candidate> findByFullnameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrJobTitleContainingIgnoreCase(
            String fullname,
            String email,
            String jobTitle
    );

    long countByStage(HiringStage stage);

    @Query("""
    SELECT c FROM Candidate c
    WHERE (:stage IS NULL OR c.stage = :stage)
    AND (
        :search IS NULL OR :search = ''
        OR LOWER(c.fullname) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(c.jobTitle) LIKE LOWER(CONCAT('%', :search, '%'))
    )
    """)
    List<Candidate> searchAndFilter(
            @Param("search") String search,
            @Param("stage") HiringStage stage
    );
}
