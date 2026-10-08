package com.employee.feedback.controller;

import com.employee.feedback.config.JwtUtil;
import com.employee.feedback.dto.AuthDto;
import com.employee.feedback.model.Employee;
import com.employee.feedback.model.User;
import com.employee.feedback.repository.EmployeeRepository;
import com.employee.feedback.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, EmployeeRepository employeeRepository,
                          PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDto.LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        Optional<Employee> employeeOpt = employeeRepository.findByEmail(user.getEmail());

        return ResponseEntity.ok(new AuthDto.AuthResponse(token, user, employeeOpt.orElse(null)));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is already registered"));
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getName(),
                request.getRole() != null ? request.getRole() : User.Role.EMPLOYEE
        );
        user = userRepository.save(user);

        Employee employee = null;
        if (user.getRole() == User.Role.EMPLOYEE) {
            employee = new Employee();
            employee.setEmployeeCode("EMP-" + (1000 + user.getId()));
            employee.setName(user.getName());
            employee.setEmail(user.getEmail());
            employee.setDepartmentId(request.getDepartmentId() != null ? Long.parseLong(request.getDepartmentId()) : 1L);
            employee.setDesignation("Software Engineer");
            employee.setExperienceYears(2);
            employee.setJoiningDate("2024-01-01");
            employee = employeeRepository.save(employee);
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(new AuthDto.AuthResponse(token, user, employee));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing or invalid token"));
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Expired or invalid token"));
        }

        Claims claims = jwtUtil.extractClaims(token);
        String email = claims.getSubject();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        Optional<Employee> employeeOpt = employeeRepository.findByEmail(email);

        return ResponseEntity.ok(Map.of("user", user, "employee", employeeOpt.orElse(null)));
    }
}
