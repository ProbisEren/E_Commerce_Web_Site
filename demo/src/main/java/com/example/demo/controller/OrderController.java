package com.example.demo.controller;


import com.example.demo.model.Order;
import com.example.demo.model.Payment;
import com.example.demo.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // checkout + payment
    @PostMapping("/checkout")
    public String checkout(@RequestParam Long userId,
                           @RequestBody Payment payment) {
        return orderService.checkout(userId, payment);
    }

    // order listeleme
    @GetMapping
    public List<Order> getOrders(@RequestParam Long userId) {
        return orderService.getOrders(userId);
    }
}
