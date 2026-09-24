import { CartProvider } from "./context/CartContext";
import { ContentProvider } from "./context/ContentContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import Home from "./pages/Home";
import AdminApp from "./admin/AdminApp";

function Storefront() {
  return (
    <CartProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <Home />
      <Footer />
      <Cart />
    </CartProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ContentProvider>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<Storefront />} />
        </Routes>
      </ContentProvider>
    </BrowserRouter>
  );
}
