package com.cs353.ooadproj;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * Iterator for reviews
 * Demonstrates the Iterator pattern for sequentially accessing product reviews
 */
public class ReviewIterator implements java.util.Iterator<Review> {
    private final List<Review> reviews;
    private int position = 0;
    
    public ReviewIterator(List<Review> reviews) {
        this.reviews = reviews;
    }
    
    @Override
    public boolean hasNext() {
        return position < reviews.size();
    }
    
    @Override
    public Review next() {
        if (!hasNext()) {
            throw new NoSuchElementException("No more reviews");
        }
        return reviews.get(position++);
    }
}
