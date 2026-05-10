import { useState } from "react";
import API from "../services/api";

function LoginModal({
  isLoginOpen,
  setIsLoginOpen,
  setUser,
  setProfile,
  emptyProfile,
  setOrders,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isLoginOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      alert("Geçerli bir email giriniz");
      return;
    }

    if (password.length < 6) {
      alert("Şifre en az 6 karakter olmalı");
      return;
    }

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      if (response.data === "Giriş başarılı") {
        const savedProfile = localStorage.getItem(`profile_${email}`);
        const savedOrders = localStorage.getItem(`orders_${email}`);

        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        } else {
          setProfile(emptyProfile);
        }

        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        } else {
          setOrders([]);
        }

        setUser({ email });

        alert("Giriş başarılı");
        setIsLoginOpen(false);

        setEmail("");
        setPassword("");
      } else {
        alert(response.data);
      }
    } catch (error) {
      alert("Giriş sırasında hata oluştu");
      console.log(error);
    }
  };

  return (
    <div style={modalBg}>
      <form onSubmit={handleLogin} style={modalBox}>
        <h2>Giriş Yap</h2>

        <input
          type="email"
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

        <button type="submit" style={loginBtn}>
          Giriş Yap
        </button>

        <button
          type="button"
          onClick={() => setIsLoginOpen(false)}
          style={closeBtn}
        >
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
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const loginBtn = {
  padding: "12px",
  backgroundColor: "#ff7a00",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const closeBtn = {
  padding: "12px",
  backgroundColor: "#ddd",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default LoginModal;
