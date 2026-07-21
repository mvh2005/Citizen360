/**
 * Citizen360 — Centralized API Client
 *
 * All REST calls to the Spring Boot backend go through this module.
 * JWT tokens are stored in localStorage and attached automatically.
 */

const API_BASE = "/api";

// ─── Token helpers ───────────────────────────────────────────────

function getToken() {
    return localStorage.getItem("citizen360_token");
}

function setToken(token) {
    localStorage.setItem("citizen360_token", token);
}

function removeToken() {
    localStorage.removeItem("citizen360_token");
}

function getUser() {
    const raw = localStorage.getItem("citizen360_user");
    return raw ? JSON.parse(raw) : null;
}

function setUser(user) {
    localStorage.setItem("citizen360_user", JSON.stringify(user));
}

function removeUser() {
    localStorage.removeItem("citizen360_user");
}

// ─── Core fetch wrapper ──────────────────────────────────────────

async function request(endpoint, options = {}) {
    const token = getToken();
    const headers = { ...options.headers };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData (browser sets multipart boundary)
    if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    // Handle non-JSON responses (e.g. file downloads)
    const contentType = res.headers.get("content-type");
    if (contentType && !contentType.includes("application/json")) {
        if (!res.ok) throw new Error("Request failed");
        return res;
    }

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || data.message || "Request failed");
    }

    return data;
}

// ─── Auth ────────────────────────────────────────────────────────

export async function login(email, password, role) {
    const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
    });
    setToken(data.token);
    setUser({ fullName: data.fullName, email: data.email, role: data.role, userId: data.userId });
    return data;
}

export async function register(fullName, email, password, role) {
    const data = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password, role }),
    });
    setToken(data.token);
    setUser({ fullName: data.fullName, email: data.email, role: data.role, userId: data.userId });
    return data;
}

export function logout() {
    removeToken();
    removeUser();
}

export function isAuthenticated() {
    return !!getToken();
}

export function getCurrentUser() {
    return getUser();
}

// ─── Dashboard ───────────────────────────────────────────────────

export async function getDashboard() {
    return request("/dashboard");
}

// ─── Complaints ──────────────────────────────────────────────────

export async function getMyComplaints() {
    return request("/complaints");
}

export async function getComplaint(complaintId) {
    return request(`/complaints/${complaintId}`);
}

export async function searchComplaints(query) {
    return request(`/complaints/search?q=${encodeURIComponent(query)}`);
}

export async function createComplaint(complaintData, files) {
    const formData = new FormData();

    // Append the complaint JSON as a blob so Spring can deserialize @RequestPart
    const complaintBlob = new Blob([JSON.stringify(complaintData)], { type: "application/json" });
    formData.append("complaint", complaintBlob);

    // Append image files
    if (files && files.length > 0) {
        files.forEach((file) => {
            formData.append("files", file);
        });
    }

    return request("/complaints", {
        method: "POST",
        body: formData,
    });
}

// ─── Files ───────────────────────────────────────────────────────

export function getFileUrl(filename) {
    return `${API_BASE}/files/${filename}`;
}
