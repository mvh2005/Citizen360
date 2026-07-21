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

    public DashboardResponse getDashboard(Long userId) {
        long total = complaintRepository.countByUserId(userId);
        long pending = complaintRepository.countByUserIdAndStatus(userId, ComplaintStatus.PENDING);
        long inProgress = complaintRepository.countByUserIdAndStatus(userId, ComplaintStatus.IN_PROGRESS)
                        + complaintRepository.countByUserIdAndStatus(userId, ComplaintStatus.ASSIGNED);
        long resolved = complaintRepository.countByUserIdAndStatus(userId, ComplaintStatus.RESOLVED);

        // Monthly data
        List<DashboardResponse.MonthlyData> monthly = complaintRepository.countMonthly(userId)
                .stream()
                .map(row -> {
                    int monthNum = ((Number) row[0]).intValue();
                    String monthName = Month.of(monthNum).name().substring(0, 3);
                    monthName = monthName.charAt(0) + monthName.substring(1).toLowerCase();
                    long count = ((Number) row[1]).longValue();
                    return new DashboardResponse.MonthlyData(monthName, count);
                })
                .collect(Collectors.toList());

        // Category data
        List<DashboardResponse.CategoryData> categories = complaintRepository.countByCategory(userId)
                .stream()
                .map(row -> new DashboardResponse.CategoryData(
                        (String) row[0],
                        ((Number) row[1]).longValue()))
                .collect(Collectors.toList());

        // Recent complaints (last 5)
        List<ComplaintResponse> recent = complaintService.getComplaintsByUser(userId)
                .stream()
                .limit(5)
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
