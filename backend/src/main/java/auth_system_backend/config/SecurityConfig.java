package auth_system_backend.config;

import auth_system_backend.service.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.googleOAuth2SuccessHandler = googleOAuth2SuccessHandler;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(Customizer.withDefaults())

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            .authorizeHttpRequests(auth -> auth

                // =========================
                // PUBLIC AUTH ENDPOINTS
                // =========================

                .requestMatchers(
                        "/api/auth/register",
                        "/api/auth/login",
                        "/api/auth/verify-email",
                        "/api/auth/verify-phone",
                        "/api/auth/forgot-password",
                        "/api/auth/reset-password",
                        "/api/auth/verify-password-reset-code",
                        "/api/auth/verify-2fa",
                        "/oauth2/**",
                        "/login/oauth2/**"
                ).permitAll()


                // =========================
                // USER MANAGEMENT
                // =========================

                // VIEW USERS
                .requestMatchers(
                        HttpMethod.GET,
                        "/api/users",
                        "/api/users/**"
                ).hasAuthority("VIEW_USERS")


                // CREATE USERS
                .requestMatchers(
                        HttpMethod.POST,
                        "/api/users"
                ).hasAuthority("CREATE_USERS")


                // MANAGE ROLES
                .requestMatchers(
                        HttpMethod.PUT,
                        "/api/users/*/role"
                ).hasAuthority("MANAGE_ROLES")


                // EDIT USERS
                .requestMatchers(
                        HttpMethod.PUT,
                        "/api/users/**"
                ).hasAuthority("EDIT_USERS")


                // DELETE USERS
                .requestMatchers(
                        HttpMethod.DELETE,
                        "/api/users/**"
                ).hasAuthority("DELETE_USERS")


                // =========================
                // EVERYTHING ELSE
                // =========================

                .anyRequest().authenticated()
            )

            .exceptionHandling(exception -> exception

                // Not authenticated -> 401
                .defaultAuthenticationEntryPointFor(
                        new HttpStatusEntryPoint(
                                HttpStatus.UNAUTHORIZED
                        ),
                        request ->
                                request.getRequestURI()
                                        .startsWith("/api/")
                )

                // user is authenticated but does not have permission 
             .accessDeniedHandler(
                        (request, response, accessDeniedException) -> {

                        response.setStatus(HttpStatus.FORBIDDEN.value());
                        response.setContentType("application/json");

                        response.getWriter().write(
                                "{\"success\":false,\"message\":\"Forbidden\"}"
                        );
        }
)

            )

            .oauth2Login(oauth2 ->
                    oauth2.successHandler(
                            googleOAuth2SuccessHandler
                    )
            )

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}