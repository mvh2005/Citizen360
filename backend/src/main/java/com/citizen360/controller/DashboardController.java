package com.citizen360.controller;

import com.citizen360.dto.DashboardResponse;
import com.citizen360.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(Authentication auth) {
        Long userId = (Long) auth.getDetails();
        return ResponseEntity.ok(dashboardService.getDashboard(userId));
    }
}
