package auth_system_backend.dto;

import auth_system_backend.entity.Role;
import auth_system_backend.entity.User;

import java.time.LocalDateTime;

public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private boolean emailVerified;
    private boolean phoneVerified;
    private boolean twoFactorEnabled;
    private String authProvider;
    private Role role;
    private LocalDateTime createdAt;

    public UserResponse(User user) {
        this.id = user.getId();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.emailVerified = user.isEmailVerified();
        this.phoneVerified = user.isPhoneVerified();
        this.twoFactorEnabled = user.isTwoFactorEnabled();
        this.authProvider = user.getAuthProvider();
        this.role = user.getRole();
        this.createdAt = user.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public boolean isPhoneVerified() {
        return phoneVerified;
    }

    public boolean isTwoFactorEnabled() {
        return twoFactorEnabled;
    }

    public String getAuthProvider() {
        return authProvider;
    }

    public Role getRole() {
        return role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}