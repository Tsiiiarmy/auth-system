package auth_system_backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(
            String recipientEmail,
            String otp
    ) {

        try {

            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            true,
                            "UTF-8"
                    );

            helper.setFrom(fromEmail);
            helper.setTo(recipientEmail);
            helper.setSubject("Your Verification Code");

            String htmlContent =
                    """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport"
                              content="width=device-width, initial-scale=1.0">
                        <title>Verification Code</title>
                    </head>

                    <body style="
                        margin: 0;
                        padding: 0;
                        background-color: #f4f6f8;
                        font-family: Arial, Helvetica, sans-serif;
                    ">

                        <table width="100%"
                               cellpadding="0"
                               cellspacing="0"
                               style="padding: 40px 15px;">

                            <tr>
                                <td align="center">

                                    <table width="100%"
                                           cellpadding="0"
                                           cellspacing="0"
                                           style="
                                               max-width: 600px;
                                               background-color: #ffffff;
                                               border-radius: 12px;
                                               overflow: hidden;
                                               box-shadow:
                                                   0 4px 15px
                                                   rgba(0,0,0,0.08);
                                           ">

                                        <!-- Header -->
                                        <tr>
                                            <td style="
                                                background-color: #eb3e64;
                                                padding: 30px;
                                                text-align: center;
                                            ">

                                                <h1 style="
                                                    margin: 0;
                                                    color: #ffffff;
                                                    font-size: 26px;
                                                ">
                                                    Authentication System
                                                </h1>

                                            </td>
                                        </tr>

                                        <!-- Content -->
                                        <tr>
                                            <td style="
                                                padding: 40px 35px;
                                                color: #333333;
                                            ">

                                                <h2 style="
                                                    margin-top: 0;
                                                    font-size: 22px;
                                                    color: #111827;
                                                ">
                                                    Verify your account
                                                </h2>

                                                <p style="
                                                    font-size: 15px;
                                                    line-height: 1.6;
                                                ">
                                                    Hello,
                                                </p>

                                                <p style="
                                                    font-size: 15px;
                                                    line-height: 1.6;
                                                ">
                                                    We received a request that
                                                    requires verification.
                                                    Use the verification code
                                                    below to continue.
                                                </p>

                                                <!-- OTP -->
                                                <div style="
                                                    margin: 30px 0;
                                                    padding: 20px;
                                                    background-color: #f3f4f6;
                                                    border-radius: 10px;
                                                    text-align: center;
                                                ">

                                                    <p style="
                                                        margin: 0 0 10px 0;
                                                        color: #b42443;
                                                        font-size: 13px;
                                                        text-transform: uppercase;
                                                        letter-spacing: 1px;
                                                    ">
                                                        Verification Code
                                                    </p>

                                                    <div style="
                                                        font-size: 36px;
                                                        font-weight: bold;
                                                        letter-spacing: 8px;
                                                        color: #eb2525;
                                                    ">
                                                        {{OTP}}
                                                    </div>

                                                </div>

                                                <p style="
                                                    font-size: 14px;
                                                    line-height: 1.6;
                                                    color: #555555;
                                                ">
                                                    This code will expire in
                                                    <strong>5 minutes</strong>.
                                                    Please do not share this
                                                    code with anyone.
                                                </p>

                                                <div style="
                                                    margin-top: 25px;
                                                    padding: 15px;
                                                    background-color: #fff7ed;
                                                    border-left: 4px solid #f97316;
                                                    border-radius: 4px;
                                                ">

                                                    <p style="
                                                        margin: 0;
                                                        font-size: 13px;
                                                        line-height: 1.5;
                                                        color: #7c2d12;
                                                    ">
                                                        <strong>Security notice:</strong>
                                                        If you did not request
                                                        this code, you can safely
                                                        ignore this email.
                                                    </p>

                                                </div>

                                            </td>
                                        </tr>

                                        <!-- Footer -->
                                        <tr>
                                            <td style="
                                                padding: 20px 35px;
                                                background-color: #f9fafb;
                                                text-align: center;
                                                border-top: 1px solid #eeeeee;
                                            ">

                                                <p style="
                                                    margin: 0;
                                                    font-size: 12px;
                                                    color: #9ca3af;
                                                ">
                                                    This is an automated message.
                                                    Please do not reply to this email.
                                                </p>

                                                <p style="
                                                    margin: 8px 0 0 0;
                                                    font-size: 12px;
                                                    color: #9ca3af;
                                                ">
                                                    © 2026 Authentication System
                                                </p>

                                            </td>
                                        </tr>

                                    </table>

                                </td>
                            </tr>

                        </table>

                    </body>
                    </html>
                    """
                     .replace("{{OTP}}", otp);

            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException exception) {

            throw new IllegalStateException(
                    "Failed to send verification email",
                    exception
            );
        }
    }
}