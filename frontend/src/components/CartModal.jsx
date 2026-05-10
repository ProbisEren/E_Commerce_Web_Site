import { useState } from "react";

const addressData = {
  İstanbul: {
    Kadıköy: ["Moda", "Fenerbahçe", "Kozyatağı"],
    Beşiktaş: ["Levent", "Etiler", "Ortaköy"],
  },
  Ankara: {
    Çankaya: ["Kızılay", "Bahçelievler", "Ayrancı"],
    Keçiören: ["Etlik", "Aktepe", "Sanatoryum"],
  },
  İzmir: {
    Konak: ["Alsancak", "Güzelyalı", "Hatay"],
    Karşıyaka: ["Bostanlı", "Mavişehir", "Alaybey"],
  },
  Bursa: {
    Nilüfer: ["Görükle", "Özlüce", "İhsaniye"],
    Osmangazi: ["Heykel", "Çekirge", "Altıparmak"],
  },
  Adana: {
    Kozan: ["Karacaoğlan", "Tufanpaşa"],
    Seyhan: ["Reşatbey", "Cemalpaşa"],
  },
};

function CartModal({
  cart,
  isCartOpen,
  setIsCartOpen,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  totalPrice,
  setIsLoginOpen,
  user,
  profile,
  setProfile,
  addOrder,
}) {
  const [step, setStep] = useState(1);
  const [checkoutType, setCheckoutType] = useState("");

  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const [city, setCity] = useState(profile?.city || "");
  const [district, setDistrict] = useState(profile?.district || "");
  const [neighborhood, setNeighborhood] = useState(profile?.neighborhood || "");
  const [street, setStreet] = useState(profile?.street || "");
  const [buildingNo, setBuildingNo] = useState(profile?.buildingNo || "");
  const [apartmentNo, setApartmentNo] = useState(profile?.apartmentNo || "");

  const [savedAddressUsed, setSavedAddressUsed] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardMonth, setCardMonth] = useState("");
  const [cardYear, setCardYear] = useState("");
  const [cvv, setCvv] = useState("");

  if (!isCartOpen) return null;

  const fullAddress =
    savedAddressUsed && profile?.address
      ? profile.address
      : `${city} / ${district} / ${neighborhood} / ${street} Bina No:${buildingNo} Daire No:${apartmentNo}`;

  const validateAddress = () => {
    if (savedAddressUsed && profile?.address) {
      return true;
    }

    if (
      !city ||
      !district ||
      !neighborhood ||
      !street ||
      !buildingNo ||
      !apartmentNo
    ) {
      alert("Adres bilgilerini eksiksiz doldurun.");
      return false;
    }

    if (street.trim().length < 3) {
      alert("Sokak/Cadde en az 3 karakter olmalıdır.");
      return false;
    }

    if (!/^\d+$/.test(buildingNo)) {
      alert("Bina No sadece sayı olmalıdır.");
      return false;
    }

    if (!/^\d+$/.test(apartmentNo)) {
      alert("Daire/Kapı No sadece sayı olmalıdır.");
      return false;
    }

    if (Number(buildingNo) <= 0) {
      alert("Bina No 0'dan büyük olmalıdır.");
      return false;
    }

    if (Number(apartmentNo) <= 0) {
      alert("Daire/Kapı No 0'dan büyük olmalıdır.");
      return false;
    }

    return true;
  };

  const saveAddress = () => {
    if (!validateAddress()) return;

    const updatedProfile = {
      ...profile,
      city,
      district,
      neighborhood,
      street,
      buildingNo,
      apartmentNo,
      address: `${city} / ${district} / ${neighborhood} / ${street} Bina No:${buildingNo} Daire No:${apartmentNo}`,
    };

    setProfile(updatedProfile);

    if (user?.email) {
      localStorage.setItem(
        `profile_${user.email}`,
        JSON.stringify(updatedProfile),
      );
    }

    alert("Adres kaydedildi.");
  };

  const useSavedAddress = () => {
    if (!profile?.address) {
      alert("Kayıtlı adres bulunamadı.");
      return;
    }

    if (
      profile.city &&
      profile.district &&
      profile.neighborhood &&
      profile.street &&
      profile.buildingNo &&
      profile.apartmentNo
    ) {
      setCity(profile.city);
      setDistrict(profile.district);
      setNeighborhood(profile.neighborhood);
      setStreet(profile.street);
      setBuildingNo(profile.buildingNo);
      setApartmentNo(profile.apartmentNo);
    }

    setSavedAddressUsed(true);
    alert("Kayıtlı adres getirildi");
  };

  const nextStep = () => {
    if (cart.length === 0) {
      alert("Sepetiniz boş.");
      return;
    }

    if (step === 1) {
      if (!user && !checkoutType) {
        alert("Üye girişi yapın veya üye girişi olmadan devam edin.");
        return;
      }

      if (!user && checkoutType === "guest") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
          alert("Geçerli bir email giriniz.");
          return;
        }

        if (!/^\d{10,11}$/.test(guestPhone)) {
          alert("Telefon numarası 10 veya 11 haneli ve sadece sayı olmalıdır.");
          return;
        }

        if (!validateAddress()) return;
      }
    }

    if (step === 2) {
      if (!validateAddress()) return;
    }

    if (step === 3) {
      if (!cardNumber || !cardMonth || !cardYear || !cvv) {
        alert("Tüm ödeme alanlarını doldurmalısınız.");
        return;
      }

      if (!/^\d{16}$/.test(cardNumber)) {
        alert("Kart numarası 16 haneli olmalı ve sadece sayı içermelidir.");
        return;
      }

      if (!/^\d{3}$/.test(cvv)) {
        alert("CVV 3 haneli olmalı ve sadece sayı içermelidir.");
        return;
      }
    }

    setStep(step + 1);
  };

  const previousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const finishOrder = () => {
    addOrder({
      items: cart,
      totalPrice,
      address: fullAddress,
      userEmail: user ? user.email : guestEmail,
      phone: user ? profile.phone : guestPhone,
      date: new Date().toLocaleString(),
    });

    alert("Sipariş başarıyla oluşturuldu.");
    clearCart();

    setStep(1);
    setCheckoutType("");
    setGuestEmail("");
    setGuestPhone("");
    setCity("");
    setDistrict("");
    setNeighborhood("");
    setStreet("");
    setBuildingNo("");
    setApartmentNo("");
    setCardNumber("");
    setCardMonth("");
    setCardYear("");
    setCvv("");
    setSavedAddressUsed(false);
    setIsCartOpen(false);
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={header}>
          <h2>Sepetim</h2>
          <button onClick={() => setIsCartOpen(false)} style={closeBtn}>
            ×
          </button>
        </div>

        <div style={steps}>
          {["SEPET", "FATURA TESLİMAT", "ÖDEME", "ONAY"].map((item, index) => (
            <div
              key={item}
              style={{
                ...stepBox,
                backgroundColor: step === index + 1 ? "#ff7a00" : "#eee",
                color: step === index + 1 ? "white" : "#555",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {cart.length === 0 ? (
          <h3>Sepetiniz boş</h3>
        ) : (
          <>
            {step === 1 && (
              <>
                <table style={table}>
                  <thead>
                    <tr style={{ backgroundColor: "#eee" }}>
                      <th style={th}>Ürün</th>
                      <th style={th}>Ürün Adı</th>
                      <th style={th}>Adet</th>
                      <th style={th}>Fiyat</th>
                      <th style={th}>Tutar</th>
                      <th style={th}>Sil</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id}>
                        <td style={td}>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "contain",
                            }}
                          />
                        </td>

                        <td style={td}>{item.name}</td>

                        <td style={td}>
                          <button onClick={() => decreaseQuantity(item.id)}>
                            -
                          </button>

                          <span style={{ margin: "0 10px" }}>
                            {item.quantity}
                          </span>

                          <button onClick={() => increaseQuantity(item.id)}>
                            +
                          </button>
                        </td>

                        <td style={td}>{item.price} TL</td>

                        <td style={td}>{item.price * item.quantity} TL</td>

                        <td style={td}>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            style={deleteBtn}
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!user && checkoutType !== "guest" && (
                  <div style={loginChoiceBox}>
                    <h3>Devam Etmek İçin Seçim Yapınız</h3>

                    <button
                      onClick={() => {
                        setCheckoutType("member");
                        setIsLoginOpen(true);
                      }}
                      style={orangeButton}
                    >
                      Üye Girişi Yap
                    </button>

                    <button
                      onClick={() => setCheckoutType("guest")}
                      style={orangeButton}
                    >
                      Üye Girişi Olmadan Devam Et
                    </button>
                  </div>
                )}

                {!user && checkoutType === "guest" && (
                  <div style={guestBox}>
                    <h3>Misafir Bilgileri</h3>

                    <input
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="Email"
                      style={input}
                    />

                    <input
                      value={guestPhone}
                      onChange={(e) =>
                        setGuestPhone(
                          e.target.value.replace(/\D/g, "").slice(0, 11),
                        )
                      }
                      placeholder="Telefon numarası"
                      style={input}
                    />

                    <h3>Misafir Teslimat Adresi</h3>

                    <AddressFields
                      city={city}
                      district={district}
                      neighborhood={neighborhood}
                      street={street}
                      buildingNo={buildingNo}
                      apartmentNo={apartmentNo}
                      setCity={setCity}
                      setDistrict={setDistrict}
                      setNeighborhood={setNeighborhood}
                      setStreet={setStreet}
                      setBuildingNo={setBuildingNo}
                      setApartmentNo={setApartmentNo}
                    />
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <div>
                <h3>Fatura ve Teslimat Bilgileri</h3>

                {user && profile?.address && (
                  <div style={savedBox}>
                    <p>
                      <strong>Kayıtlı Adresiniz:</strong>
                    </p>

                    <p>{profile.address}</p>

                    <button onClick={useSavedAddress} style={grayButton}>
                      Kayıtlı Adresi Kullan
                    </button>

                    {savedAddressUsed && (
                      <p style={{ color: "green", marginTop: "10px" }}>
                        Kayıtlı adres kullanılacak.
                      </p>
                    )}
                  </div>
                )}

                <AddressFields
                  city={city}
                  district={district}
                  neighborhood={neighborhood}
                  street={street}
                  buildingNo={buildingNo}
                  apartmentNo={apartmentNo}
                  setCity={setCity}
                  setDistrict={setDistrict}
                  setNeighborhood={setNeighborhood}
                  setStreet={setStreet}
                  setBuildingNo={setBuildingNo}
                  setApartmentNo={setApartmentNo}
                />

                {user && (
                  <button onClick={saveAddress} style={orangeButton}>
                    Adresi Kaydet
                  </button>
                )}
              </div>
            )}

            {step === 3 && (
              <div>
                <h3>Ödeme Bilgileri</h3>

                <input
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(
                      e.target.value.replace(/\D/g, "").slice(0, 16),
                    )
                  }
                  placeholder="Kart numarası"
                  style={input}
                />

                <div style={addressGrid}>
                  <select
                    value={cardMonth}
                    onChange={(e) => setCardMonth(e.target.value)}
                    style={input}
                  >
                    <option value="">Ay</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>

                  <select
                    value={cardYear}
                    onChange={(e) => setCardYear(e.target.value)}
                    style={input}
                  >
                    <option value="">Yıl</option>
                    {[2026, 2027, 2028, 2029, 2030, 2031].map((year) => (
                      <option key={year}>{year}</option>
                    ))}
                  </select>

                  <input
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                    }
                    placeholder="CVV"
                    style={input}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h3>Sipariş Onayı</h3>

                <p>
                  <strong>Email:</strong> {user ? user.email : guestEmail}
                </p>

                <p>
                  <strong>Telefon:</strong> {user ? profile.phone : guestPhone}
                </p>

                <p>
                  <strong>Adres:</strong> {fullAddress}
                </p>

                <p>
                  <strong>Toplam:</strong> {totalPrice} TL
                </p>
              </div>
            )}

            <div style={summaryBox}>
              <div style={summaryRow}>
                <strong>Toplam:</strong>
                <strong>{totalPrice} TL</strong>
              </div>
            </div>

            <div style={footerButtons}>
              <button onClick={clearCart} style={clearButton}>
                Sepeti Boşalt
              </button>

              {step > 1 && (
                <button onClick={previousStep} style={grayButton}>
                  Geri
                </button>
              )}

              {step < 4 ? (
                <button onClick={nextStep} style={orangeButton}>
                  Devam Et
                </button>
              ) : (
                <button onClick={finishOrder} style={orangeButton}>
                  Siparişi Onayla
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AddressFields({
  city,
  district,
  neighborhood,
  street,
  buildingNo,
  apartmentNo,
  setCity,
  setDistrict,
  setNeighborhood,
  setStreet,
  setBuildingNo,
  setApartmentNo,
}) {
  return (
    <div style={addressGrid}>
      <select
        value={city}
        onChange={(e) => {
          setCity(e.target.value);
          setDistrict("");
          setNeighborhood("");
        }}
        style={input}
      >
        <option value="">Şehir seçiniz</option>
        {Object.keys(addressData).map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <select
        value={district}
        onChange={(e) => {
          setDistrict(e.target.value);
          setNeighborhood("");
        }}
        style={input}
        disabled={!city || !addressData[city]}
      >
        <option value="">İlçe seçiniz</option>

        {city &&
          addressData[city] &&
          Object.keys(addressData[city]).map((item) => (
            <option key={item}>{item}</option>
          ))}
      </select>

      <select
        value={neighborhood}
        onChange={(e) => setNeighborhood(e.target.value)}
        style={input}
        disabled={!district || !addressData[city]?.[district]}
      >
        <option value="">Mahalle seçiniz</option>

        {city &&
          district &&
          addressData[city]?.[district] &&
          addressData[city][district].map((item) => (
            <option key={item}>{item}</option>
          ))}
      </select>

      <input
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        placeholder="Sokak / Cadde"
        style={input}
      />

      <input
        value={buildingNo}
        onChange={(e) => setBuildingNo(e.target.value.replace(/\D/g, ""))}
        placeholder="Bina No"
        style={input}
      />

      <input
        value={apartmentNo}
        onChange={(e) => setApartmentNo(e.target.value.replace(/\D/g, ""))}
        placeholder="Daire / Kapı No"
        style={input}
      />
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
  zIndex: 999,
};

const modal = {
  width: "1050px",
  maxHeight: "90vh",
  overflowY: "auto",
  backgroundColor: "white",
  borderRadius: "12px",
  padding: "25px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
};

const closeBtn = {
  border: "none",
  background: "#eee",
  cursor: "pointer",
  fontSize: "22px",
  borderRadius: "50%",
  width: "36px",
  height: "36px",
};

const steps = {
  display: "flex",
  marginBottom: "20px",
};

const stepBox = {
  flex: 1,
  padding: "12px",
  textAlign: "center",
  fontWeight: "bold",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  padding: "10px",
  textAlign: "left",
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};

const deleteBtn = {
  color: "red",
  border: "none",
  background: "transparent",
  cursor: "pointer",
};

const loginChoiceBox = {
  marginTop: "20px",
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "12px",
  display: "flex",
  gap: "15px",
  alignItems: "center",
};

const guestBox = {
  marginTop: "20px",
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "12px",
};

const input = {
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  marginTop: "10px",
};

const addressGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "12px",
  marginBottom: "20px",
};

const savedBox = {
  padding: "15px",
  backgroundColor: "#f5f5f5",
  borderRadius: "10px",
  marginBottom: "15px",
};

const summaryBox = {
  marginTop: "20px",
  background: "#f5f5f5",
  padding: "20px",
  borderRadius: "10px",
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
};

const footerButtons = {
  display: "flex",
  gap: "10px",
  marginTop: "20px",
};

const orangeButton = {
  padding: "12px",
  backgroundColor: "#ff7a00",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const grayButton = {
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const clearButton = {
  padding: "12px",
  color: "red",
  border: "1px solid red",
  backgroundColor: "white",
  borderRadius: "8px",
  cursor: "pointer",
};

export default CartModal;
