package com.employee.feedback.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback_analyses")
public class FeedbackAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long feedbackId;

    private String sentiment; // POSITIVE, NEGATIVE, NEUTRAL
    private String category;
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(columnDefinition = "TEXT")
    private String issues; // Comma or JSON formatted

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    private Double sentimentScore; // -1.0 to 1.0
    private Boolean isGeminiGenerated = true;
    private LocalDateTime analyzedAt = LocalDateTime.now();

    public FeedbackAnalysis() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFeedbackId() { return feedbackId; }
    public void setFeedbackId(Long feedbackId) { this.feedbackId = feedbackId; }

    public String getSentiment() { return sentiment; }
    public void setSentiment(String sentiment) { this.sentiment = sentiment; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getIssues() { return issues; }
    public void setIssues(String issues) { this.issues = issues; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }

    public Double getSentimentScore() { return sentimentScore; }
    public void setSentimentScore(Double sentimentScore) { this.sentimentScore = sentimentScore; }

    public Boolean getIsGeminiGenerated() { return isGeminiGenerated; }
    public void setIsGeminiGenerated(Boolean geminiGenerated) { isGeminiGenerated = geminiGenerated; }

    public LocalDateTime getAnalyzedAt() { return analyzedAt; }
    public void setAnalyzedAt(LocalDateTime analyzedAt) { this.analyzedAt = analyzedAt; }
}
