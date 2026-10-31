package com.employee.feedback.repository;

import com.employee.feedback.model.FeedbackAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FeedbackAnalysisRepository extends JpaRepository<FeedbackAnalysis, Long> {
    Optional<FeedbackAnalysis> findByFeedbackId(Long feedbackId);
}
