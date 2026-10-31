package com.employee.feedback.config;

import com.employee.feedback.model.Department;
import com.employee.feedback.model.Employee;
import com.employee.feedback.model.Feedback;
import com.employee.feedback.model.FeedbackAnalysis;
import com.employee.feedback.model.Goal;
import com.employee.feedback.model.Notification;
import com.employee.feedback.model.User;
import com.employee.feedback.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            UserRepository userRepo,
            DepartmentRepository deptRepo,
            EmployeeRepository empRepo,
            FeedbackRepository feedbackRepo,
            FeedbackAnalysisRepository analysisRepo,
            GoalRepository goalRepo,
            NotificationRepository notifRepo,
            PasswordEncoder passwordEncoder) {

        return args -> {
            if (userRepo.count() > 0) return;

            // 1. Departments
            Department engineering = deptRepo.save(new Department("Engineering", "ENG", "Core software development, DevOps and QA", "David Chen", 450000.0));
            Department product = deptRepo.save(new Department("Product Management", "PROD", "Product discovery, roadmapping, UX", "Sarah Jenkins", 280000.0));
            Department hrDept = deptRepo.save(new Department("Human Resources", "HR", "People operations, talent acquisition, culture", "Elena Rostova", 190000.0));
            Department sales = deptRepo.save(new Department("Sales & Marketing", "SALES", "Revenue growth, outreach, and customer acquisition", "Marcus Vance", 340000.0));

            // 2. Users (HR & Employees)
            String defaultPassword = passwordEncoder.encode("password123");

            User hrUser = userRepo.save(new User("hr@company.com", defaultPassword, "Elena Rostova (HR Admin)", User.Role.HR_ADMIN));
            User emp1 = userRepo.save(new User("employee@company.com", defaultPassword, "Alex Morgan", User.Role.EMPLOYEE));
            User emp2 = userRepo.save(new User("priya@company.com", defaultPassword, "Priya Sharma", User.Role.EMPLOYEE));

            // 3. Employee Records
            Employee alex = new Employee();
            alex.setEmployeeCode("EMP-1001");
            alex.setName("Alex Morgan");
            alex.setEmail("employee@company.com");
            alex.setDepartmentId(engineering.getId());
            alex.setDesignation("Senior Full Stack Engineer");
            alex.setExperienceYears(6);
            alex.setJoiningDate("2021-03-15");
            alex.setStatus("ACTIVE");
            alex.setPerformanceScore(88);
            alex.setManagerName("David Chen");
            alex = empRepo.save(alex);

            Employee priya = new Employee();
            priya.setEmployeeCode("EMP-1002");
            priya.setName("Priya Sharma");
            priya.setEmail("priya@company.com");
            priya.setDepartmentId(product.getId());
            priya.setDesignation("Senior Product Designer");
            priya.setExperienceYears(5);
            priya.setJoiningDate("2022-01-10");
            priya.setStatus("ACTIVE");
            priya.setPerformanceScore(92);
            priya.setManagerName("Sarah Jenkins");
            empRepo.save(priya);

            // 4. Sample Feedback
            Feedback f1 = new Feedback();
            f1.setEmployeeId(alex.getId());
            f1.setDepartmentId(engineering.getId());
            f1.setTitle("Sprint pacing and unrealistic deadlines");
            f1.setDescription("The recent sprint requirements shifted mid-cycle without scope adjustments. The team has had to work overtime 3 weekends in a row leading to burnout.");
            f1.setCategory("Workload & Burnout");
            f1.setIsAnonymous(false);
            f1.setStatus(Feedback.Status.ANALYZED);
            f1 = feedbackRepo.save(f1);

            FeedbackAnalysis fa1 = new FeedbackAnalysis();
            fa1.setFeedbackId(f1.getId());
            fa1.setSentiment("NEGATIVE");
            fa1.setCategory("Workload & Burnout");
            fa1.setSeverity("HIGH");
            fa1.setIssues("Overtime, scope creep, unrealistic sprint deadlines, burnout risk");
            fa1.setSummary("Employee flags persistent weekend overtime and unstable sprint scopes causing high burnout risk.");
            fa1.setRecommendations("1. Implement strict sprint freezing rules. 2. Conduct capacity review with Engineering Lead.");
            fa1.setSentimentScore(-0.75);
            fa1.setIsGeminiGenerated(true);
            analysisRepo.save(fa1);

            // 5. Sample Goal
            Goal g1 = new Goal();
            g1.setEmployeeId(alex.getId());
            g1.setTitle("Complete Microservices Migration");
            g1.setDescription("Migrate legacy auth services into Spring Boot microservices with OAuth2 and JWT.");
            g1.setTargetDate("2026-11-30");
            g1.setStatus("IN_PROGRESS");
            g1.setProgress(65);
            goalRepo.save(g1);

            // 6. Sample Notification
            Notification n1 = new Notification();
            n1.setTitle("Sprint Retrospective Action Items");
            n1.setMessage("HR and Engineering Leadership have scheduled a meeting to address sprint pacing concerns.");
            n1.setType("INFO");
            n1.setTargetRole("EMPLOYEE");
            n1.setDepartmentId(engineering.getId());
            notifRepo.save(n1);
        };
    }
}
