package com.earlyjobs.ats.service;

import com.earlyjobs.ats.dto.CandidateRequest;
import com.earlyjobs.ats.dto.CandidateResponse;
import com.earlyjobs.ats.entity.Candidate;
import com.earlyjobs.ats.entity.HiringStage;
import com.earlyjobs.ats.repository.CandidateRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.lang.module.ResolutionException;
import java.util.List;
import java.util.Locale;

@Service
public class CandidateService {
    public final CandidateRepository candidateRepository;

    public CandidateService(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    @Transactional
    public CandidateResponse createCandidate(CandidateRequest request) {
        String normalizedEmail = request.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        if(candidateRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A candidate with this email already exists"

            );
        }

        Candidate candidate = new Candidate();
        candidate.setFullname(request.fullname().trim());
        candidate.setEmail(normalizedEmail);
        candidate.setPhone(request.phone());
        candidate.setJobTitle(request.jobTitle().trim());
        candidate.setExperienceYears(request.experienceYears());
        candidate.setSource(request.source());
        candidate.setNotes(request.notes());
        candidate.setStage(HiringStage.APPLIED);

        Candidate saved = candidateRepository.save(candidate);

        return CandidateResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<CandidateResponse> getAllCandidates(
            String search,
            HiringStage stage) {

        return candidateRepository
                .searchAndFilter(search, stage)
                .stream()
                .map(CandidateResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CandidateResponse getCandidateById(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Candidate not found"
                ));

        return CandidateResponse.from(candidate);
    }

    @Transactional
    public CandidateResponse updateCandidate(
            Long id,
            CandidateRequest request
    ) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Candidate not found"
                ));

        String normalizedEmail = request.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        if (candidateRepository.existsByEmailIgnoreCaseAndIdNot(
                normalizedEmail, id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Another candidate already uses this email"
            );
        }

        candidate.setFullname(request.fullname().trim());
        candidate.setEmail(normalizedEmail);
        candidate.setPhone(request.phone());
        candidate.setJobTitle(request.jobTitle().trim());
        candidate.setExperienceYears(request.experienceYears());
        candidate.setSource(request.source());
        candidate.setNotes(request.notes());

        return CandidateResponse.from(candidateRepository.save(candidate));
    }

    @Transactional
    public void deleteCandidate(Long id) {
        if (!candidateRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Candidate not found"
            );
        }

        candidateRepository.deleteById(id);
    }

    @Transactional
    public CandidateResponse updateCandidateStage(
            Long id,
            HiringStage newStage
    ) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Candidate not found"
                ));

        candidate.setStage(newStage);

        Candidate updated = candidateRepository.save(candidate);

        return CandidateResponse.from(updated);
    }
}
