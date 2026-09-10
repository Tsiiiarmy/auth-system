package auth_system_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class SmsService {

    private final RestClient restClient;

    @Value("${afromessage.token}")
    private String token;

    @Value("${afromessage.identifier-id}")
    private String identifierId;

    @Value("${afromessage.sender-name}")
    private String senderName;

    public SmsService(
            @Value("${afromessage.base-url}") String baseUrl
    ) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

public void sendOtpSms(
        String phoneNumber,
        String otp
) {

    String message =
            "Your verification code is: " + otp +
            ". This code will expire in 5 minutes.";

    Map<String, String> requestBody = Map.of(
            "from", identifierId,
            "sender", senderName,
            "to", phoneNumber,
            "message", message
    );

    try {

        String response = restClient.post()
                .uri("/send")
                .header(
                        "Authorization",
                        "Bearer " + token
                )
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(String.class);

        System.out.println("========== AFROMESSAGE RESPONSE ==========");
        System.out.println(response);
        System.out.println("==========================================");

    } catch (Exception e) {

        System.out.println("========== AFROMESSAGE ERROR =============");
        System.out.println(e.getMessage());
        System.out.println("==========================================");

        throw new RuntimeException(
                "Failed to send SMS: " + e.getMessage(),
                e
        );
    }
}
}