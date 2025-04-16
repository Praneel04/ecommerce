package com.cs353.ooadproj;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthorizationService {

    private final UsersRepo usersRepo;

    public AuthorizationService(UsersRepo usersRepo) {
        this.usersRepo = usersRepo;
    }

    public void validateAdminAccess(String userId) {
        User user = usersRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found"));
                
        if (!"ADMIN".equals(user.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Admin access required");
        }
    }
}
