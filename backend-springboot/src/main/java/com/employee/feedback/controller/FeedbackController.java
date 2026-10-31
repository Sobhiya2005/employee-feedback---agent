package com.employee.feedback.controller;

import com.employee.feedback.config.JwtUtil;
import com.employee.feedback.model.Feedback;
import com.employee.feedback.model.FeedbackAnalysis;
import com.employee.feedback.repository.FeedbackAnalysisRepository;
import com.employee.feedback.repository.FeedbackRepository;
import com.employee.feedback.service.GeminiAiService;
import io.jsonwebtoken.Claims;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;
    private final FeedbackAnalysisRepository analysisRepository;
    private final GeminiAiService aiService;
    private final JwtUtil jwtUtil;

    public FeedbackController(FeedbackRepository feedbackRepository,
                              FeedbackAnalysisRepository analysisRepository,
                              GeminiAiService aiService,
                              JwtUtil jwtUtil) {
        this.feedbackRepository = feedbackRepository;
        this.analysisRepository = analysisRepository;
        this.aiService = aiService;
        this.jwtUtil = jwtUtil;
    }

    private Map<String, Object> enrichFeedback(Feedback f) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", f.getId().toString());
        map.put("employeeId", f.getEmployeeId() != null ? f.getEmployeeId().toString() : null);
        map.put("departmentId", f.getDepartmentId() != null ? f.getDepartmentId().toString() : "1");
        map.put("title", f.getTitle());
        map.put("description", f.getDescription());
        map.put("category", f.getCategory());
        map.put("isAnonymous", f.getIsAnonymous());
        map.put("status", f.getStatus().name());
        map.put("createdAt", f.getCreatedAt().toString());
        map.put("actionNotes", f.getActionNotes());

        analysisRepository.findByFeedbackId(f.getId()).ifPresent(analysis -> {
            map.put("analysis", analysis);
        });

        return map;
    }

    @GetMapping
    public ResponseEntity<?> getAllFeedback() {
        List<Feedback> list = feedbackRepository.findAllByOrderByCreatedAtDesc();
        List<Map<String, Object>> result = list.stream().map(this::enrichFeedback).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyFeedback(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }
        Claims claims = jwtUtil.extractClaims(authHeader.substring(7));
        Long userId = Long.valueOf(claims.get("id").toString());

        List<Feedback> list = feedbackRepository.findByEmployeeIdOrderByCreatedAtDesc(userId);
        List<Map<String, Object>> result = list.stream().map(this::enrichFeedback).toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> submitFeedback(@RequestBody Feedback reqFeedback,
                                           @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long employeeId = null;
        if (Boolean.FALSE.equals(reqFeedback.getIsAnonymous()) && authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                Claims claims = jwtUtil.extractClaims(authHeader.substring(7));
                employeeId = Long.valueOf(claims.get("id").toString());
            } catch (Exception ignored) {}
        }

        reqFeedback.setEmployeeId(employeeId);
        reqFeedback.setStatus(Feedback.Status.ANALYZED);
        Feedback saved = feedbackRepository.save(reqFeedback);

        // Run AI Analysis
        FeedbackAnalysis analysis = aiService.analyzeFeedback(
                saved.getId(),
                saved.getTitle(),
                saved.getDescription(),
                saved.getCategory()
        );
        analysisRepository.save(analysis);

        return ResponseEntity.status(HttpStatus.CREATED).body(enrichFeedback(saved));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFeedbackById(@PathVariable Long id) {
        return feedbackRepository.findById(id)
                .map(f -> ResponseEntity.ok(enrichFeedback(f)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFeedbackStatus(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return feedbackRepository.findById(id).map(f -> {
            if (body.containsKey("status")) {
                f.setStatus(Feedback.Status.valueOf(body.get("status").toString()));
            }
            if (body.containsKey("actionNotes")) {
                f.setActionNotes(body.get("actionNotes").toString());
            }
            feedbackRepository.save(f);
            return ResponseEntity.ok(enrichFeedback(f));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        if (!feedbackRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        feedbackRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Feedback deleted successfully"));
    }
}
