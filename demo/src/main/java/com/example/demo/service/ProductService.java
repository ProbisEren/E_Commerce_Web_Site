package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Ürün ekleme
    public String addProduct(Product product) {

        if (product.getName() == null || product.getName().trim().isEmpty()) {
            return "Ürün adı boş olamaz";
        }

        if (product.getPrice() <= 0) {
            return "Fiyat 0'dan büyük olmalı";
        }

        if (product.getStock() < 0) {
            return "Stok negatif olamaz";
        }

        productRepository.save(product);
        return "Ürün eklendi";
    }

    // Tüm ürünleri getir
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // ID ile ürün getir
    public Product getProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.orElse(null);
    }

// stok azalt
public Product decreaseStock(Long id, int quantity) {
    Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

    if (quantity <= 0) {
        throw new RuntimeException("Geçersiz adet");
    }

    if (product.getStock() < quantity) {
        throw new RuntimeException("Yeterli stok yok");
    }

    product.setStock(product.getStock() - quantity);

    return productRepository.save(product);
}

}
