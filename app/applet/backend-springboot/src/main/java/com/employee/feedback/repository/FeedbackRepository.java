package com.employee.feedback.repository;

import com.employee.feedback.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
    List<Feedback> findAllByOrderByCreatedAtDesc();
}
