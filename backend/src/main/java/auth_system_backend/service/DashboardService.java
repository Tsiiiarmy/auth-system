package auth_system_backend.service;

import auth_system_backend.entity.Role;
import auth_system_backend.entity.User;
import auth_system_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DashboardService {

    private final UserRepository userRepository;

    public DashboardService(
            UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }

    public Map<String, Object> getDashboard(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        Role role = user.getRole();

        return switch (role) {

            case ADMIN -> Map.of(
                    "success", true,
                    "role", "ADMIN",
                    "message", "Welcome to the admin dashboard",
                    "permissions", new String[]{
                            "VIEW_USERS",
                            "CREATE_USERS",
                            "EDIT_USERS",
                            "DELETE_USERS",
                            "MANAGE_ROLES"
                    }
            );

            case MANAGER -> Map.of(
                    "success", true,
                    "role", "MANAGER",
                    "message", "Welcome to the manager dashboard",
                    "permissions", new String[]{
                            "VIEW_USERS",
                            "EDIT_USERS"
                    }
            );

            case USER -> Map.of(
                    "success", true,
                    "role", "USER",
                    "message", "Welcome to your dashboard",
                    "permissions", new String[]{}
            );
        };
    }
}