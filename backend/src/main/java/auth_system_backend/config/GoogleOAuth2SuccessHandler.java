package auth_system_backend.config;

import auth_system_backend.entity.User;
import auth_system_backend.repository.UserRepository;
import auth_system_backend.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class GoogleOAuth2SuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public GoogleOAuth2SuccessHandler(
            UserRepository userRepository,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User googleUser =
                (OAuth2User) authentication.getPrincipal();

        String email = googleUser.getAttribute("email");
        String name = googleUser.getAttribute("name");

        if (email == null || email.isBlank()) {
            response.sendError(
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Google account email could not be retrieved"
            );
            return;
        }

        String normalizedEmail =
                email.trim().toLowerCase();

        User user = userRepository
                .findByEmail(normalizedEmail)
                .orElse(null);

        if (user == null) {

            user = new User();

            user.setFullName(
                    name != null && !name.isBlank()
                            ? name
                            : "Google User"
            );

            user.setEmail(normalizedEmail);

            // Google users complete phone verification later
            user.setPhoneNumber(null);

            // Google users don't have a local password
            user.setPasswordHash(null);

            user.setEmailVerified(true);
            user.setPhoneVerified(false);
            user.setTwoFactorEnabled(false);
            user.setAuthProvider("GOOGLE");

            user = userRepository.save(user);

        } else {

            /*
             * Existing LOCAL account:
             * Do not silently convert it to GOOGLE.
             */
            if (!"GOOGLE".equals(user.getAuthProvider())) {

                response.sendError(
                        HttpServletResponse.SC_CONFLICT,
                        "An account with this email already exists. Please use the original login method."
                );
                return;
            }
        }

        String token = jwtService.generateToken(user);

        /*
         * Temporary frontend callback.
         * We will change this to your actual frontend URL
         * when we integrate the frontend.
         */
        String frontendUrl =
                "http://localhost:5173/oauth2/callback?token="
                        + token;

        getRedirectStrategy().sendRedirect(
                request,
                response,
                frontendUrl
        );
    }
}