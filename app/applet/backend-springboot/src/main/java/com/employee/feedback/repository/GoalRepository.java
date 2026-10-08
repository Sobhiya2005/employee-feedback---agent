package com.employee.feedback.repository;

import com.employee.feedback.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
}
