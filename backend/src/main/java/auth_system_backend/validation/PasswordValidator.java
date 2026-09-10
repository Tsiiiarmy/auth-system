package auth_system_backend.validation;

public class PasswordValidator {

    private PasswordValidator() {
    }

    public static void validate(String password) {

        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException(
                    "Password must contain at least 8 characters"
            );
        }

        if (!password.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException(
                    "Password must contain at least one uppercase letter"
            );
        }

        if (!password.matches(".*[a-z].*")) {
            throw new IllegalArgumentException(
                    "Password must contain at least one lowercase letter"
            );
        }

        if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*")) {
            throw new IllegalArgumentException(
                    "Password must contain at least one special character"
            );
        }
        
        for (int i = 0; i < password.length() - 1; i++) {

            char current = password.charAt(i);
            char next = password.charAt(i + 1);

            if (Character.isDigit(current)
                    && Character.isDigit(next)) {

                int currentDigit = current - '0';
                int nextDigit = next - '0';

                if (Math.abs(currentDigit - nextDigit) == 1) {
                    throw new IllegalArgumentException(
                            "Password cannot contain consecutive numbers"
                    );
                }
            }
        }

    }
}