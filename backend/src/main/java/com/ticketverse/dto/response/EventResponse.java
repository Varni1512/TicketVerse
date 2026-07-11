package com.ticketverse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String venue;
    private String city;
    private LocalDate eventDate;
    private LocalTime startTime;
    private String imageUrl;
    private String status;
    private LocalDateTime createdAt;
}
