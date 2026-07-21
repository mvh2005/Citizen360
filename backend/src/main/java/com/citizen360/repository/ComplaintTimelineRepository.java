package com.citizen360.repository;

import com.citizen360.model.ComplaintTimeline;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintTimelineRepository extends JpaRepository<ComplaintTimeline, Long> {

    List<ComplaintTimeline> findByComplaintIdOrderByTimestampAsc(Long complaintId);
}
