package com.cs353.ooadproj;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
public class ProductController {
    private final ProductsRepository productRepo;
    private final AuthorizationService authService;

    public ProductController(ProductsRepository productRepo, AuthorizationService authService) {
        this.productRepo = productRepo;
        this.authService = authService;
    }

    @CrossOrigin
    @GetMapping("/products")
    public List<Product> getAllProducts() {
        log.info("Getting all products");
        return productRepo.findAll();
    }

    @CrossOrigin
    @GetMapping("/products/{id}")
    public Product getProduct(@PathVariable String id) {
        log.info("Getting product #{}", id);
        return productRepo.findById(id).orElse(null);
    }

    @CrossOrigin
    @PostMapping("/products")
    public Product addProduct(@RequestBody Product product, @RequestParam String userId) {
        authService.validateAdminAccess(userId);
        log.info("Adding product: {}", product.getTitle());
        return productRepo.save(product);
    }

    @CrossOrigin
    @DeleteMapping("/products/{id}")
    public Map<String, Object> deleteProduct(@PathVariable String id, @RequestParam String userId) {
        authService.validateAdminAccess(userId);
        log.info("Deleting product #{}", id);
        productRepo.deleteById(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("id", id);
        return response;
    }

    @CrossOrigin
    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable String id, @RequestBody Product product, @RequestParam String userId) {
        authService.validateAdminAccess(userId);
        log.info("Updating product #{}", id);

        product.setId(id);  // Ensure the ID is set correctly
        return productRepo.save(product);
    }

    @CrossOrigin
    @PostMapping("/products/{id}/review")
    public Product addProductReview(@PathVariable String id, @RequestBody Review review) {
        log.info("Adding review to product #{}", id);
        Product product = productRepo.findById(id).orElse(null);
        
        if (product == null) {
            log.warn("Product not found: {}", id);
            return null;
        }
        
        // Add review to the product's reviews list
        if (product.getReviews() == null) {
            product.setReviews(List.of(review));
        } else {
            product.getReviews().add(review);
        }
        
        return productRepo.save(product);
    }
}
