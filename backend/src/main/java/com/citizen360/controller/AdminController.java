package com.citizen360.controller;

import com.citizen360.model.User;
import com.citizen360.model.enums.Role;
import com.citizen360.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/officers")
    public ResponseEntity<List<User>> getOfficers() {
        List<User> officers = userRepository.findByRole(Role.OFFICER);
        return ResponseEntity.ok(officers);
    }

    @PatchMapping("/officers/{id}/approve")
    public ResponseEntity<?> approveOfficer(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        if (user.getRole() != Role.OFFICER) {
            return ResponseEntity.badRequest().body(Map.of("error", "User is not an officer"));
        }

        user.setApproved(true);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Officer approved successfully"));
    }

    @DeleteMapping("/officers/{id}")
    public ResponseEntity<?> rejectOfficer(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        if (user.getRole() != Role.OFFICER) {
            return ResponseEntity.badRequest().body(Map.of("error", "User is not an officer"));
        }

        userRepository.delete(user);
        return ResponseEntity.ok(Map.of("message", "Officer rejected/deleted successfully"));
    }
}
