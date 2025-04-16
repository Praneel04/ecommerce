package com.cs353.ooadproj;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@Slf4j
public class UserController {
    private final UsersRepo usersRepo;

    public UserController(UsersRepo usersRepo) {
        this.usersRepo = usersRepo;
    }

    @CrossOrigin()
    @GetMapping("/users")//Retrieve Products
    public List<User> getUsers() {
        log.info("Getting all products");
        return usersRepo.findAll();
    }

    @CrossOrigin()
    @GetMapping("/users/{id}")//View single product
    public User getUser(@PathVariable String id) {
        log.info("Getting user #{}",id);
        return usersRepo.findById(id).get();
    }

    @CrossOrigin()
    @PostMapping("/users")
    public User addUser(@RequestBody NewUserRequest user) {
        log.info("Adding user to database with request: {}", user);
        PasswordAuthentication passwordAuthentication = new PasswordAuthentication();
        String passHash = passwordAuthentication.hash(user.getPassword());
        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setUsername(user.getUsername());
        newUser.setPasshash(passHash);
        
        // Explicitly handle the role field
        String role = user.getRole();
        log.info("Role from request: {}", role);
        
        if (role != null && ("ADMIN".equals(role) || "admin".equals(role))) {
            newUser.setRole("ADMIN");
            log.info("Setting user role to ADMIN");
        } else {
            newUser.setRole("USER");
            log.info("Setting user role to USER (default)");
        }
        
        User savedUser = usersRepo.save(newUser);
        log.info("Saved user with ID: {} and role: {}", savedUser.getId(), savedUser.getRole());
        return savedUser;
    }

    @CrossOrigin()
    @PostMapping("/login")
    public User login(@RequestBody LoginRequest user) {
        log.info("Authenticating user: {}", user.getUsername());
        PasswordAuthentication passwordAuthentication = new PasswordAuthentication();
        User dbUser = usersRepo.findByUsername(user.getUsername());
        
        if (dbUser == null) {
            log.warn("User not found: {}", user.getUsername());
            throw new UserInvalidException(user.getUsername());
        }
        
        log.info("Found user in database. Role: {}", dbUser.getRole());
        Boolean valid = passwordAuthentication.authenticate(user.getPassword(), dbUser.getPasshash());
        if(valid){
            log.info("Authentication successful. Returning user with role: {}", dbUser.getRole());
            return dbUser;
        } else {
            log.warn("Invalid password for user: {}", user.getUsername());
            throw new UserInvalidException(user.getUsername());
        }
    }

    @CrossOrigin()
    @GetMapping("/users/{userId}/role")
    public Map<String, Object> getUserRole(@PathVariable String userId) {
        log.info("Getting role for user #{}", userId);
        User user = usersRepo.findById(userId).orElse(null);
        
        Map<String, Object> response = new HashMap<>();
        if (user != null) {
            log.info("Found user: {}. Role: {}", user.getUsername(), user.getRole());
            response.put("userId", user.getId());
            response.put("role", user.getRole());
            response.put("isAdmin", "ADMIN".equals(user.getRole()));
        } else {
            log.info("User not found with ID: {}", userId);
            response.put("userId", userId);
            response.put("isAdmin", false);
        }
        
        log.info("Returning response: {}", response);
        return response;
    }
}
