function ProductCard({ product, addToCart, openProductDetail }) {
  return (
    <div
      onClick={() => openProductDetail(product)}
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: "16px",
        padding: "16px",
        backgroundColor: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "0.3s",
      }}
    >
      {/* Product Image */}
      <div
        style={{
          width: "100%",
          height: "250px",
          backgroundColor: "#f8f8f8",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Product Info */}
      <div style={{ marginTop: "15px" }}>
        <h3
          style={{
            fontSize: "20px",
            marginBottom: "8px",
            color: "#222",
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            fontSize: "26px",
            fontWeight: "bold",
            color: "#f26b00",
            marginBottom: "15px",
          }}
        >
          {product.price} TL
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProductDetail(product);
            }}
            style={{
              flex: 1,
              padding: "12px",
              border: "1px solid #f26b00",
              backgroundColor: "white",
              color: "#f26b00",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Detay
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            disabled={product.stock === 0}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              backgroundColor: product.stock === 0 ? "gray" : "#f26b00",
              color: "white",
              borderRadius: "10px",
              cursor: product.stock === 0 ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {product.stock === 0 ? "Stokta Yok" : "Sepete Ekle"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
