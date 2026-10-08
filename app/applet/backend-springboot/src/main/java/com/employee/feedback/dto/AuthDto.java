package com.employee.feedback.dto;

import com.employee.feedback.model.User;

public class AuthDto {

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String email;
        private String password;
        private String name;
        private User.Role role;
        private String departmentId;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public User.Role getRole() { return role; }
        public void setRole(User.Role role) { this.role = role; }
        public String getDepartmentId() { return departmentId; }
        public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
    }

    public static class AuthResponse {
        private String token;
        private Object user;
        private Object employee;

        public AuthResponse(String token, Object user, Object employee) {
            this.token = token;
            this.user = user;
            this.employee = employee;
        }

        public String getToken() { return token; }
        public Object getUser() { return user; }
        public Object getEmployee() { return employee; }
    }
}
