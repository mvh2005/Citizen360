package com.citizen360.dto;

import java.util.List;

public class DashboardResponse {

    private long totalComplaints;
    private long pending;
    private long inProgress;
    private long resolved;
    private List<MonthlyData> monthly;
    private List<CategoryData> categories;
    private List<ComplaintResponse> recentComplaints;

    public DashboardResponse() {}

    // Getters and Setters
    public long getTotalComplaints() { return totalComplaints; }
    public void setTotalComplaints(long totalComplaints) { this.totalComplaints = totalComplaints; }

    public long getPending() { return pending; }
    public void setPending(long pending) { this.pending = pending; }

    public long getInProgress() { return inProgress; }
    public void setInProgress(long inProgress) { this.inProgress = inProgress; }

    public long getResolved() { return resolved; }
    public void setResolved(long resolved) { this.resolved = resolved; }

    public List<MonthlyData> getMonthly() { return monthly; }
    public void setMonthly(List<MonthlyData> monthly) { this.monthly = monthly; }

    public List<CategoryData> getCategories() { return categories; }
    public void setCategories(List<CategoryData> categories) { this.categories = categories; }

    public List<ComplaintResponse> getRecentComplaints() { return recentComplaints; }
    public void setRecentComplaints(List<ComplaintResponse> recentComplaints) { this.recentComplaints = recentComplaints; }

    public static class MonthlyData {
        private String month;
        private long count;

        public MonthlyData() {}

        public MonthlyData(String month, long count) {
            this.month = month;
            this.count = count;
        }

        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }

        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }

    public static class CategoryData {
        private String name;
        private long value;

        public CategoryData() {}

        public CategoryData(String name, long value) {
            this.name = name;
            this.value = value;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public long getValue() { return value; }
        public void setValue(long value) { this.value = value; }
    }
}
