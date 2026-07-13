package com.ticketverse.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final JavaMailSender mailSender;
    
    // Store OTPs temporarily. Key: email, Value: OTP
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public void generateAndSendOtp(String email) {
        String otp = generateOtp();
        otpStorage.put(email, otp);
        
        // Schedule to remove OTP after 5 minutes
        scheduler.schedule(() -> otpStorage.remove(email), 5, TimeUnit.MINUTES);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your TicketVerse Checkout Verification Code");
            message.setText("Your OTP for booking confirmation is: " + otp + "\nThis code will expire in 5 minutes.");
            
            mailSender.send(message);
            log.info("OTP sent to email: {}", email);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}. Error: {}", email, e.getMessage());
            // Optionally, we could still log the OTP for local dev testing if email fails
            log.info("Fallback (Mock) OTP for {}: {}", email, otp);
        }
    }

    public boolean verifyOtp(String email, String inputOtp) {
        if (inputOtp == null || email == null) return false;
        
        String storedOtp = otpStorage.get(email);
        if (storedOtp != null && storedOtp.equals(inputOtp)) {
            otpStorage.remove(email); // consume OTP
            return true;
        }
        return false;
    }

    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // 6-digit OTP
        return String.valueOf(otp);
    }
}
