package auth_system_backend.service;

import auth_system_backend.entity.Permission;
import auth_system_backend.entity.Role;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");

        System.out.println(
                "========================================"
        );

        System.out.println(
                "REQUEST: "
                        + request.getMethod()
                        + " "
                        + request.getRequestURI()
        );

        // No Authorization header
        if (authorizationHeader == null) {

            System.out.println(
                    "JWT: NO AUTHORIZATION HEADER"
            );

            filterChain.doFilter(request, response);
            return;
        }

        // Wrong Authorization format
        if (!authorizationHeader.startsWith("Bearer ")) {

            System.out.println(
                    "JWT: INVALID AUTHORIZATION FORMAT"
            );

            filterChain.doFilter(request, response);
            return;
        }

        String token =
                authorizationHeader.substring(7);

        System.out.println(
                "JWT: Authorization header received"
        );

        // Token invalid
        if (!jwtService.isTokenValid(token)) {

            System.out.println(
                    "JWT: TOKEN INVALID OR EXPIRED"
            );

            filterChain.doFilter(request, response);
            return;
        }

        // Token valid
        String email =
                jwtService.extractEmail(token);

        Role role =
                jwtService.extractRole(token);

        System.out.println(
                "JWT: TOKEN VALID"
        );

        System.out.println(
                "JWT USER: " + email
        );

        System.out.println(
                "JWT ROLE: " + role
        );

        List<SimpleGrantedAuthority> authorities =
                new ArrayList<>();


        // =========================
        // ROLE
        // =========================

        authorities.add(
                new SimpleGrantedAuthority(
                        "ROLE_" + role.name()
                )
        );


        // =========================
        // PERMISSIONS
        // =========================

        switch (role) {

            case ADMIN -> {

                authorities.add(
                        new SimpleGrantedAuthority(
                                Permission.VIEW_USERS.name()
                        )
                );

                authorities.add(
                        new SimpleGrantedAuthority(
                                Permission.CREATE_USERS.name()
                        )
                );

                authorities.add(
                        new SimpleGrantedAuthority(
                                Permission.EDIT_USERS.name()
                        )
                );

                authorities.add(
                        new SimpleGrantedAuthority(
                                Permission.DELETE_USERS.name()
                        )
                );

                authorities.add(
                        new SimpleGrantedAuthority(
                                Permission.MANAGE_ROLES.name()
                        )
                );
            }

            case MANAGER -> {

                authorities.add(
                        new SimpleGrantedAuthority(
                                Permission.VIEW_USERS.name()
                        )
                );

                authorities.add(
                        new SimpleGrantedAuthority(
                                Permission.EDIT_USERS.name()
                        )
                );
            }

            case USER -> {
                // Normal USER has no user-management permissions
            }
        }


        System.out.println(
                "JWT AUTHORITIES: " + authorities
        );


        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        authorities
                );

        SecurityContextHolder
                .getContext()
                .setAuthentication(authentication);


        System.out.println(
                "SECURITY CONTEXT USER: "
                        + SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName()
        );

        System.out.println(
                "SECURITY CONTEXT AUTHORITIES: "
                        + SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getAuthorities()
        );


        System.out.println(
                "========================================"
        );


        filterChain.doFilter(request, response);
    }
}