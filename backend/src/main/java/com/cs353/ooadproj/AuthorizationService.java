package com.cs353.ooadproj;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuthorizationService {
    private final UsersRepo usersRepo;
    
    @Autowired
    public AuthorizationService(UsersRepo usersRepo) {
        this.usersRepo = usersRepo;
    }
    
    /**
     * Check if a user is an admin
     */
    public boolean isAdmin(String userId) {
        log.info("Checking if user {} is an admin", userId);
        User user = usersRepo.findById(userId).orElse(null);
        if (user == null) {
            log.warn("User not found: {}", userId);
            return false;
        }
        
        boolean isAdmin = "ADMIN".equals(user.getRole());
        log.info("User {} admin status: {}", userId, isAdmin);
        return isAdmin;
    }
}
