package com.citizen360.dto;

public class AuthResponse {

    private String token;
    private String fullName;
    private String email;
    private String role;
    private Long userId;

    public AuthResponse() {}

    public AuthResponse(String token, String fullName, String email, String role, Long userId) {
        this.token = token;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.userId = userId;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
