package com.example.demo.service;

import com.example.demo.model.CartItem;
import com.example.demo.model.Order;
import com.example.demo.model.Payment;
import com.example.demo.model.Product;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final CartItemRepository cartRepo;
    private final ProductRepository productRepo;
    private final OrderRepository orderRepo;

    public OrderService(CartItemRepository cartRepo,
                        ProductRepository productRepo,
                        OrderRepository orderRepo) {
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
        this.orderRepo = orderRepo;
    }

    public String checkout(Long userId, Payment payment) {

        // 🔴 1. Payment validation
        if (payment.getCardNumber() == null || payment.getCardNumber().length() != 16) {
            return "Kart numarası hatalı";
        }

        if (payment.getCvv() == null || payment.getCvv().length() != 3) {
            return "CVV hatalı";
        }

        if (payment.getExpiryDate() == null || payment.getExpiryDate().trim().isEmpty()) {
            return "Expiry boş olamaz";
        }

        // 🔴 2. Cart kontrol
        List<CartItem> cart = cartRepo.findByUserId(userId);

        if (cart.isEmpty()) {
            return "Sepet boş";
        }

        double total = 0;

        for (CartItem item : cart) {
            Product product = productRepo.findById(item.getProductId()).orElse(null);

            if (product == null) {
                return "Ürün bulunamadı";
            }

            if (product.getStock() < item.getQuantity()) {
                return "Stok yetersiz";
            }

            total += product.getPrice() * item.getQuantity();

            // stok düş
            product.setStock(product.getStock() - item.getQuantity());
            productRepo.save(product);
        }

        // 🔴 3. Order oluştur
        Order order = new Order();
        order.setUserId(userId);
        order.setTotalPrice(total);

        orderRepo.save(order);

        // 🔴 4. Cart temizle
        cartRepo.deleteAll(cart);

        return "Sipariş oluşturuldu";
    }

    public List<Order> getOrders(Long userId) {
        return orderRepo.findByUserId(userId);
    }
}
