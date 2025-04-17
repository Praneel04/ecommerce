package com.cs353.ooadproj;

import lombok.extern.slf4j.Slf4j;
import java.time.LocalDateTime;
import java.util.ArrayList;

/**
 * Command implementation for placing an order
 * Part of the Command pattern implementation
 */
@Slf4j
public class PlaceOrderCommand implements OrderCommand {
    private final String cartId;
    private final String address;
    private final String deliveryDate;
    private final OrdersRepo ordersRepo;
    private final ShoppingCartRepo cartRepo;
    private Order savedOrder;
    private ShoppingCart originalCart;
    
    public PlaceOrderCommand(String cartId, String address, String deliveryDate,
                          OrdersRepo ordersRepo, ShoppingCartRepo cartRepo) {
        this.cartId = cartId;
        this.address = address;
        this.deliveryDate = deliveryDate;
        this.ordersRepo = ordersRepo;
        this.cartRepo = cartRepo;
    }
    
    @Override
    public void execute() {
        try {
            // Find the cart
            ShoppingCart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with ID: " + cartId));
            
            if (cart.getLineItems() == null || cart.getLineItems().isEmpty()) {
                throw new RuntimeException("Cannot place order with empty cart");
            }
            
            // Store original state for potential undo
            originalCart = new ShoppingCart();
            originalCart.setId(cart.getId());
            originalCart.setUserId(cart.getUserId());
            originalCart.setLineItems(new ArrayList<>(cart.getLineItems()));
            originalCart.setTotalCost(cart.getTotalCost());
            
            // Create order
            Order order = new Order();
            order.setUserId(cart.getUserId());
            order.setLineItems(new ArrayList<>(cart.getLineItems())); // Create new ArrayList to avoid reference issues
            order.setTotalCost(cart.getTotalCost());
            order.setAddress(address);
            order.setDeliveryDate(deliveryDate);
            order.setOrderDate(LocalDateTime.now().toString());
            
            // Save order and update cart
            savedOrder = ordersRepo.save(order);
            log.info("Order created successfully with ID: {}", savedOrder.getId());
            
            // Clear cart items but keep the cart
            cart.getLineItems().clear();
            cart.setTotalCost(0.0);
            cartRepo.save(cart);
            
        } catch (Exception e) {
            log.error("Failed to place order: {}", e.getMessage(), e);
            throw new RuntimeException("Order placement failed: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void undo() {
        if (savedOrder != null) {
            ordersRepo.deleteById(savedOrder.getId());
            
            if (originalCart != null) {
                ShoppingCart currentCart = cartRepo.findById(cartId).orElse(null);
                if (currentCart != null) {
                    currentCart.setLineItems(originalCart.getLineItems());
                    currentCart.setTotalCost(originalCart.getTotalCost());
                    cartRepo.save(currentCart);
                }
            }
        }
    }
    
    public Order getSavedOrder() {
        return savedOrder;
    }
}
