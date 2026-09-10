package auth_system_backend.controller;

import auth_system_backend.dto.LoginRequest;
import auth_system_backend.dto.RegisterRequest;
import auth_system_backend.dto.ForgotPasswordRequest;
import auth_system_backend.dto.ResetPasswordRequest;
import auth_system_backend.dto.Verify2FARequest;
import auth_system_backend.entity.User;
import auth_system_backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        User user = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        "Registration successful"
                );
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(
        @RequestParam String email,
        @RequestParam String code
) 
{

    User user = authService.findByEmail(email);

    authService.verifyEmail(user, code);

    return ResponseEntity.ok(
            "Email verified successfully"
    );
}
        @PostMapping("/verify-phone")
        public ResponseEntity<?> verifyPhone(
                @RequestParam String phoneNumber,
                @RequestParam String code
        ) {

        User user = authService.findByPhone(phoneNumber);

        authService.verifyPhone(user, code);

        return ResponseEntity.ok(
                "Phone verified successfully"
        );
}

        @PostMapping("/login")
        public ResponseEntity<?> login(
        @Valid @RequestBody LoginRequest request
) {

        String token = authService.login(
                request.getIdentifier(),
                request.getPassword()
        );

        return ResponseEntity.ok(
                java.util.Map.of(
                        "success", true,
                        "message", "Login successful",
                        "token", token
                )
        );
}


        @PostMapping("/forgot-password")
        public ResponseEntity<?> forgotPassword(
                        @Valid @RequestBody ForgotPasswordRequest request
                ) {

                authService.forgotPassword(
                        request.getEmail()
                );

                return ResponseEntity.ok(
                        java.util.Map.of(
                                "success", true,
                                "message",
                                "Password reset code generated"
            )
    );
}

        @PostMapping("/verify-password-reset-code")
        public ResponseEntity<?> verifyPasswordResetCode(
                @RequestParam String email,
                @RequestParam String code
        ) {
        authService.verifyPasswordResetCode(email, code);

        return ResponseEntity.ok(
                java.util.Map.of(
                        "success", true,
                        "message", "Verification code is valid"
                )
        );
        }

        
        @PostMapping("/reset-password")
        public ResponseEntity<?> resetPassword(
                        @Valid @RequestBody ResetPasswordRequest request
                ) {

                authService.resetPassword(
                        request.getEmail(),
                        request.getCode(),
                        request.getNewPassword(),
                        request.getConfirmPassword()
                );

                return ResponseEntity.ok(
                        java.util.Map.of(
                                "success", true,
                                "message",
                                "Password reset successfully"
                        )
    );
}

        @PostMapping("/verify-2fa")
        public ResponseEntity<?> verifyTwoFactor(
        @Valid @RequestBody Verify2FARequest request
) {

                String token = authService.verifyTwoFactor(
                        request.getEmail(),
                        request.getCode()
                );

                return ResponseEntity.ok(
                        java.util.Map.of(
                                "success", true,
                                "message", "2FA verification successful",
                                "token", token
                        )
    );
}

        @PostMapping("/2fa/enable")
        public ResponseEntity<?> enableTwoFactor(
                org.springframework.security.core.Authentication authentication
        ) {

                authService.enableTwoFactor(
                        authentication.getName()
                );

                return ResponseEntity.ok(
                        java.util.Map.of(
                                "success", true,
                                "message", "2FA enabled successfully"
                        )
        );
        }

        @PostMapping("/2fa/disable")
        public ResponseEntity<?> disableTwoFactor(
        org.springframework.security.core.Authentication authentication
) {

                authService.disableTwoFactor(
                        authentication.getName()
                );

                return ResponseEntity.ok(
                        java.util.Map.of(
                                "success", true,
                                "message", "2FA disabled successfully"
                        )
    );
}

        @GetMapping("/me")
                public ResponseEntity<?> getCurrentUser(
                        org.springframework.security.core.Authentication authentication
                ) {
                User user = authService.findByEmail(authentication.getName());

                return ResponseEntity.ok(java.util.Map.of(
                        "success", true,
                        "message", "You are authenticated",
                        "fullName", user.getFullName(),
                        "email", user.getEmail(),
                        "role", user.getRole().name(),
                        "phoneNumber", user.getPhoneNumber(),
                        "emailVerified", user.isEmailVerified(),
                        "phoneVerified", user.isPhoneVerified(),
                        "twoFactorEnabled", user.isTwoFactorEnabled()
                ));
                }
}