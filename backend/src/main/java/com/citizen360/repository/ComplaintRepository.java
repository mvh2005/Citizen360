package com.citizen360.repository;

import com.citizen360.model.Complaint;
import com.citizen360.model.enums.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    Optional<Complaint> findByComplaintId(String complaintId);

    List<Complaint> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Complaint> findByStatusOrderByCreatedAtDesc(ComplaintStatus status);

    List<Complaint> findByAssignedOfficerIdOrderByCreatedAtDesc(Long officerId);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, ComplaintStatus status);

    @Query("SELECT c.category, COUNT(c) FROM Complaint c WHERE c.user.id = :userId GROUP BY c.category")
    List<Object[]> countByCategory(@Param("userId") Long userId);

    @Query("SELECT FUNCTION('MONTH', c.createdAt) as month, COUNT(c) FROM Complaint c WHERE c.user.id = :userId AND FUNCTION('YEAR', c.createdAt) = FUNCTION('YEAR', CURRENT_DATE) GROUP BY FUNCTION('MONTH', c.createdAt) ORDER BY month")
    List<Object[]> countMonthly(@Param("userId") Long userId);

    @Query("SELECT c FROM Complaint c WHERE c.complaintId LIKE %:query% OR c.title LIKE %:query% ORDER BY c.createdAt DESC")
    List<Complaint> search(@Param("query") String query);
}
