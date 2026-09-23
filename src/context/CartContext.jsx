import { createContext, useContext, useMemo, useState } from "react";
import { createCartId } from "../utils/format";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("cart");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuQuery, setMenuQuery] = useState("");
  const [highlightId, setHighlightId] = useState(null);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  function openCart(nextStep = "cart") {
    setStep(nextStep);
    setIsOpen(true);
  }

  function closeCart() {
    setIsOpen(false);
  }

  function addItem(item) {
    setItems((current) => {
      const match = current.find(
        (row) =>
          row.pizzaId === item.pizzaId &&
          row.size === item.size &&
          JSON.stringify(row.extras || []) === JSON.stringify(item.extras || []),
      );

      if (match) {
        return current.map((row) =>
          row.cartId === match.cartId ? { ...row, quantity: row.quantity + (item.quantity || 1) } : row,
        );
      }

      return [
        ...current,
        {
          cartId: createCartId(),
          quantity: 1,
          extras: [],
          ...item,
        },
      ];
    });
    setStep("cart");
    setIsOpen(true);
  }

  function updateQuantity(cartId, quantity) {
    setItems((current) => {
      if (quantity < 1) return current.filter((row) => row.cartId !== cartId);
      return current.map((row) => (row.cartId === cartId ? { ...row, quantity } : row));
    });
  }

  function removeItem(cartId) {
    setItems((current) => current.filter((row) => row.cartId !== cartId));
  }

  function clearCart() {
    setItems([]);
  }

  function resetOrder() {
    setItems([]);
    setStep("cart");
    setCustomer({ name: "", phone: "", address: "" });
    setIsOpen(false);
  }

  const value = {
    items,
    isOpen,
    step,
    setStep,
    searchOpen,
    setSearchOpen,
    menuQuery,
    setMenuQuery,
    highlightId,
    setHighlightId,
    customer,
    setCustomer,
    subtotal,
    count,
    openCart,
    closeCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    resetOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
