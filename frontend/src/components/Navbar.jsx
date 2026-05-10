function Navbar({
  totalQuantity,
  setIsCartOpen,
  setIsLoginOpen,
  setIsRegisterOpen,
  user,
  setUser,
  profile = {},
  setIsOrdersOpen,
  setIsAccountOpen,
  searchText,
  setSearchText,
}) {
  return (
    <div
      style={{
        height: "75px",
        backgroundColor: "#111",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
      }}
    >
      <h2 style={{ cursor: "pointer" }}>E-Commerce</h2>
      <input
        placeholder="Ürün ara..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{
          width: "320px",
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          outline: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        {!user ? (
          <>
            <button style={buttonStyle} onClick={() => setIsLoginOpen(true)}>
              Giriş Yap
            </button>

            <button style={buttonStyle} onClick={() => setIsRegisterOpen(true)}>
              Kayıt Ol
            </button>
          </>
        ) : (
          <>
            <span
              style={{
                fontWeight: "bold",
                color: "#ff7a00",
              }}
            >
              Merhaba, {profile?.name ? profile.name : user.email}
            </span>

            <button style={buttonStyle} onClick={() => setIsAccountOpen(true)}>
              Hesabım
            </button>

            <button style={buttonStyle} onClick={() => setIsOrdersOpen(true)}>
              Siparişlerim
            </button>

            <button style={logoutButton} onClick={() => setUser(null)}>
              Çıkış Yap
            </button>
          </>
        )}

        <button style={cartButton} onClick={() => setIsCartOpen(true)}>
          Sepet ({totalQuantity})
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 14px",
  backgroundColor: "white",
  color: "black",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const logoutButton = {
  padding: "10px 14px",
  backgroundColor: "#ff4d4d",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const cartButton = {
  padding: "10px 14px",
  backgroundColor: "#ff7a00",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Navbar;
