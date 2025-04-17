package com.cs353.ooadproj.util;

import com.cs353.ooadproj.Product;
import com.cs353.ooadproj.Review;
import com.cs353.ooadproj.iterator.ReviewIterator;

import java.util.ArrayList;
import java.util.List;

/**
 * Utility class for working with product reviews
 */
public class ReviewUtils {
    
    /**
     * Get an iterator for a product's reviews
     */
    public static ReviewIterator getReviewIterator(Product product) {
        return new ReviewIterator(product.getReviews() != null ? product.getReviews() : new ArrayList<>());
    }
    
    /**
     * Get reviews sorted by rating (high to low)
     */
    public static List<Review> getReviewsSortedByRating(Product product) {
        List<Review> sortedReviews = new ArrayList<>(product.getReviews());
        sortedReviews.sort((r1, r2) -> Integer.compare(r2.getRating(), r1.getRating()));
        return sortedReviews;
    }
    
    /**
     * Calculate the average rating for a product
     */
    public static double getAverageRating(Product product) {
        if (product.getReviews() == null || product.getReviews().isEmpty()) {
            return 0.0;
        }
        
        ReviewIterator iterator = getReviewIterator(product);
        int sum = 0;
        int count = 0;
        
        while (iterator.hasNext()) {
            sum += iterator.next().getRating();
            count++;
        }
        
        return (double) sum / count;
    }
}
