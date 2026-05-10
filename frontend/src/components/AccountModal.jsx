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

function AccountModal({
  isAccountOpen,
  setIsAccountOpen,
  profile,
  setProfile,
  user,
}) {
  if (!isAccountOpen) return null;

  const updateProfile = (field, value) => {
    setProfile({
      ...profile,
      [field]: value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!profile.name.trim()) {
      alert("Ad boş olamaz");
      return;
    }

    if (!profile.surname.trim()) {
      alert("Soyad boş olamaz");
      return;
    }

    if (!/^\d{10,11}$/.test(profile.phone)) {
      alert("Telefon numarası 10 veya 11 haneli ve sadece sayı olmalıdır");
      return;
    }

    if (
      !profile.city ||
      !profile.district ||
      !profile.neighborhood ||
      !profile.street ||
      !profile.buildingNo ||
      !profile.apartmentNo
    ) {
      alert("Adres alanlarını eksiksiz doldurun");
      return;
    }

    if (profile.street.trim().length < 3) {
      alert("Sokak/Cadde en az 3 karakter olmalıdır");
      return;
    }

    const fullAddress = `${profile.city} / ${profile.district} / ${profile.neighborhood} / ${profile.street} Bina No:${profile.buildingNo} Daire No:${profile.apartmentNo}`;

    const updatedProfile = {
      ...profile,
      address: fullAddress,
    };

    setProfile(updatedProfile);

    if (user?.email) {
      localStorage.setItem(
        `profile_${user.email}`,
        JSON.stringify(updatedProfile),
      );
    }

    alert("Bilgiler kaydedildi");
    setIsAccountOpen(false);
  };

  return (
    <div style={overlay}>
      <form onSubmit={handleSave} style={box}>
        <h2>Hesap Bilgilerim</h2>

        <input
          placeholder="Ad"
          value={profile.name}
          onChange={(e) => updateProfile("name", e.target.value)}
          style={input}
        />

        <input
          placeholder="Soyad"
          value={profile.surname}
          onChange={(e) => updateProfile("surname", e.target.value)}
          style={input}
        />

        <input
          placeholder="Telefon"
          value={profile.phone}
          onChange={(e) =>
            updateProfile(
              "phone",
              e.target.value.replace(/\D/g, "").slice(0, 11),
            )
          }
          style={input}
        />

        <h3>Adresi Düzenle</h3>

        <select
          value={profile.city}
          onChange={(e) => {
            const selectedCity = e.target.value;

            setProfile({
              ...profile,
              city: selectedCity,
              district: "",
              neighborhood: "",
            });
          }}
          style={input}
        >
          <option value="">Şehir seçiniz</option>
          {Object.keys(addressData).map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>

        <select
          value={profile.district}
          onChange={(e) => {
            const selectedDistrict = e.target.value;

            setProfile({
              ...profile,
              district: selectedDistrict,
              neighborhood: "",
            });
          }}
          style={input}
          disabled={!profile.city}
        >
          <option value="">İlçe seçiniz</option>
          {profile.city &&
            Object.keys(addressData[profile.city]).map((district) => (
              <option key={district}>{district}</option>
            ))}
        </select>

        <select
          value={profile.neighborhood}
          onChange={(e) => updateProfile("neighborhood", e.target.value)}
          style={input}
          disabled={!profile.district}
        >
          <option value="">Mahalle seçiniz</option>
          {profile.city &&
            profile.district &&
            addressData[profile.city][profile.district].map((neighborhood) => (
              <option key={neighborhood}>{neighborhood}</option>
            ))}
        </select>

        <input
          placeholder="Sokak / Cadde"
          value={profile.street}
          onChange={(e) => updateProfile("street", e.target.value)}
          style={input}
        />

        <input
          placeholder="Bina No"
          value={profile.buildingNo}
          onChange={(e) =>
            updateProfile("buildingNo", e.target.value.replace(/\D/g, ""))
          }
          style={input}
        />

        <input
          placeholder="Daire / Kapı No"
          value={profile.apartmentNo}
          onChange={(e) =>
            updateProfile("apartmentNo", e.target.value.replace(/\D/g, ""))
          }
          style={input}
        />

        <button type="submit" style={saveBtn}>
          Kaydet
        </button>

        <button
          type="button"
          onClick={() => setIsAccountOpen(false)}
          style={closeBtn}
        >
          Kapat
        </button>
      </form>
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
  width: "460px",
  maxHeight: "90vh",
  overflowY: "auto",
  padding: "25px",
  borderRadius: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const input = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const saveBtn = {
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

export default AccountModal;
