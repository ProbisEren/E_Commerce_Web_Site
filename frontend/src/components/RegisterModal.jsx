import { useState } from "react";

function RegisterModal({ isRegisterOpen, setIsRegisterOpen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isRegisterOpen) return null;

  const handleRegister = (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      alert("Geçerli bir email giriniz");
      return;
    }

    if (password.length < 6) {
      alert("Şifre en az 6 karakter olmalı");
      return;
    }

    alert("Kayıt başarılı");
    setIsRegisterOpen(false);
  };

  return (
    <div style={modalBg}>
      <form onSubmit={handleRegister} style={modalBox}>
        <h2>Kayıt Ol</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button type="submit">Kayıt Ol</button>
        <button type="button" onClick={() => setIsRegisterOpen(false)}>
          Kapat
        </button>
      </form>
    </div>
  );
}

const modalBg = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalBox = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "12px",
  width: "350px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

export default RegisterModal;
