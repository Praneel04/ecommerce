package com.cs353.ooadproj;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
public class UserController {
    private final UserServiceFacade userServiceFacade;

    public UserController(UserServiceFacade userServiceFacade) {
        this.userServiceFacade = userServiceFacade;
    }

    @CrossOrigin()
    @GetMapping("/users")
    public List<User> getUsers() {
        log.info("Getting all users");
        return userServiceFacade.getAllUsers();
    }

    @CrossOrigin()
    @GetMapping("/users/{id}")
    public User getUser(@PathVariable String id) {
        log.info("Getting user #{}", id);
        return userServiceFacade.getUserById(id);
    }

    @CrossOrigin()
    @PostMapping("/users")
    public User addUser(@RequestBody NewUserRequest user) {
        log.info("Adding user to database with request: {}", user);
        return userServiceFacade.registerUser(user);
    }

    @CrossOrigin()
    @PostMapping("/login")
    public User login(@RequestBody LoginRequest user) {
        log.info("Authenticating user: {}", user.getUsername());
        return userServiceFacade.authenticateUser(user);
    }

    @CrossOrigin()
    @GetMapping("/users/{userId}/role")
    public Map<String, Object> getUserRole(@PathVariable String userId) {
        log.info("Getting role for user #{}", userId);
        return userServiceFacade.getUserRole(userId);
    }
}
