package com.cs353.ooadproj;

import java.util.List;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
public class Order {
    @Id
    private String id;
    private String userId;
    private List<LineItem> lineItems;
    private double totalCost;
    private String address;
    private String deliveryDate;
    private String orderDate;
    
    // Explicit setters to ensure they're available
    public void setId(String id) {
        this.id = id;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public void setLineItems(List<LineItem> lineItems) {
        this.lineItems = lineItems;
    }
    
    public void setTotalCost(double totalCost) {
        this.totalCost = totalCost;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public void setDeliveryDate(String deliveryDate) {
        this.deliveryDate = deliveryDate;
    }
    
    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }
}
