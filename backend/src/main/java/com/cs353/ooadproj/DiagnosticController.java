package com.cs353.ooadproj;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for diagnostic endpoints to help troubleshoot issues
 */
@RestController
@Slf4j
public class DiagnosticController {

    private final ShoppingCartRepo shoppingCartRepo;
    
    @Autowired
    public DiagnosticController(ShoppingCartRepo shoppingCartRepo) {
        this.shoppingCartRepo = shoppingCartRepo;
    }
    
    @CrossOrigin()
    @GetMapping("/diagnostic/cart/{id}")
    public ResponseEntity<Map<String, Object>> checkCart(@PathVariable String id) {
        log.info("Diagnostic: Checking cart with ID: {}", id);
        Map<String, Object> result = new HashMap<>();
        
        try {
            var cart = shoppingCartRepo.findById(id);
            if (cart.isPresent()) {
                ShoppingCart c = cart.get();
                result.put("found", true);
                result.put("userId", c.getUserId());
                result.put("itemCount", c.getLineItems() != null ? c.getLineItems().size() : 0);
                result.put("totalCost", c.getTotalCost());
            } else {
                result.put("found", false);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("error", e.getMessage());
            log.error("Error checking cart: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(result);
        }
    }
}
