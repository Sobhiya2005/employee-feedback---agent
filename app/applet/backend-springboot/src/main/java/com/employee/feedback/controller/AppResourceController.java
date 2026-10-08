package com.employee.feedback.controller;

import com.employee.feedback.model.Department;
import com.employee.feedback.model.Employee;
import com.employee.feedback.model.Goal;
import com.employee.feedback.model.Notification;
import com.employee.feedback.repository.DepartmentRepository;
import com.employee.feedback.repository.EmployeeRepository;
import com.employee.feedback.repository.GoalRepository;
import com.employee.feedback.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class AppResourceController {

    private final DepartmentRepository deptRepo;
    private final EmployeeRepository empRepo;
    private final GoalRepository goalRepo;
    private final NotificationRepository notifRepo;

    public AppResourceController(DepartmentRepository deptRepo, EmployeeRepository empRepo,
                                 GoalRepository goalRepo, NotificationRepository notifRepo) {
        this.deptRepo = deptRepo;
        this.empRepo = empRepo;
        this.goalRepo = goalRepo;
        this.notifRepo = notifRepo;
    }

    // Departments
    @GetMapping("/departments")
    public List<Department> getAllDepartments() {
        return deptRepo.findAll();
    }

    @PostMapping("/departments")
    public Department createDepartment(@RequestBody Department dept) {
        return deptRepo.save(dept);
    }

    // Employees
    @GetMapping("/employees")
    public List<Employee> getAllEmployees() {
        return empRepo.findAll();
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        return empRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/employees")
    public Employee createEmployee(@RequestBody Employee employee) {
        return empRepo.save(employee);
    }

    // Goals
    @GetMapping("/goals/my")
    public List<Goal> getGoals() {
        return goalRepo.findAll();
    }

    @PostMapping("/goals")
    public Goal createGoal(@RequestBody Goal goal) {
        return goalRepo.save(goal);
    }

    // Notifications
    @GetMapping("/notifications")
    public List<Notification> getNotifications() {
        return notifRepo.findAllByOrderByCreatedAtDesc();
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<?> markNotificationRead(@PathVariable Long id) {
        return notifRepo.findById(id).map(n -> {
            n.setIsRead(true);
            notifRepo.save(n);
            return ResponseEntity.ok(n);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Health
    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("status", "UP", "framework", "Spring Boot 3.2.4", "runtime", "Java 17");
    }
}
