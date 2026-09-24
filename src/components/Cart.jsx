import { useEffect, useRef } from "react";
import { FiMinus, FiPlus, FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import { useContent } from "../context/ContentContext";
import { formatPrice } from "../utils/format";
import { buildOrderMessage, buildWhatsAppUrl } from "../utils/whatsapp";

export default function Cart() {
  const { restaurant } = useContent();
  const {
    isOpen,
    closeCart,
    items,
    subtotal,
    updateQuantity,
    removeItem,
    step,
    setStep,
    customer,
    updateCustomer,
    resetOrder,
    count,
    openCart,
  } = useCart();
  const panelRef = useRef(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      wasOpenRef.current = false;
      return undefined;
    }

    const onKey = (event) => {
      if (event.key === "Escape") closeCart();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    // Focus the panel only when it first opens — not on every keystroke/re-render.
    if (!wasOpenRef.current) {
      panelRef.current?.focus();
      wasOpenRef.current = true;
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  const whatsappUrl = buildWhatsAppUrl(
    restaurant.whatsapp,
    buildOrderMessage({
      restaurant,
      customer,
      items,
      total: subtotal,
    }),
  );

  function placeOrder(event) {
    event.preventDefault();
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) return;
    setStep("confirmed");
  }

  return (
    <>
      {count > 0 && !isOpen && (
        <button
          type="button"
          className="btn btn-gold fixed right-4 z-40 shadow-lg lg:hidden bottom-[max(1rem,env(safe-area-inset-bottom))]"
          onClick={() => openCart()}
        >
          View order · {count}
        </button>
      )}

      <div
        className={`fixed inset-0 z-[70] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!isOpen}
      >
        <div
          className={`absolute inset-0 bg-ink/50 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={closeCart}
        />
        <aside
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-title"
          className={`cart-panel absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper text-ink transition-transform duration-300 pb-[env(safe-area-inset-bottom)] ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <header className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <p className="text-[0.68rem] tracking-[0.2em] text-muted uppercase">
                {step === "confirmed" ? "Order note" : step === "checkout" ? "Checkout" : "Your order"}
              </p>
              <h2 id="cart-title" className="font-display text-2xl">
                {step === "confirmed" ? "Almost there" : "Pizza House"}
              </h2>
            </div>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-cream"
              aria-label="Close order panel"
              onClick={closeCart}
            >
              <FiX size={18} />
            </button>
          </header>

          {step === "cart" && (
            <>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {items.length === 0 ? (
                  <p className="rounded-2xl bg-cream px-4 py-10 text-center text-sm text-muted">
                    Your bag is empty. Add a pizza from the menu or build your own.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {items.map((item) => (
                      <li key={item.cartId} className="flex gap-3 rounded-2xl border border-line p-3">
                        <img src={item.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted">{item.size}</p>
                          {item.extras?.length > 0 && (
                            <p className="truncate text-xs text-muted">{item.extras.join(" · ")}</p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-line">
                              <button
                                type="button"
                                className="grid h-8 w-8 place-items-center"
                                aria-label={`Decrease quantity of ${item.name}`}
                                onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                              >
                                <FiMinus size={12} />
                              </button>
                              <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                              <button
                                type="button"
                                className="grid h-8 w-8 place-items-center"
                                aria-label={`Increase quantity of ${item.name}`}
                                onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                              >
                                <FiPlus size={12} />
                              </button>
                            </div>
                            <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="self-start text-muted hover:text-tomato"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => removeItem(item.cartId)}
                        >
                          <FiX />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <footer className="border-t border-line px-5 py-4">
                <p className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </p>
                <p className="mt-1 flex justify-between">
                  <span className="text-sm">Total</span>
                  <span className="font-display text-2xl">{formatPrice(subtotal)}</span>
                </p>
                <button
                  type="button"
                  className="btn btn-gold mt-4 w-full"
                  disabled={items.length === 0}
                  onClick={() => setStep("checkout")}
                >
                  Checkout
                </button>
              </footer>
            </>
          )}

          {step === "checkout" && (
            <form className="flex h-full flex-col" onSubmit={placeOrder}>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <button type="button" className="text-sm font-semibold text-muted hover:text-ink" onClick={() => setStep("cart")}>
                  ← Back to bag
                </button>
                <label className="mt-5 block text-sm font-semibold">
                  Customer Name
                  <input
                    required
                    name="customerName"
                    value={customer.name}
                    onChange={(event) => updateCustomer("name", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-line bg-cream px-3 py-3 outline-none focus:border-gold"
                    autoComplete="name"
                  />
                </label>
                <label className="mt-4 block text-sm font-semibold">
                  Phone
                  <input
                    required
                    name="customerPhone"
                    value={customer.phone}
                    onChange={(event) => updateCustomer("phone", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-line bg-cream px-3 py-3 outline-none focus:border-gold"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </label>
                <label className="mt-4 block text-sm font-semibold">
                  Delivery Address
                  <textarea
                    required
                    name="customerAddress"
                    rows={3}
                    value={customer.address}
                    onChange={(event) => updateCustomer("address", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-line bg-cream px-3 py-3 outline-none focus:border-gold"
                    autoComplete="street-address"
                  />
                </label>

                <h3 className="mt-6 text-sm font-bold tracking-[0.14em] uppercase">Order summary</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {items.map((item) => (
                    <li key={item.cartId} className="flex justify-between gap-3">
                      <span>
                        {item.quantity}× {item.name} ({item.size})
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-line px-5 py-4">
                <p className="flex justify-between">
                  <span>Total</span>
                  <span className="font-display text-2xl">{formatPrice(subtotal)}</span>
                </p>
                <button type="submit" className="btn btn-gold mt-4 w-full">
                  Place Order
                </button>
                <a
                  className="btn btn-line mt-3 w-full no-underline"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp /> Send on WhatsApp
                </a>
              </div>
            </form>
          )}

          {step === "confirmed" && (
            <div className="flex flex-1 flex-col px-5 py-8">
              <p className="font-display text-3xl leading-tight">Your order has been prepared for submission.</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                This is a static demo — no payment is taken here. Send the ticket on WhatsApp, or call the restaurant to confirm.
              </p>
              <p className="mt-4 text-sm">
                {customer.name} · {customer.phone}
                <br />
                {customer.address}
              </p>
              <p className="mt-2 font-display text-2xl">{formatPrice(subtotal)}</p>
              <a className="btn btn-gold mt-8 no-underline" href={whatsappUrl} target="_blank" rel="noreferrer">
                <FaWhatsapp /> WhatsApp this order
              </a>
              <button type="button" className="btn btn-line mt-3" onClick={resetOrder}>
                Start a new order
              </button>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
