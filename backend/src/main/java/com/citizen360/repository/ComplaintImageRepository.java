package com.citizen360.repository;

import com.citizen360.model.ComplaintImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintImageRepository extends JpaRepository<ComplaintImage, Long> {

    List<ComplaintImage> findByComplaintId(Long complaintId);
}
