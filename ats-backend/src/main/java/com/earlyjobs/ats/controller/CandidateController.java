package com.earlyjobs.ats.controller;

import com.earlyjobs.ats.dto.CandidateRequest;
import com.earlyjobs.ats.dto.CandidateResponse;
import com.earlyjobs.ats.dto.StageUpdateRequest;
import com.earlyjobs.ats.entity.HiringStage;
import com.earlyjobs.ats.service.CandidateService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CandidateResponse createCandidate(
            @Valid @RequestBody CandidateRequest request) {
        return candidateService.createCandidate(request);
    }

    @GetMapping
    public List<CandidateResponse> getAllCandidates(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) HiringStage stage) {

        return candidateService.getAllCandidates(search, stage);
    }

    @GetMapping("/{id}")
    public CandidateResponse getCandidateById(@PathVariable Long id) {
        return candidateService.getCandidateById(id);
    }

    @PutMapping("/{id}")
    public CandidateResponse updateCandidate(
            @PathVariable Long id,
            @Valid @RequestBody CandidateRequest request) {
        return candidateService.updateCandidate(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCandidate(@PathVariable Long id) {
        candidateService.deleteCandidate(id);
    }

    @PatchMapping("/{id}/stage")
    public CandidateResponse updateCandidateStage(
            @PathVariable Long id,
            @Valid @RequestBody StageUpdateRequest request
    ) {
        return candidateService.updateCandidateStage(
                id,
                request.stage()
        );
    }
}