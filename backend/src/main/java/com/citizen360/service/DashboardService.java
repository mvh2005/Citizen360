package com.citizen360.service;

import com.citizen360.dto.ComplaintResponse;
import com.citizen360.dto.DashboardResponse;
import com.citizen360.model.enums.ComplaintStatus;
import com.citizen360.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintService complaintService;

    public DashboardService(ComplaintRepository complaintRepository, ComplaintService complaintService) {
        this.complaintRepository = complaintRepository;
        this.complaintService = complaintService;
    }

    public DashboardResponse getDashboard(Long userId, String role) {
        long total, pending, inProgress, resolved;
        List<Object[]> monthlyRaw;
        List<Object[]> categoryRaw;
        List<ComplaintResponse> recent;

        if ("ADMIN".equals(role)) {
            total = complaintRepository.count();
            pending = complaintRepository.countByStatus(ComplaintStatus.PENDING);
            inProgress = complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS)
                         + complaintRepository.countByStatus(ComplaintStatus.ASSIGNED);
            resolved = complaintRepository.countByStatus(ComplaintStatus.RESOLVED);

            monthlyRaw = complaintRepository.countAllMonthly();
            categoryRaw = complaintRepository.countAllByCategory();
            recent = complaintService.getAllComplaints()
                    .stream()
                    .limit(5)
                    .collect(Collectors.toList());
        } else if ("OFFICER".equals(role)) {
            total = complaintRepository.countByAssignedOfficerId(userId);
            pending = complaintRepository.countByAssignedOfficerIdAndStatus(userId, ComplaintStatus.ASSIGNED);
            inProgress = complaintRepository.countByAssignedOfficerIdAndStatus(userId, ComplaintStatus.IN_PROGRESS);
            resolved = complaintRepository.countByAssignedOfficerIdAndStatus(userId, ComplaintStatus.RESOLVED);

            monthlyRaw = complaintRepository.countMonthlyByOfficer(userId);
            categoryRaw = complaintRepository.countByCategoryAndOfficer(userId);
            recent = complaintService.getComplaintsByOfficer(userId)
                    .stream()
                    .limit(5)
                    .collect(Collectors.toList());
        } else {
            total = complaintRepository.countByUserId(userId);
            pending = complaintRepository.countByUserIdAndStatus(userId, ComplaintStatus.PENDING);
            inProgress = complaintRepository.countByUserIdAndStatus(userId, ComplaintStatus.IN_PROGRESS)
                            + complaintRepository.countByUserIdAndStatus(userId, ComplaintStatus.ASSIGNED);
            resolved = complaintRepository.countByUserIdAndStatus(userId, ComplaintStatus.RESOLVED);

            monthlyRaw = complaintRepository.countMonthly(userId);
            categoryRaw = complaintRepository.countByCategory(userId);
            recent = complaintService.getComplaintsByUser(userId)
                    .stream()
                    .limit(5)
                    .collect(Collectors.toList());
        }

        // Map Monthly data
        List<DashboardResponse.MonthlyData> monthly = monthlyRaw.stream()
                .map(row -> {
                    int monthNum = ((Number) row[0]).intValue();
                    String monthName = Month.of(monthNum).name().substring(0, 3);
                    monthName = monthName.charAt(0) + monthName.substring(1).toLowerCase();
                    long count = ((Number) row[1]).longValue();
                    return new DashboardResponse.MonthlyData(monthName, count);
                })
                .collect(Collectors.toList());

        // Map Category data
        List<DashboardResponse.CategoryData> categories = categoryRaw.stream()
                .map(row -> new DashboardResponse.CategoryData(
                        (String) row[0],
                        ((Number) row[1]).longValue()))
                .collect(Collectors.toList());

        DashboardResponse resp = new DashboardResponse();
        resp.setTotalComplaints(total);
        resp.setPending(pending);
        resp.setInProgress(inProgress);
        resp.setResolved(resolved);
        resp.setMonthly(monthly);
        resp.setCategories(categories);
        resp.setRecentComplaints(recent);

        return resp;
    }
}
