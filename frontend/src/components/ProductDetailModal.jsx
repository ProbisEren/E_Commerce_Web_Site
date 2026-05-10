function ProductDetailModal({
  selectedProduct,
  setSelectedProduct,
  addToCart,
  setIsCartOpen,
}) {
  if (!selectedProduct) return null;

  const handleBuyNow = () => {
    addToCart(selectedProduct);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct);
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <button onClick={() => setSelectedProduct(null)} style={closeButton}>
          ×
        </button>

        <div style={imageArea}>
          <img
            src={selectedProduct.imageUrl}
            alt={selectedProduct.name}
            style={image}
          />
        </div>

        <div style={infoArea}>
          <h3 style={categoryText}>{selectedProduct.category} kategorisinde</h3>

          <h1 style={title}>{selectedProduct.name}</h1>

          <p style={description}>{selectedProduct.description}</p>

          <h2 style={price}>{selectedProduct.price} TL</h2>

          <hr />

          <p style={categoryLine}>
            <strong>Kategori:</strong> {selectedProduct.category}
          </p>

          <div style={buttonRow}>
            <button onClick={handleBuyNow} style={buyButton}>
              Şimdi Al
            </button>

            <button
              onClick={handleAddToCart}
              style={cartButton}
              disabled={selectedProduct.stock === 0}
            >
              {selectedProduct.stock === 0 ? "Stok Yok" : "Sepete Ekle"}
            </button>
          </div>

          <div style={infoBox}>
            <p>🚚 Hızlı Teslimat</p>
            <p>🔒 Güvenli Ödeme</p>
            <p>↩️ Kolay İade</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.55)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modal = {
  position: "relative",
  width: "1100px",
  maxWidth: "95%",
  backgroundColor: "white",
  borderRadius: "22px",
  padding: "35px",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "35px",
};

const closeButton = {
  position: "absolute",
  top: "18px",
  right: "18px",
  width: "45px",
  height: "45px",
  borderRadius: "50%",
  border: "none",
  fontSize: "28px",
  cursor: "pointer",
};

const imageArea = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const image = {
  width: "100%",
  maxHeight: "520px",
  objectFit: "contain",
};

const infoArea = {
  textAlign: "center",
};

const categoryText = {
  color: "#ff7a00",
  fontSize: "24px",
  marginBottom: "20px",
};

const title = {
  color: "#111",
  fontSize: "42px",
  fontWeight: "700",
  marginBottom: "20px",
};

const description = {
  color: "#555",
  fontSize: "22px",
  marginBottom: "15px",
};

const price = {
  color: "#ff6a00",
  fontSize: "42px",
  margin: "15px 0",
};

const categoryLine = {
  fontSize: "22px",
  color: "#777",
};

const buttonRow = {
  display: "flex",
  gap: "20px",
  marginTop: "35px",
};

const buyButton = {
  flex: 1,
  padding: "18px",
  borderRadius: "12px",
  border: "2px solid #ff6a00",
  backgroundColor: "white",
  color: "#ff6a00",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
};

const cartButton = {
  flex: 1,
  padding: "18px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#ff6a00",
  color: "white",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
};

const infoBox = {
  marginTop: "35px",
  backgroundColor: "#f5f5f5",
  borderRadius: "16px",
  padding: "20px",
  fontSize: "22px",
  color: "#777",
};

export default ProductDetailModal;
