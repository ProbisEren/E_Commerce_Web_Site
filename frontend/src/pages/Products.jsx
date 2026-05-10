import { useEffect, useState } from "react";
import API from "../services/api";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import CartModal from "../components/CartModal";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import ProductDetailModal from "../components/ProductDetailModal";
import AccountModal from "../components/AccountModal";
import OrdersModal from "../components/OrdersModal";

function Products() {
  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedClothingGroup, setSelectedClothingGroup] = useState("");
  const [selectedClothingTab, setSelectedClothingTab] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState("");

  const emptyProfile = {
    name: "",
    surname: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    neighborhood: "",
    street: "",
    buildingNo: "",
    apartmentNo: "",
  };

  const [profile, setProfile] = useState(emptyProfile);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const categories = [
    "Elektronik",
    "Giyim",
    "Kitap",
    "Kozmetik",
    "Ev ve Yaşam",
    "Spor",
    "Oyuncak",
  ];

  const clothingGroups = ["Kadın", "Erkek", "Kız Çocuk", "Erkek Çocuk"];

  const clothingTabs = {
    Kadın: ["Elbise", "Bluz", "Pantolon", "Ceket"],
    Erkek: ["Tişört", "Gömlek", "Pantolon", "Ceket"],
    "Kız Çocuk": ["Elbise", "Tişört", "Pantolon", "Mont"],
    "Erkek Çocuk": ["Tişört", "Gömlek", "Pantolon", "Mont"],
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.description.toLowerCase().includes(searchText.toLowerCase());

    if (searchText && !matchesSearch) return false;

    if (!selectedCategory) return searchText ? true : false;

    if (product.category !== selectedCategory) return false;

    if (selectedCategory === "Giyim") {
      if (
        selectedClothingGroup &&
        product.subCategory !== selectedClothingGroup
      ) {
        return false;
      }

      if (selectedClothingTab && product.productType !== selectedClothingTab) {
        return false;
      }
    }

    return true;
  });
  const addToCart = (product) => {
    if (product.stock === 0) {
      alert("Bu ürün stokta yok");
      return;
    }

    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }

    setCartMessage(`${product.name} sepete eklendi`);

    setTimeout(() => {
      setCartMessage("");
    }, 3000);
  };

  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  };

  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  // GÜNCELLENMİŞ addOrder
  const addOrder = async (order) => {
    try {
      // backend stok düş
      for (const item of order.items) {
        await API.put(`/products/${item.id}/stock/${item.quantity}`);
      }

      // siparişleri kaydet
      const updatedOrders = [...orders, order];
      setOrders(updatedOrders);

      if (user?.email) {
        localStorage.setItem(
          `orders_${user.email}`,
          JSON.stringify(updatedOrders),
        );
      }

      // frontend stok güncelle
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          const orderedItem = order.items.find(
            (item) => item.id === product.id,
          );

          if (orderedItem) {
            return {
              ...product,
              stock: product.stock - orderedItem.quantity,
            };
          }

          return product;
        }),
      );
    } catch (error) {
      console.log(error);
      alert("Stok güncellenirken hata oluştu");
    }
  };

  return (
    <>
      <Navbar
        totalQuantity={totalQuantity}
        setIsCartOpen={setIsCartOpen}
        setIsLoginOpen={setIsLoginOpen}
        setIsRegisterOpen={setIsRegisterOpen}
        user={user}
        setUser={setUser}
        profile={profile}
        setIsAccountOpen={setIsAccountOpen}
        setIsOrdersOpen={setIsOrdersOpen}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      <div style={{ padding: "30px" }}>
        {cartMessage && <div style={messageBox}>{cartMessage}</div>}

        <h2>Kategoriler</h2>

        <div style={{ marginBottom: "20px" }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setSelectedClothingGroup("");
                setSelectedClothingTab("");
              }}
              style={categoryBtn}
            >
              {category}
            </button>
          ))}
        </div>

        {selectedCategory === "Giyim" && (
          <div style={{ marginBottom: "20px" }}>
            <h3>Alt Kategoriler</h3>

            {clothingGroups.map((group) => (
              <button
                key={group}
                onClick={() => {
                  setSelectedClothingGroup(group);
                  setSelectedClothingTab("");
                }}
                style={categoryBtn}
              >
                {group}
              </button>
            ))}
          </div>
        )}

        {selectedCategory === "Giyim" && selectedClothingGroup && (
          <div style={{ marginBottom: "20px" }}>
            <h3>Ürün Türleri</h3>

            {clothingTabs[selectedClothingGroup].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedClothingTab(tab)}
                style={categoryBtn}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {!selectedCategory && <p>Lütfen kategori seçiniz</p>}

        {selectedCategory && (
          <div style={productGrid}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                openProductDetail={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </div>

      <ProductDetailModal
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        addToCart={addToCart}
        setIsCartOpen={setIsCartOpen}
      />

      <CartModal
        cart={cart}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        totalPrice={totalPrice}
        setIsLoginOpen={setIsLoginOpen}
        user={user}
        profile={profile}
        setProfile={setProfile}
        addOrder={addOrder}
      />

      <LoginModal
        isLoginOpen={isLoginOpen}
        setIsLoginOpen={setIsLoginOpen}
        setUser={setUser}
        setProfile={setProfile}
        emptyProfile={emptyProfile}
        setOrders={setOrders}
      />

      <RegisterModal
        isRegisterOpen={isRegisterOpen}
        setIsRegisterOpen={setIsRegisterOpen}
      />

      <AccountModal
        isAccountOpen={isAccountOpen}
        setIsAccountOpen={setIsAccountOpen}
        profile={profile}
        setProfile={setProfile}
        user={user}
      />

      <OrdersModal
        isOrdersOpen={isOrdersOpen}
        setIsOrdersOpen={setIsOrdersOpen}
        orders={orders}
      />
    </>
  );
}

const productGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: "20px",
};

const categoryBtn = {
  margin: "5px",
  padding: "10px 15px",
};

const messageBox = {
  position: "fixed",
  top: "90px",
  right: "20px",
  backgroundColor: "white",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  zIndex: 1000,
};

export default Products;
