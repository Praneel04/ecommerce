package com.cs353.ooadproj.flyweight;

import lombok.Getter;

/**
 * Immutable flyweight object for product categories
 */
@Getter
public class ProductCategory {
    private final String name;
    private final String description;
    private final String iconUrl;
    
    public ProductCategory(String name, String description, String iconUrl) {
        this.name = name;
        this.description = description;
        this.iconUrl = iconUrl;
    }
}
