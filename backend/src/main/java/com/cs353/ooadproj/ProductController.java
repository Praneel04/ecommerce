package com.cs353.ooadproj;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@Slf4j
public class ProductController {
    
    // Using the proxy pattern instead of direct repository access
    private final ProductRepositoryProxy productRepo;
    private final UsersRepo usersRepo;
    private final AuthorizationService authorizationService;

    public ProductController(ProductRepositoryProxy productRepo, UsersRepo usersRepo, 
                            AuthorizationService authorizationService) {
        this.productRepo = productRepo;
        this.usersRepo = usersRepo;
        this.authorizationService = authorizationService;
    }

    @CrossOrigin()
    @GetMapping("/products")
    public List<Product> getProducts() {
        log.info("Getting products");
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
    public Product addProduct(@RequestBody Product product, @RequestParam("userId") String userId) {
        log.info("Adding product {} by {}", product, userId);
        
        if (authorizationService.isAdmin(userId)) {
            log.info("User is admin, adding product");
            
            // Ensure reviews is initialized
            if (product.getReviews() == null) {
                product.setReviews(new ArrayList<>());
            }
            
            return productRepo.save(product);
        } else {
            throw new IllegalArgumentException("Unauthorized!");
        }
    }

    @CrossOrigin()
    @PostMapping("/products/{id}/review")
    public Product reviewProduct(@PathVariable String id, @RequestBody Review review) {
        log.info("Adding Review {} to Product #{}", review, id);
        
        Optional<Product> optionalProduct = productRepo.findById(id);
        
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            
            if (product.getReviews() == null) {
                product.setReviews(new ArrayList<>());
            }
            
            product.getReviews().add(review);
            
            // Calculate average rating using the Iterator pattern
            double avgRating = ReviewUtils.getAverageRating(product);
            log.info("New average rating for product {}: {}", id, avgRating);
            
            return productRepo.save(product);
        } else {
            log.warn("Product not found: {}", id);
            throw new IllegalArgumentException("Product not found!");
        }
    }
    
    @CrossOrigin()
    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable String id, @RequestParam("userId") String userId) {
        log.info("Deleting Product #{} by User #{}", id, userId);
        
        if (authorizationService.isAdmin(userId)) {
            log.info("User is admin, proceeding with delete");
            productRepo.deleteById(id);
        } else {
            log.warn("User #{} attempted to delete product without authorization", userId);
            throw new IllegalArgumentException("Unauthorized!");
        }
    }

    @CrossOrigin()
    @GetMapping("/products/search")
    public List<Product> searchProducts(@RequestParam("query") String query) {
        log.info("Searching for products with query: {}", query);
        String searchQuery = query.toLowerCase();
        
        return productRepo.findAll().stream()
            .filter(product -> 
                (product.getTitle() != null && product.getTitle().toLowerCase().contains(searchQuery)) ||
                (product.getDescription() != null && product.getDescription().toLowerCase().contains(searchQuery)))
            .collect(Collectors.toList());
    }
    
    @CrossOrigin()
    @GetMapping("/products/category/{category}")
    public List<Product> getProductsByCategory(@PathVariable String category) {
        log.info("Getting products for category: {}", category);
        String categoryLower = category.toLowerCase();
        
        return productRepo.findAll().stream()
            .filter(product -> product.getTags() != null && 
                product.getTags().stream()
                    .anyMatch(tag -> tag.toLowerCase().equals(categoryLower)))
            .collect(Collectors.toList());
    }
}
