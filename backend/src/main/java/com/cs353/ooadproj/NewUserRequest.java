package com.cs353.ooadproj;

import lombok.Data;

@Data
public class NewUserRequest {
    private String username;
    private String password;
    private String email;
    private String role; // Can be "USER" or "ADMIN"
}
