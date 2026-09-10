package auth_system_backend.controller;

import auth_system_backend.dto.CreateUserRequest;
import auth_system_backend.dto.UpdateUserRequest;
import auth_system_backend.dto.UserResponse;
import auth_system_backend.entity.Role;
import auth_system_backend.service.UserManagementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserManagementService userManagementService;

    public UserController(
            UserManagementService userManagementService
    ) {
        this.userManagementService = userManagementService;
    }

    
    // Get all users
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        return ResponseEntity.ok(
                userManagementService.getAllUsers()
        );
    }

    // Get one user
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                userManagementService.getUserById(id)
        );
    }

    // Create user
    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody CreateUserRequest request
    ) {

        UserResponse response =
                userManagementService.createUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request
    ) {

        return ResponseEntity.ok(
                userManagementService.updateUser(id, request)
        );
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id
    ) {

        userManagementService.deleteUser(id);

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "User deleted successfully"
                )
        );
    }

    // Change user role
    @PutMapping("/{id}/role")
    public ResponseEntity<UserResponse> changeRole(
            @PathVariable Long id,
            @RequestParam Role role
    ) {

        return ResponseEntity.ok(
                userManagementService.changeRole(id, role)
        );
    }
}