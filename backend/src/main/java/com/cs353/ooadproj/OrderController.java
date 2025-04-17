package com.cs353.ooadproj;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
public class OrderController {
    private final OrdersRepo ordersRepo;
    private final ShoppingCartRepo shoppingCartRepo;
    private final OrderCommandInvoker commandInvoker;
    private final UsersRepo usersRepo;
    private final ProductsRepository productsRepository;

    @Autowired
    public OrderController(OrdersRepo ordersRepo, ShoppingCartRepo shoppingCartRepo, OrderCommandInvoker commandInvoker, UsersRepo usersRepo, ProductsRepository productsRepository) {
        this.ordersRepo = ordersRepo;
        this.shoppingCartRepo = shoppingCartRepo;
        this.commandInvoker = commandInvoker;
        this.usersRepo = usersRepo;
        this.productsRepository = productsRepository;
    }

    @CrossOrigin()
    @GetMapping("/orders/{id}")
    List<Order> all(@PathVariable String id) {
        log.info("Getting order for user {}", id);
        List<Order> orders = new ArrayList<>();
        if (ordersRepo.findByUserId(id) != null) {
            orders = ordersRepo.findByUserId(id);
            return orders;
        } else {
            return orders;
        }
    }

    @CrossOrigin()
    @GetMapping("/orders/details/{orderId}")
    public Order getOrderById(@PathVariable String orderId) {
        log.info("Fetching order details for ID: {}", orderId);
        return ordersRepo.findById(orderId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Order not found with ID: " + orderId));
    }

    @CrossOrigin()
    @PostMapping("/orders/{cartId}")
    public Order placeOrder(@PathVariable String cartId, @RequestBody NewOrderReq orderReq) {
        log.info("Placing order for cart: {}", cartId);

        try {
            // Using command pattern
            PlaceOrderCommand command = new PlaceOrderCommand(
                cartId,
                orderReq.getAddress(),
                orderReq.getDeliveryDate(),
                ordersRepo,
                shoppingCartRepo
            );

            commandInvoker.executeCommand(command);
            Order result = command.getSavedOrder();
            
            if (result == null) {
                throw new RuntimeException("Order creation failed - order is null");
            }
            
            return result;
        } catch (Exception e) {
            log.error("Error placing order: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to place order: " + e.getMessage(), e);
        }
    }

    @CrossOrigin()
    @DeleteMapping("/orders/{orderId}")
    public List<Order> deleteOrder(@PathVariable String orderId) {
        log.info("Deleting order with id {}", orderId);
        Order order = ordersRepo.findById(orderId).get();
        ordersRepo.deleteById(orderId);
        return ordersRepo.findByUserId(order.getUserId());
    }
}
