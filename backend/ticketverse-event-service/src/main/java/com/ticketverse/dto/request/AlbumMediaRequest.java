package com.ticketverse.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AlbumMediaRequest {

    @NotBlank(message = "Media URL is required")
    private String mediaUrl;

    @NotBlank(message = "Media type is required (IMAGE or VIDEO)")
    private String mediaType;
}
