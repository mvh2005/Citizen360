package com.citizen360.controller;

import com.citizen360.dto.ComplaintRequest;
import com.citizen360.dto.ComplaintResponse;
import com.citizen360.service.ComplaintService;
import com.citizen360.service.FileStorageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;
    private final FileStorageService fileStorageService;

    public ComplaintController(ComplaintService complaintService, FileStorageService fileStorageService) {
        this.complaintService = complaintService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    public ResponseEntity<?> createComplaint(
            @Valid @RequestPart("complaint") ComplaintRequest request,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            Authentication auth) {
        try {
            Long userId = (Long) auth.getDetails();

            List<String> imageFilenames = List.of();
            if (files != null && files.length > 0) {
                imageFilenames = fileStorageService.storeFiles(files);
            }

            ComplaintResponse response = complaintService.createComplaint(request, userId, imageFilenames);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(Authentication auth) {
        Long userId = (Long) auth.getDetails();
        return ResponseEntity.ok(complaintService.getComplaintsByUser(userId));
    }

    @GetMapping("/{complaintId}")
    public ResponseEntity<?> getComplaint(@PathVariable String complaintId) {
        try {
            return ResponseEntity.ok(complaintService.getComplaintByComplaintId(complaintId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<ComplaintResponse>> search(@RequestParam String q) {
        return ResponseEntity.ok(complaintService.searchComplaints(q));
    }
}
