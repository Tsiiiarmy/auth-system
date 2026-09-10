package auth_system_backend.service;

import auth_system_backend.dto.CreateUserRequest;
import auth_system_backend.dto.UpdateUserRequest;
import auth_system_backend.dto.UserResponse;
import auth_system_backend.entity.Role;
import auth_system_backend.entity.User;
import auth_system_backend.repository.UserRepository;
import auth_system_backend.validation.PhoneNumberValidator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserManagementService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserManagementService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Get all users
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(UserResponse::new)
                .toList();
    }

    // Get one user
    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        return new UserResponse(user);
    }

    // Create user
    public UserResponse createUser(CreateUserRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "Email is already registered"
            );
        }

        String phoneNumber = null;

        if (request.getPhoneNumber() != null
                && !request.getPhoneNumber().isBlank()) {

            phoneNumber = PhoneNumberValidator.validateAndNormalize(
                    request.getPhoneNumber()
            );

            if (userRepository.existsByPhoneNumber(phoneNumber)) {
                throw new IllegalArgumentException(
                        "Phone number is already registered"
                );
            }
        }

        User user = new User();

        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);

        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(
                request.getRole() != null
                        ? request.getRole()
                        : Role.USER
        );

        user.setAuthProvider("LOCAL");

        /*
         * Users created through the management module
         * are initially unverified.
         *
         * Verification can be handled through the
         * existing verification system.
         */
        user.setEmailVerified(false);
        user.setPhoneVerified(false);
        user.setTwoFactorEnabled(false);

        User savedUser = userRepository.save(user);

        return new UserResponse(savedUser);
    }

    // Update user
    public UserResponse updateUser(
            Long id,
            UpdateUserRequest request
    ) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        String email = request.getEmail()
                .trim()
                .toLowerCase();


        // Check whether another user already owns this email
        if (!user.getEmail().equals(email)
                && userRepository.existsByEmail(email)) {

            throw new IllegalArgumentException(
                    "Email is already registered"
            );
        }

        String phoneNumber = null;

        if (request.getPhoneNumber() != null
                && !request.getPhoneNumber().isBlank()) {

            phoneNumber = PhoneNumberValidator.validateAndNormalize(
                    request.getPhoneNumber()
            );

            // Check whether another user already owns this phone
            if (!phoneNumber.equals(user.getPhoneNumber())
                    && userRepository.existsByPhoneNumber(phoneNumber)) {

                throw new IllegalArgumentException(
                        "Phone number is already registered"
                );
            }
        }

        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);



        User updatedUser = userRepository.save(user);

        return new UserResponse(updatedUser);
    }


    // Delete user
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "User not found"
            );
        }

        userRepository.deleteById(id);
    }

    
    // Change role
    public UserResponse changeRole(
            Long id,
            Role role
    ) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        user.setRole(role);

        User updatedUser = userRepository.save(user);

        return new UserResponse(updatedUser);
    }
}