function OrdersModal({ isOrdersOpen, setIsOrdersOpen, orders }) {
  if (!isOrdersOpen) return null;

  return (
    <div style={overlay}>
      <div style={box}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Siparişlerim</h2>
          <button onClick={() => setIsOrdersOpen(false)}>×</button>
        </div>

        {orders.length === 0 ? (
          <p>Henüz siparişiniz yok.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} style={orderCard}>
              <h3>Sipariş #{index + 1}</h3>
              <p>
                <strong>Tarih:</strong> {order.date}
              </p>
              <p>
                <strong>Kullanıcı:</strong> {order.userEmail}
              </p>
              <p>
                <strong>Telefon:</strong> {order.phone}
              </p>
              <p>
                <strong>Adres:</strong> {order.address}
              </p>
              <p>
                <strong>Toplam:</strong> {order.totalPrice} TL
              </p>

              <hr />

              {order.items.map((item) => (
                <p key={item.id}>
                  {item.name} x {item.quantity}
                </p>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const box = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "14px",
  width: "650px",
  maxHeight: "85vh",
  overflowY: "auto",
};

const orderCard = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "15px",
  marginBottom: "12px",
};

export default OrdersModal;
