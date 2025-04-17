package com.cs353.ooadproj;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Facade for user operations that simplifies the interface
 * for user-related functionality
 */
@Service
@Slf4j
public class UserServiceFacade {
    private final UsersRepo usersRepo;
    private final PasswordAuthentication passwordAuthentication;
    
    public UserServiceFacade(UsersRepo usersRepo) {
        this.usersRepo = usersRepo;
        this.passwordAuthentication = new PasswordAuthentication();
    }
    
    public List<User> getAllUsers() {
        log.info("Getting all users");
        return usersRepo.findAll();
    }
    
    public User getUserById(String id) {
        log.info("Getting user #{}", id);
        return usersRepo.findById(id).orElse(null);
    }
    
    public User registerUser(NewUserRequest userRequest) {
        log.info("Adding user to database with request: {}", userRequest);
        String passHash = passwordAuthentication.hash(userRequest.getPassword());
        
        User newUser = new User();
        newUser.setEmail(userRequest.getEmail());
        newUser.setUsername(userRequest.getUsername());
        newUser.setPasshash(passHash);
        
        // Handle role assignment
        String role = userRequest.getRole();
        if (role != null && ("ADMIN".equals(role) || "admin".equals(role))) {
            newUser.setRole("ADMIN");
        } else {
            newUser.setRole("USER");
        }
        
        return usersRepo.save(newUser);
    }
    
    public User authenticateUser(LoginRequest loginRequest) {
        log.info("Authenticating user: {}", loginRequest.getUsername());
        User dbUser = usersRepo.findByUsername(loginRequest.getUsername());
        
        if (dbUser == null) {
            log.warn("User not found: {}", loginRequest.getUsername());
            throw new RuntimeException("Invalid username or password");
        }
        
        Boolean valid = passwordAuthentication.authenticate(loginRequest.getPassword(), dbUser.getPasshash());
        if (valid) {
            return dbUser;
        } else {
            log.warn("Invalid password for user: {}", loginRequest.getUsername());
            throw new RuntimeException("Invalid username or password");
        }
    }
    
    public Map<String, Object> getUserRole(String userId) {
        User user = usersRepo.findById(userId).orElse(null);
        
        Map<String, Object> response = new HashMap<>();
        if (user != null) {
            response.put("userId", user.getId());
            response.put("role", user.getRole());
            response.put("isAdmin", "ADMIN".equals(user.getRole()));
        } else {
            response.put("userId", userId);
            response.put("isAdmin", false);
        }
        
        return response;
    }
}
