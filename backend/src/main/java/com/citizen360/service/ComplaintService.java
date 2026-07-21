package com.citizen360.service;

import com.citizen360.dto.ComplaintRequest;
import com.citizen360.dto.ComplaintResponse;
import com.citizen360.model.*;
import com.citizen360.model.enums.ComplaintStatus;
import com.citizen360.model.enums.Priority;
import com.citizen360.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintImageRepository imageRepository;
    private final ComplaintTimelineRepository timelineRepository;
    private final UserRepository userRepository;

    public ComplaintService(ComplaintRepository complaintRepository,
                            ComplaintImageRepository imageRepository,
                            ComplaintTimelineRepository timelineRepository,
                            UserRepository userRepository) {
        this.complaintRepository = complaintRepository;
        this.imageRepository = imageRepository;
        this.timelineRepository = timelineRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ComplaintResponse createComplaint(ComplaintRequest request, Long userId, List<String> imageFilenames) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String complaintId = "CT-" + (1000 + ThreadLocalRandom.current().nextInt(9000));
        while (complaintRepository.findByComplaintId(complaintId).isPresent()) {
            complaintId = "CT-" + (1000 + ThreadLocalRandom.current().nextInt(9000));
        }

        Priority priority = Priority.MEDIUM;
        try {
            if (request.getPriority() != null) {
                priority = Priority.valueOf(request.getPriority().toUpperCase());
            }
        } catch (IllegalArgumentException ignored) {}

        String department = mapCategoryToDepartment(request.getCategory());

        Complaint complaint = new Complaint();
        complaint.setComplaintId(complaintId);
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(request.getCategory());
        complaint.setPriority(priority);
        complaint.setStatus(ComplaintStatus.PENDING);
        complaint.setLocation(request.getLocation());
        complaint.setLatitude(request.getLatitude());
        complaint.setLongitude(request.getLongitude());
        complaint.setUser(user);

        complaint = complaintRepository.save(complaint);

        // Save images
        if (imageFilenames != null) {
            for (String filename : imageFilenames) {
                ComplaintImage image = new ComplaintImage(complaint, filename);
                imageRepository.save(image);
            }
        }

        // Create initial timeline entry
        ComplaintTimeline timeline = new ComplaintTimeline(
                complaint,
                "Complaint Submitted",
                "Your complaint has been received and is being reviewed.",
                LocalDateTime.now()
        );
        timelineRepository.save(timeline);

        return toResponse(complaint, department);
    }

    public List<ComplaintResponse> getComplaintsByUser(Long userId) {
        return complaintRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(c -> toResponse(c, mapCategoryToDepartment(c.getCategory())))
                .collect(Collectors.toList());
    }

    public ComplaintResponse getComplaintByComplaintId(String complaintId) {
        Complaint complaint = complaintRepository.findByComplaintId(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found: " + complaintId));
        return toResponse(complaint, mapCategoryToDepartment(complaint.getCategory()));
    }

    public List<ComplaintResponse> searchComplaints(String query) {
        return complaintRepository.search(query)
                .stream()
                .map(c -> toResponse(c, mapCategoryToDepartment(c.getCategory())))
                .collect(Collectors.toList());
    }

    private ComplaintResponse toResponse(Complaint c, String department) {
        List<String> imageUrls = c.getImages() != null
                ? c.getImages().stream().map(i -> "/api/files/" + i.getImagePath()).collect(Collectors.toList())
                : List.of();

        List<ComplaintResponse.TimelineEntry> timeline = c.getTimeline() != null
                ? c.getTimeline().stream().map(t ->
                        new ComplaintResponse.TimelineEntry(t.getTitle(), t.getDescription(), t.getTimestamp(), true))
                .collect(Collectors.toList())
                : List.of();

        ComplaintResponse resp = new ComplaintResponse();
        resp.setId(c.getId());
        resp.setComplaintId(c.getComplaintId());
        resp.setTitle(c.getTitle());
        resp.setDescription(c.getDescription());
        resp.setCategory(c.getCategory());
        resp.setPriority(c.getPriority().name());
        resp.setStatus(c.getStatus().name());
        resp.setLocation(c.getLocation());
        resp.setLatitude(c.getLatitude());
        resp.setLongitude(c.getLongitude());
        resp.setCreatedAt(c.getCreatedAt());
        resp.setUpdatedAt(c.getUpdatedAt());
        resp.setUserName(c.getUser() != null ? c.getUser().getFullName() : null);
        resp.setOfficerName(c.getAssignedOfficer() != null ? c.getAssignedOfficer().getFullName() : null);
        resp.setDepartment(department);
        resp.setImageUrls(imageUrls);
        resp.setTimeline(timeline);

        return resp;
    }

    private String mapCategoryToDepartment(String category) {
        if (category == null) return "General";
        return switch (category.toLowerCase()) {
            case "road damage", "pothole" -> "Roads Department";
            case "garbage", "illegal dumping" -> "Sanitation Department";
            case "water leakage", "water" -> "Water Supply Department";
            case "street light", "electricity" -> "Electricity Department";
            case "drainage" -> "Drainage Department";
            case "public toilet" -> "Sanitation Department";
            default -> "General Department";
        };
    }

    public List<ComplaintResponse> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(c -> toResponse(c, mapCategoryToDepartment(c.getCategory())))
                .collect(Collectors.toList());
    }

    public List<ComplaintResponse> getComplaintsByOfficer(Long officerId) {
        return complaintRepository.findByAssignedOfficerIdOrderByCreatedAtDesc(officerId)
                .stream()
                .map(c -> toResponse(c, mapCategoryToDepartment(c.getCategory())))
                .collect(Collectors.toList());
    }

    @Transactional
    public ComplaintResponse assignOfficer(String complaintId, Long officerId) {
        Complaint complaint = complaintRepository.findByComplaintId(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found: " + complaintId));

        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new RuntimeException("Officer not found: " + officerId));

        complaint.setAssignedOfficer(officer);
        complaint.setStatus(ComplaintStatus.ASSIGNED);

        ComplaintTimeline timeline = new ComplaintTimeline(
                complaint,
                "Assigned to Officer",
                "Complaint has been assigned to " + officer.getFullName() + " for resolution.",
                LocalDateTime.now()
        );
        timelineRepository.save(timeline);

        complaint = complaintRepository.save(complaint);
        return toResponse(complaint, mapCategoryToDepartment(complaint.getCategory()));
    }

    @Transactional
    public ComplaintResponse updateComplaintStatus(String complaintId, String statusStr, String note) {
        Complaint complaint = complaintRepository.findByComplaintId(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found: " + complaintId));

        ComplaintStatus status = ComplaintStatus.valueOf(statusStr.toUpperCase());
        complaint.setStatus(status);

        String timelineTitle = switch (status) {
            case IN_PROGRESS -> "Work Started";
            case RESOLVED -> "Completed";
            case REJECTED -> "Rejected";
            default -> "Status Updated";
        };

        String timelineDesc = (note == null || note.trim().isEmpty())
                ? "Complaint status has been updated to " + status.name()
                : note;

        ComplaintTimeline timeline = new ComplaintTimeline(
                complaint,
                timelineTitle,
                timelineDesc,
                LocalDateTime.now()
        );
        timelineRepository.save(timeline);

        complaint = complaintRepository.save(complaint);
        return toResponse(complaint, mapCategoryToDepartment(complaint.getCategory()));
    }
}
