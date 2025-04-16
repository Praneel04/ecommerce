package com.cs353.ooadproj;

import lombok.Data;

@Data
public class Review {
    private String userId;
    private String username;
    private String reviewBody;
    private int rating;
    private String date = java.time.LocalDateTime.now().toString();
}
