package com.cs353.ooadproj.flyweight;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

/**
 * Factory that creates and manages product category flyweights
 */
@Component
public class ProductCategoryFactory {
    private final Map<String, ProductCategory> categories = new HashMap<>();
    
    /**
     * Get or create a category with the given parameters
     */
    public ProductCategory getProductCategory(String name, String description, String iconUrl) {
        String key = name.toLowerCase();
        
        if (!categories.containsKey(key)) {
            categories.put(key, new ProductCategory(name, description, iconUrl));
        }
        
        return categories.get(key);
    }
    
    /**
     * Get a category by name if it exists
     */
    public ProductCategory getCategory(String name) {
        return categories.get(name.toLowerCase());
    }
    
    /**
     * Get all available categories
     */
    public Map<String, ProductCategory> getAllCategories() {
        return new HashMap<>(categories); // Return a copy to maintain encapsulation
    }
}
