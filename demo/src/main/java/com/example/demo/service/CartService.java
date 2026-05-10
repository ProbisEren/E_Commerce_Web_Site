package com.example.demo.service;

import com.example.demo.model.CartItem;
import com.example.demo.model.Product;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartItemRepository cartRepo;
    private final ProductRepository productRepo;

    public CartService(CartItemRepository cartRepo, ProductRepository productRepo) {
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
    }

    // Ürün ekleme
    public String addToCart(Long userId, Long productId, int quantity) {

        Optional<Product> productOpt = productRepo.findById(productId);

        if (productOpt.isEmpty()) {
            return "Ürün bulunamadı";
        }

        Product product = productOpt.get();

        if (quantity <= 0) {
            return "Quantity 0'dan büyük olmalı";
        }

        if (product.getStock() < quantity) {
            return "Yetersiz stok";
        }

        Optional<CartItem> existing =
                cartRepo.findByUserIdAndProductId(userId, productId);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartRepo.save(item);
        } else {
            CartItem item = new CartItem();
            item.setUserId(userId);
            item.setProductId(productId);
            item.setQuantity(quantity);
            cartRepo.save(item);
        }

        return "Sepete eklendi";
    }

    // Sepeti getir
    public List<CartItem> getCart(Long userId) {
        return cartRepo.findByUserId(userId);
    }

    // Ürün sil
    public String removeFromCart(Long id) {
        cartRepo.deleteById(id);
        return "Ürün silindi";
    }

    // quantity güncelle
    public String updateQuantity(Long id, int quantity) {

        if (quantity <= 0) {
            return "Quantity 0'dan büyük olmalı";
        }

        Optional<CartItem> itemOpt = cartRepo.findById(id);

        if (itemOpt.isEmpty()) {
            return "Sepet ürünü bulunamadı";
        }

        CartItem item = itemOpt.get();
        item.setQuantity(quantity);
        cartRepo.save(item);

        return "Güncellendi";
    }
}
