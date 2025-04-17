package com.cs353.ooadproj;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 * A proxy for ProductsRepository that caches frequently accessed products
 * Demonstrates the Proxy pattern for caching
 */
@Component
@Slf4j
public class ProductRepositoryProxy {
    private final ProductsRepository productsRepository;
    private final Map<String, CachedProduct> cache = new HashMap<>();
    private List<Product> allProducts = null;
    private long allProductsTimestamp = 0;
    private static final long CACHE_EXPIRY_MS = TimeUnit.MINUTES.toMillis(10);
    
    private static class CachedProduct {
        final Product product;
        final long timestamp;
        
        CachedProduct(Product product) {
            this.product = product;
            this.timestamp = System.currentTimeMillis();
        }
        
        boolean isExpired() {
            return System.currentTimeMillis() - timestamp > CACHE_EXPIRY_MS;
        }
    }
    
    @Autowired
    public ProductRepositoryProxy(ProductsRepository productsRepository) {
        this.productsRepository = productsRepository;
    }
    
    public List<Product> findAll() {
        long now = System.currentTimeMillis();
        if (allProducts == null || now - allProductsTimestamp > CACHE_EXPIRY_MS) {
            log.info("Cache miss for all products");
            allProducts = productsRepository.findAll();
            allProductsTimestamp = now;
        } else {
            log.info("Serving all products from cache");
        }
        return allProducts;
    }
    
    public Optional<Product> findById(String id) {
        CachedProduct cachedProduct = cache.get(id);
        if (cachedProduct != null && !cachedProduct.isExpired()) {
            log.info("Cache hit for product ID: {}", id);
            return Optional.of(cachedProduct.product);
        }
        
        log.info("Cache miss for product ID: {}", id);
        Optional<Product> productOpt = productsRepository.findById(id);
        
        productOpt.ifPresent(product -> 
            cache.put(id, new CachedProduct(product))
        );
        
        return productOpt;
    }
    
    public Product save(Product product) {
        Product savedProduct = productsRepository.save(product);
        // Update cache
        cache.put(savedProduct.getId(), new CachedProduct(savedProduct));
        // Invalidate all products cache
        allProducts = null;
        return savedProduct;
    }
    
    public void deleteById(String id) {
        productsRepository.deleteById(id);
        cache.remove(id);
        allProducts = null;
    }
}
