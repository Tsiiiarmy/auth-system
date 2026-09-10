package auth_system_backend.service;

import auth_system_backend.dto.RegisterRequest;
import auth_system_backend.entity.User;
import auth_system_backend.entity.VerificationType;
import auth_system_backend.repository.UserRepository;
import auth_system_backend.validation.PasswordValidator;
import auth_system_backend.validation.PhoneNumberValidator;
import auth_system_backend.service.EmailService;
import auth_system_backend.exception.AccountLockedException;
import java.time.LocalDateTime;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service 
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final SmsService smsService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            OtpService otpService,
            JwtService jwtService,
            EmailService emailService,
            SmsService smsService
    )

     {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.smsService = smsService;
    }

    public User findByEmail(String email) {

        return userRepository.findByEmail(
                email.trim().toLowerCase()
        ).orElseThrow(() ->
                new IllegalArgumentException(
                        "User not found"
                )
        );
    }
        public User findByPhone(String phoneNumber) {

        String normalizedPhone =
                PhoneNumberValidator.validateAndNormalize(
                        phoneNumber
                );

        return userRepository.findByPhoneNumber(
                normalizedPhone
        ).orElseThrow(() ->
                new IllegalArgumentException("User not found")
        );
        }

    public void forgotPassword(String email) {

                String normalizedEmail =
                        email.trim().toLowerCase();

                User user = userRepository.findByEmail(normalizedEmail)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found"
                                )
                        );

                String otp =
                        otpService.generateOtp(
                                user,
                                VerificationType.PASSWORD_RESET
                        );

                emailService.sendOtpEmail(
                        user.getEmail(),
                        otp
                );


}
     public void resetPassword(
                String email,
                String code,
                String newPassword,
                String confirmPassword
        ) {

        if (!newPassword.equals(confirmPassword)) {
                throw new IllegalArgumentException(
                        "Passwords do not match"
                );
        }

        PasswordValidator.validate(newPassword);

        User user = findByEmail(email);

        otpService.verifyOtp(
                user,
                VerificationType.PASSWORD_RESET,
                code
        );

        user.setPasswordHash(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);
        
}
        public void verifyPasswordResetCode(
                String email,
                String code
) {
    User user = findByEmail(email);

    otpService.validateOtp(
            user,
            VerificationType.PASSWORD_RESET,
            code
    );
}

        private int calculateLockoutMinutes(int lockoutLevel) {

        return switch (lockoutLevel) {
                case 0 -> 5;
                case 1 -> 10;
                case 2 -> 20;
                case 3 -> 40;
                default -> 60;
        };
        }

    public User register(RegisterRequest request) {

        // 1. Check password confirmation
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException(
                    "Passwords do not match"
            );
        }

        // 2. Validate password
        PasswordValidator.validate(request.getPassword());

        // 3. Normalize email
        String normalizedEmail =
                request.getEmail().trim().toLowerCase();

        // 4. Validate and normalize phone
        String normalizedPhone =
                PhoneNumberValidator.validateAndNormalize(
                        request.getPhoneNumber()
                );

        // 5. Check duplicate email
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException(
                    "Email is already registered"
            );
        }

        // 6. Check duplicate phone
        if (userRepository.existsByPhoneNumber(normalizedPhone)) {
            throw new IllegalArgumentException(
                    "Phone number is already registered"
            );
        }
        
        // 7. Create user
        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(normalizedEmail);
        user.setPhoneNumber(normalizedPhone);

        // 8. Hash password
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );

        // 9. Set default account status
        user.setEmailVerified(false);
        user.setPhoneVerified(false);
        user.setTwoFactorEnabled(false);
        user.setAuthProvider("LOCAL");

        // 10. Save user
        User savedUser = userRepository.save(user);

        // 11. Generate email verification OTP
        String emailOtp =
                otpService.generateOtp(
                        savedUser,
                        VerificationType.EMAIL_VERIFICATION
                );

        // 12. Generate phone verification OTP
        String phoneOtp =
                otpService.generateOtp(
                        savedUser,
                        VerificationType.PHONE_VERIFICATION
                );

        // 13. Send email verification OTP
        emailService.sendOtpEmail(
                savedUser.getEmail(),
                emailOtp
        );
        // 14. Send phone verification OTP
        smsService.sendOtpSms(
        savedUser.getPhoneNumber(),
        phoneOtp
);

        return savedUser;
    }

    public void verifyEmail(User user, String code) {

        otpService.verifyOtp(
                user,
                VerificationType.EMAIL_VERIFICATION,
                code
        );

        user.setEmailVerified(true);

        userRepository.save(user);
    }


        public void verifyPhone(User user, String code) {

        otpService.verifyOtp(
                user,
                VerificationType.PHONE_VERIFICATION,
                code
        );

        user.setPhoneVerified(true);

        userRepository.save(user);
        }
        

        public String login(String identifier, String password) {

    String value = identifier.trim();

    User user;

    // Login using email
    if (value.contains("@")) {

        String normalizedEmail =
                value.toLowerCase();

        user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid email or password"
                        )
                );

    } else {

        // Login using phone number
        String normalizedPhone =
                PhoneNumberValidator.validateAndNormalize(value);

        user = userRepository.findByPhoneNumber(normalizedPhone)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid phone number or password"
                        )
                );
    }

    // Check if the account is currently locked
    if (user.getLockedUntil() != null) {

        if (user.getLockedUntil().isAfter(LocalDateTime.now())) {

            throw new AccountLockedException(
                    "Account temporarily locked. Try again later."
            );
        }

        // Lock has expired
        user.setLockedUntil(null);
        user.setFailedLoginAttempts(0);

        userRepository.save(user);
    }

    // Check password
    if (!passwordEncoder.matches(
            password,
            user.getPasswordHash()
    )) {

        int failedAttempts =
                user.getFailedLoginAttempts() + 1;

        user.setFailedLoginAttempts(failedAttempts);

        // Lock account after 5 failed attempts
        if (failedAttempts >= 5) {

            int lockoutMinutes =
                    calculateLockoutMinutes(
                            user.getLockoutLevel()
                    );

            user.setLockedUntil(
                    LocalDateTime.now()
                            .plusMinutes(lockoutMinutes)
            );

            user.setLockoutLevel(
                    user.getLockoutLevel() + 1
            );

            user.setFailedLoginAttempts(0);

            userRepository.save(user);

            throw new AccountLockedException(
                    "Too many failed login attempts. " +
                    "Account locked for " +
                    lockoutMinutes +
                    " minutes."
            );
        }

        userRepository.save(user);

        throw new IllegalArgumentException(
                "Invalid email or phone number or password"
        );
    }

    // Correct password → reset failed attempts
    user.setFailedLoginAttempts(0);

    // Successful login resets progressive lockout level
    user.setLockoutLevel(0);

    userRepository.save(user);

    // Email verification
    if (!user.isEmailVerified()) {
        throw new IllegalArgumentException(
                "Email is not verified"
        );
    }

    // Phone verification
    if (!user.isPhoneVerified()) {
        throw new IllegalArgumentException(
                "Phone number is not verified"
        );
    }

    // 2FA
    if (user.isTwoFactorEnabled()) {

        String otp =
                otpService.generateOtp(
                        user,
                        VerificationType.TWO_FACTOR
                );

        emailService.sendOtpEmail(
                user.getEmail(),
                otp
        );

        throw new IllegalArgumentException(
                "2FA verification required"
        );
    }

    return jwtService.generateToken(user);
}


        public String verifyTwoFactor(
        String email,
        String code
) {

                User user = findByEmail(email);

                otpService.verifyOtp(
                        user,
                        VerificationType.TWO_FACTOR,
                        code
                );

                return jwtService.generateToken(user);
}

        public void enableTwoFactor(String email) {

                User user = findByEmail(email);

                if (!user.isEmailVerified()) {
                        throw new IllegalArgumentException(
                                "Email must be verified before enabling 2FA"
                        );
                }

                if (!user.isPhoneVerified()) {
                        throw new IllegalArgumentException(
                                "Phone number must be verified before enabling 2FA"
                        );
                }

                user.setTwoFactorEnabled(true);

                userRepository.save(user);
        }

        public void disableTwoFactor(String email) {

                User user = findByEmail(email);

                user.setTwoFactorEnabled(false);

                userRepository.save(user);
        }
    
}