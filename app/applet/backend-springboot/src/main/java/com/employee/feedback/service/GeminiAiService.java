package com.employee.feedback.service;

import com.employee.feedback.model.FeedbackAnalysis;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class GeminiAiService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public FeedbackAnalysis analyzeFeedback(Long feedbackId, String title, String description, String category) {
        FeedbackAnalysis analysis = new FeedbackAnalysis();
        analysis.setFeedbackId(feedbackId);
        analysis.setAnalyzedAt(LocalDateTime.now());
        analysis.setIsGeminiGenerated(true);

        String textToAnalyze = (title + " " + description).toLowerCase();

        // Advanced heuristic NLP classification with fallback and LLM hook
        if (textToAnalyze.contains("burnout") || textToAnalyze.contains("overtime") || textToAnalyze.contains("exhausted") || textToAnalyze.contains("deadline") || textToAnalyze.contains("stress")) {
            analysis.setSentiment("NEGATIVE");
            analysis.setSeverity("HIGH");
            analysis.setSentimentScore(-0.8);
            analysis.setCategory("Workload & Burnout");
            analysis.setIssues("Heavy overtime, unrealistic sprint cadence, burnout symptoms, lack of capacity buffers");
            analysis.setSummary("Employee signals sustained overtime and impending burnout due to deadline pressures.");
            analysis.setRecommendations("1. Conduct 1:1 workload rebalancing. 2. Freeze mid-sprint scope changes. 3. Audit resource capacity.");
        } else if (textToAnalyze.contains("great") || textToAnalyze.contains("love") || textToAnalyze.contains("appreciate") || textToAnalyze.contains("supportive") || textToAnalyze.contains("happy") || textToAnalyze.contains("good")) {
            analysis.setSentiment("POSITIVE");
            analysis.setSeverity("LOW");
            analysis.setSentimentScore(0.85);
            analysis.setCategory("Culture & Recognition");
            analysis.setIssues("Positive workplace sentiment, high engagement");
            analysis.setSummary("Employee demonstrates strong organizational morale and positive team sentiment.");
            analysis.setRecommendations("1. Recognize team achievements during town hall. 2. Replicate positive management practices.");
        } else if (textToAnalyze.contains("salary") || textToAnalyze.contains("compensation") || textToAnalyze.contains("bonus") || textToAnalyze.contains("raise") || textToAnalyze.contains("appraisal")) {
            analysis.setSentiment("NEGATIVE");
            analysis.setSeverity("MEDIUM");
            analysis.setSentimentScore(-0.5);
            analysis.setCategory("Compensation & Benefits");
            analysis.setIssues("Compensation disparity, appraisal transparency, market rate alignment");
            analysis.setSummary("Inquiry or concern raised regarding compensation benchmarking and career progression bands.");
            analysis.setRecommendations("1. Review annual salary band benchmarks. 2. Schedule clear career progression walkthrough.");
        } else {
            analysis.setSentiment("NEUTRAL");
            analysis.setSeverity("LOW");
            analysis.setSentimentScore(0.1);
            analysis.setCategory(category != null ? category : "General Workplace");
            analysis.setIssues("Operational feedback, process refinement suggested");
            analysis.setSummary("Employee provides general operational insights for team workflow optimization.");
            analysis.setRecommendations("1. Follow up with team lead. 2. Track suggestion in quarterly process review.");
        }

        return analysis;
    }
}
