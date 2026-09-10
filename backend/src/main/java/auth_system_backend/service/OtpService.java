package auth_system_backend.service;

import auth_system_backend.entity.User;
import auth_system_backend.entity.VerificationCode;
import auth_system_backend.entity.VerificationType;
import auth_system_backend.repository.VerificationCodeRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpService {

    private final VerificationCodeRepository verificationCodeRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    private static final int OTP_EXPIRATION_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 5;

    public OtpService(
            VerificationCodeRepository verificationCodeRepository
    ) {
        this.verificationCodeRepository =
                verificationCodeRepository;
    }

    public String generateOtp(
            User user,
            VerificationType type
    ) {

        String code = String.format(
                "%06d",
                secureRandom.nextInt(1_000_000)
        );

        VerificationCode verificationCode =
                new VerificationCode();

        verificationCode.setUser(user);
        verificationCode.setCode(code);
        verificationCode.setType(type);
        verificationCode.setExpiresAt(
                LocalDateTime.now()
                        .plusMinutes(OTP_EXPIRATION_MINUTES)
        );
        verificationCode.setUsed(false);
        verificationCode.setAttempts(0);

        verificationCodeRepository.save(
                verificationCode
        );

        return code;
    }

    
    public void verifyOtp(
            User user,
            VerificationType type,
            String submittedCode
    ) {

        VerificationCode verificationCode =
                verificationCodeRepository
                        .findTopByUserAndTypeAndUsedFalseOrderByCreatedAtDesc(
                                user,
                                type
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "No active verification code found"
                                )
                        );

        if (verificationCode.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            throw new IllegalArgumentException(
                    "Verification code has expired"
            );
        }


        if (verificationCode.getAttempts() >= MAX_ATTEMPTS) {

            throw new IllegalArgumentException(
                    "Maximum verification attempts exceeded"
            );
        }


        if (!verificationCode.getCode()
                .equals(submittedCode)) {

            verificationCode.setAttempts(
                    verificationCode.getAttempts() + 1
            );

            verificationCodeRepository.save(
                    verificationCode
            );

            throw new IllegalArgumentException(
                    "Invalid verification code"
            );
        }

        verificationCode.setUsed(true);

        verificationCodeRepository.save(
                verificationCode
        );
    }

    
    public void validateOtp(
        User user,
        VerificationType type,
        String submittedCode
) {
    VerificationCode verificationCode =
            verificationCodeRepository
                    .findTopByUserAndTypeAndUsedFalseOrderByCreatedAtDesc(
                            user,
                            type
                    )
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "No active verification code found"
                            )
                    );

    if (verificationCode.getExpiresAt()
            .isBefore(LocalDateTime.now())) {
        throw new IllegalArgumentException(
                "Verification code has expired"
        );
    }

    if (verificationCode.getAttempts() >= MAX_ATTEMPTS) {
        throw new IllegalArgumentException(
                "Maximum verification attempts exceeded"
        );
    }

    if (!verificationCode.getCode()
            .equals(submittedCode)) {

        verificationCode.setAttempts(
                verificationCode.getAttempts() + 1
        );

        verificationCodeRepository.save(
                verificationCode
        );

        throw new IllegalArgumentException(
                "Invalid verification code"
        );
    }
}
}