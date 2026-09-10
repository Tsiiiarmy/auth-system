package auth_system_backend.repository;

import auth_system_backend.entity.User;
import auth_system_backend.entity.VerificationCode;
import auth_system_backend.entity.VerificationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationCodeRepository
        extends JpaRepository<VerificationCode, Long> {

    Optional<VerificationCode> findTopByUserAndTypeAndUsedFalseOrderByCreatedAtDesc(
            User user,
            VerificationType type
    );
}