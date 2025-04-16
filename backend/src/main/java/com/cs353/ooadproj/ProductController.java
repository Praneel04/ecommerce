package com.cs353.ooadproj;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
public class ProductController {
    private final ProductRepo productRepo;
    private final AuthorizationService authService;

    public ProductController(ProductRepo productRepo, AuthorizationService authService) {
        this.productRepo = productRepo;
        this.authService = authService;
    }

    @CrossOrigin()
    @GetMapping("/products")
    public List<Product> getAllProducts() {
        log.info("Getting all products");
        return productRepo.findAll();
    }

    @CrossOrigin()
    @GetMapping("/products/{id}")
    public Product getProduct(@PathVariable String id) {
        log.info("Getting product #{}", id);
        return productRepo.findById(id).orElse(null);
    }

    @CrossOrigin()
    @PostMapping("/products")
    public Product addProduct(@RequestBody Product product, @RequestParam String userId) {
        // Validate that the user is an admin
        authService.validateAdminAccess(userId);
        
        log.info("Adding product: {}", product.getName());
        return productRepo.save(product);
    }

    @CrossOrigin()
    @DeleteMapping("/products/{id}")
    public Map<String, Object> deleteProduct(@PathVariable String id, @RequestParam String userId) {
        // Validate that the user is an admin
        authService.validateAdminAccess(userId);
        
        log.info("Deleting product #{}", id);
        productRepo.deleteById(id);
        
        // Return a response that the frontend can process
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("id", id);
        return response;
    }
    
    @CrossOrigin()
    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable String id, @RequestBody Product product, @RequestParam String userId) {
        // Validate that the user is an admin
        authService.validateAdminAccess(userId);
        
        log.info("Updating product #{}", id);



}    }        return productRepo.save(product);        product.setId(id);
        return productRepo.save(product);
    }
}
