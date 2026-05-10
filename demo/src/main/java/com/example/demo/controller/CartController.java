package com.example.demo.controller;

import com.example.demo.model.CartItem;
import com.example.demo.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // ürün ekle
    @PostMapping("/add")
    public String add(@RequestParam Long userId,
                      @RequestParam Long productId,
                      @RequestParam int quantity) {
        return cartService.addToCart(userId, productId, quantity);
    }

    // sepet getir
    @GetMapping
    public List<CartItem> getCart(@RequestParam Long userId) {
        return cartService.getCart(userId);
    }

    // sil
    @DeleteMapping("/remove/{id}")
    public String remove(@PathVariable Long id) {
        return cartService.removeFromCart(id);
    }

    // güncelle
    @PutMapping("/update/{id}")
    public String update(@PathVariable Long id,
                         @RequestParam int quantity) {
        return cartService.updateQuantity(id, quantity);
    }
}
