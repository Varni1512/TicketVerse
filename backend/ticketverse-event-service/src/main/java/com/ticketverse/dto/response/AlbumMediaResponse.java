package com.ticketverse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AlbumMediaResponse {
    private Long id;
    private String mediaUrl;
    private String mediaType;
    private LocalDateTime createdAt;
}
