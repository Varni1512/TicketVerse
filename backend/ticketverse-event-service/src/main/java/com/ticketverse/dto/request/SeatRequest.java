package com.ticketverse.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SeatRequest {

    @NotBlank(message = "Row number is required")
    private String rowNum;

    @NotNull(message = "Seat number is required")
    private Integer seatNumber;

    @NotBlank(message = "Seat type is required")
    private String type;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private BigDecimal price;

    @NotBlank(message = "Status is required")
    private String status;
}
