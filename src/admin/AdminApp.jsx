import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { FiImage, FiLogOut, FiMenu, FiSettings, FiStar, FiTag, FiTool, FiX } from "react-icons/fi";
import { GiPizzaSlice } from "react-icons/gi";
import { useContent } from "../context/ContentContext";
import { changePassword, fetchSession, login, logout, saveContent, uploadImage } from "../api";
import { formatPrice } from "../utils/format";

const tabs = [
  { to: "/admin", label: "Menu & prices", icon: GiPizzaSlice, end: true },
  { to: "/admin/photos", label: "Photos", icon: FiImage },
  { to: "/admin/offers", label: "Offers", icon: FiTag },
  { to: "/admin/shop", label: "Shop details", icon: FiSettings },
  { to: "/admin/reviews", label: "Reviews", icon: FiStar },
  { to: "/admin/builder", label: "Builder prices", icon: FiTool },
];

export default function AdminApp() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    fetchSession()
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false))
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-paper text-muted">Loading owner panel…</div>;
  }

  if (!authed) {
    return <LoginForm onSuccess={() => setAuthed(true)} />;
  }

  return <AdminShell onLogout={() => setAuthed(false)} />;
}

function LoginForm({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(password);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4 text-cream">
      <form onSubmit={submit} className="w-full max-w-md rounded-[1.6rem] bg-paper p-6 text-ink shadow-2xl sm:p-8">
        <p className="text-[0.72rem] font-bold tracking-[0.22em] text-tomato uppercase">Pizza House</p>
        <h1 className="font-display mt-2 text-3xl">Owner login</h1>
        <p className="mt-2 text-sm text-muted">Change photos, prices, hours, and offers from this panel. Guest orders still arrive on WhatsApp.</p>
        <label className="mt-6 block text-sm font-semibold">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-line bg-cream px-3 py-3 outline-none focus:border-gold"
            autoComplete="current-password"
            required
          />
        </label>
        {error ? <p className="mt-3 text-sm text-tomato">{error}</p> : null}
        <button type="submit" className="btn btn-gold mt-6 w-full" disabled={busy}>
          {busy ? "Checking…" : "Enter"}
        </button>
        <p className="mt-4 text-xs text-muted">
          First-time password: <code className="rounded bg-cream px-1">pizzahouse</code>. Change it under Shop details after you log in.
        </p>
        <Link to="/" className="mt-4 inline-block text-sm text-muted hover:text-ink">
          ← Back to website
        </Link>
      </form>
    </main>
  );
}

function AdminShell({ onLogout }) {
  const { content, setContent, refresh } = useContent();
  const [draft, setDraft] = useState(content);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setDraft(content);
  }, [content]);

  async function save() {
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const data = await saveContent(draft);
      setContent(data.content);
      setDraft(data.content);
      setStatus("Saved. The public website now shows these changes.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleUpload(file) {
    return uploadImage(file);
  }

  async function handleLogout() {
    await logout().catch(() => {});
    onLogout();
    navigate("/admin");
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-ink px-4 py-3 text-cream">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10 lg:hidden"
            aria-label="Open owner menu"
            onClick={() => setNavOpen(true)}
          >
            <FiMenu size={20} />
          </button>
          <div>
            <p className="text-[0.65rem] tracking-[0.18em] text-gold uppercase">Owner panel</p>
            <p className="font-display text-lg leading-tight">Pizza House</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="hidden rounded-full px-3 py-2 text-sm text-cream/80 no-underline hover:text-gold sm:inline">
            View site
          </Link>
          <button type="button" className="btn btn-gold" onClick={save} disabled={busy}>
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </header>

      {(status || error) && (
        <div className={`px-4 py-3 text-sm ${error ? "bg-tomato text-cream" : "bg-gold text-ink"}`}>
          {error || status}
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[240px_1fr]">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-ink text-cream transition-transform lg:static lg:z-0 lg:w-auto lg:translate-x-0 ${
            navOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 lg:hidden">
            <p className="font-display text-xl">Menu</p>
            <button type="button" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" aria-label="Close owner menu" onClick={() => setNavOpen(false)}>
              <FiX size={20} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                onClick={() => setNavOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm no-underline ${
                    isActive ? "bg-gold text-ink" : "text-cream/80 hover:bg-white/10"
                  }`
                }
              >
                <tab.icon size={18} />
                {tab.label}
              </NavLink>
            ))}
            <button type="button" className="mt-auto flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-cream/70 hover:bg-white/10" onClick={handleLogout}>
              <FiLogOut />
              Log out
            </button>
          </nav>
        </aside>
        {navOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-ink/50 lg:hidden"
            aria-label="Close menu overlay"
            onClick={() => setNavOpen(false)}
          />
        ) : null}

        <div className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<MenuPanel draft={draft} setDraft={setDraft} upload={handleUpload} />} />
            <Route path="/photos" element={<PhotosPanel draft={draft} setDraft={setDraft} upload={handleUpload} />} />
            <Route path="/offers" element={<OffersPanel draft={draft} setDraft={setDraft} upload={handleUpload} />} />
            <Route path="/shop" element={<ShopPanel draft={draft} setDraft={setDraft} />} />
            <Route path="/reviews" element={<ReviewsPanel draft={draft} setDraft={setDraft} />} />
            <Route path="/builder" element={<BuilderPanel draft={draft} setDraft={setDraft} />} />
          </Routes>
          <p className="mt-10 text-xs text-muted">
            Remember to press <strong>Save changes</strong> at the top. Download a backup from Shop details before a future website update.
            <button type="button" className="ml-2 underline" onClick={() => refresh()}>
              Reload live content
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function MenuPanel({ draft, setDraft, upload }) {
  const [openId, setOpenId] = useState(draft.menu[0]?.id ?? null);

  function updatePizza(id, patch) {
    setDraft((current) => ({
      ...current,
      menu: current.menu.map((pizza) => (pizza.id === id ? { ...pizza, ...patch } : pizza)),
    }));
  }

  function addPizza() {
    const id = Date.now();
    const pizza = {
      id,
      name: "New pizza",
      category: "Classic",
      description: "",
      price: 899,
      sizes: { small: 699, medium: 899, large: 1199 },
      image: "/images/hero.jpg",
      badge: "",
      ingredients: [],
      rating: 4.8,
      available: true,
    };
    setDraft((current) => ({ ...current, menu: [pizza, ...current.menu] }));
    setOpenId(id);
  }

  function removePizza(id) {
    if (!window.confirm("Remove this pizza from the menu?")) return;
    setDraft((current) => ({ ...current, menu: current.menu.filter((pizza) => pizza.id !== id) }));
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Menu & prices</h1>
          <p className="mt-1 text-sm text-muted">Add pizzas, swap photos, and set small / medium / large prices in SEK.</p>
        </div>
        <button type="button" className="btn btn-ink" onClick={addPizza}>
          Add pizza
        </button>
      </div>
      <ul className="mt-6 space-y-4">
        {draft.menu.map((pizza) => (
          <li key={pizza.id} className="overflow-hidden rounded-2xl border border-line bg-cream">
            <button
              type="button"
              className="flex w-full items-center gap-3 p-3 text-left"
              onClick={() => setOpenId((current) => (current === pizza.id ? null : pizza.id))}
            >
              <img src={pizza.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{pizza.name}</p>
                <p className="text-sm text-muted">
                  {pizza.category} · {formatPrice(pizza.sizes?.medium || pizza.price)} · {pizza.available ? "On the menu" : "Sold out"}
                </p>
              </div>
            </button>
            {openId === pizza.id && (
              <div className="grid gap-4 border-t border-line p-4 md:grid-cols-2">
                <Field label="Name" value={pizza.name} onChange={(value) => updatePizza(pizza.id, { name: value })} />
                <label className="block text-sm font-semibold">
                  Category
                  <select
                    className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5"
                    value={pizza.category}
                    onChange={(event) => updatePizza(pizza.id, { category: event.target.value })}
                  >
                    {draft.menuCategories.filter((item) => item !== "All").map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="md:col-span-2 block text-sm font-semibold">
                  Description
                  <textarea
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5"
                    value={pizza.description}
                    onChange={(event) => updatePizza(pizza.id, { description: event.target.value })}
                  />
                </label>
                <Field
                  label="Small price (SEK)"
                  type="number"
                  value={pizza.sizes?.small ?? ""}
                  onChange={(value) =>
                    updatePizza(pizza.id, {
                      sizes: { ...pizza.sizes, small: Number(value) || 0 },
                      price: pizza.sizes?.medium || pizza.price,
                    })
                  }
                />
                <Field
                  label="Medium price (SEK)"
                  type="number"
                  value={pizza.sizes?.medium ?? pizza.price}
                  onChange={(value) => {
                    const medium = Number(value) || 0;
                    updatePizza(pizza.id, {
                      sizes: { ...pizza.sizes, medium },
                      price: medium,
                    });
                  }}
                />
                <Field
                  label="Large price (SEK)"
                  type="number"
                  value={pizza.sizes?.large ?? ""}
                  onChange={(value) => updatePizza(pizza.id, { sizes: { ...pizza.sizes, large: Number(value) || 0 } })}
                />
                <Field label="Badge (Popular, New, Spicy…)" value={pizza.badge || ""} onChange={(value) => updatePizza(pizza.id, { badge: value })} />
                <Field
                  label="Ingredients (comma separated)"
                  value={(pizza.ingredients || []).join(", ")}
                  onChange={(value) =>
                    updatePizza(pizza.id, {
                      ingredients: value.split(",").map((item) => item.trim()).filter(Boolean),
                    })
                  }
                />
                <ImageUpload label="Pizza photo" value={pizza.image} onChange={(image) => updatePizza(pizza.id, { image })} upload={upload} />
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={pizza.available}
                    onChange={(event) => updatePizza(pizza.id, { available: event.target.checked })}
                  />
                  Available to order
                </label>
                <div className="md:col-span-2">
                  <button type="button" className="text-sm font-semibold text-tomato" onClick={() => removePizza(pizza.id)}>
                    Remove pizza
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function PhotosPanel({ draft, setDraft, upload }) {
  function updateImage(key, value) {
    setDraft((current) => ({ ...current, images: { ...current.images, [key]: value } }));
  }

  function updateSlide(listKey, index, patch) {
    setDraft((current) => ({
      ...current,
      [listKey]: current[listKey].map((slide, slideIndex) => (slideIndex === index ? { ...slide, ...patch } : slide)),
    }));
  }

  function addSlide(listKey, template) {
    setDraft((current) => ({ ...current, [listKey]: [...current[listKey], template] }));
  }

  function removeSlide(listKey, index) {
    setDraft((current) => ({ ...current, [listKey]: current[listKey].filter((_, slideIndex) => slideIndex !== index) }));
  }

  return (
    <section className="space-y-10">
      <div>
        <h1 className="font-display text-3xl">Photos</h1>
        <p className="mt-1 text-sm text-muted">Upload new pictures for the homepage banners and the About / Contact / Builder sections.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ImageUpload label="About — kitchen" value={draft.images.aboutKitchen} onChange={(value) => updateImage("aboutKitchen", value)} upload={upload} />
        <ImageUpload label="About — oven" value={draft.images.aboutOven} onChange={(value) => updateImage("aboutOven", value)} upload={upload} />
        <ImageUpload label="Pizza builder preview" value={draft.images.builderPreview} onChange={(value) => updateImage("builderPreview", value)} upload={upload} />
        <ImageUpload label="Contact / dining room" value={draft.images.contactAmbience} onChange={(value) => updateImage("contactAmbience", value)} upload={upload} />
      </div>

      <SlideEditor
        title="Homepage hero banners"
        slides={draft.heroSlides}
        fields={["src", "alt", "kicker", "caption"]}
        onChange={(index, patch) => updateSlide("heroSlides", index, patch)}
        onAdd={() => addSlide("heroSlides", { src: "/images/hero.jpg", alt: "", kicker: "", caption: "" })}
        onRemove={(index) => removeSlide("heroSlides", index)}
        upload={upload}
      />
      <SlideEditor
        title="Atmosphere banners"
        slides={draft.houseSlides}
        fields={["src", "alt", "kicker", "title", "text"]}
        onChange={(index, patch) => updateSlide("houseSlides", index, patch)}
        onAdd={() => addSlide("houseSlides", { src: "/images/kitchen.jpg", alt: "", kicker: "", title: "", text: "" })}
        onRemove={(index) => removeSlide("houseSlides", index)}
        upload={upload}
      />
      <SlideEditor
        title="Offer photos"
        slides={draft.offerSlides}
        fields={["src", "alt"]}
        onChange={(index, patch) => updateSlide("offerSlides", index, patch)}
        onAdd={() => addSlide("offerSlides", { src: "/images/offer.jpg", alt: "" })}
        onRemove={(index) => removeSlide("offerSlides", index)}
        upload={upload}
      />
    </section>
  );
}

function SlideEditor({ title, slides, fields, onChange, onAdd, onRemove, upload }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl">{title}</h2>
        <button type="button" className="btn btn-line" onClick={onAdd}>
          Add slide
        </button>
      </div>
      <ul className="mt-4 grid gap-4">
        {slides.map((slide, index) => (
          <li key={`${slide.src}-${index}`} className="grid gap-3 rounded-2xl border border-line bg-cream p-4 md:grid-cols-2">
            {fields.includes("src") && (
              <ImageUpload label={`Slide ${index + 1} photo`} value={slide.src} onChange={(src) => onChange(index, { src })} upload={upload} />
            )}
            <div className="space-y-3">
              {fields
                .filter((field) => field !== "src")
                .map((field) => (
                  <Field
                    key={field}
                    label={field}
                    value={slide[field] || ""}
                    onChange={(value) => onChange(index, { [field]: value })}
                  />
                ))}
              <button type="button" className="text-sm font-semibold text-tomato" onClick={() => onRemove(index)}>
                Remove slide
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OffersPanel({ draft, setDraft, upload }) {
  const offer = draft.offers[0] || {
    id: "weekend-deal",
    kicker: "",
    title: "",
    headline: "",
    description: "",
    price: 0,
    originalPrice: 0,
    cta: "ORDER DEAL",
    note: "",
    includes: [],
    image: "/images/offer.jpg",
    cartItem: { name: "", size: "", price: 0, image: "/images/offer.jpg" },
  };

  function update(patch) {
    const next = { ...offer, ...patch };
    if (patch.price != null || patch.image || patch.headline) {
      next.cartItem = {
        ...next.cartItem,
        name: next.cartItem?.name || next.headline,
        price: next.price,
        image: next.image,
      };
    }
    setDraft((current) => ({ ...current, offers: [next] }));
  }

  return (
    <section>
      <h1 className="font-display text-3xl">Offers</h1>
      <p className="mt-1 text-sm text-muted">This is the featured deal on the homepage.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Kicker" value={offer.kicker} onChange={(value) => update({ kicker: value })} />
        <Field label="Title" value={offer.title} onChange={(value) => update({ title: value })} />
        <Field label="Headline" value={offer.headline} onChange={(value) => update({ headline: value })} />
        <Field label="Button text" value={offer.cta} onChange={(value) => update({ cta: value })} />
        <Field label="Deal price (SEK)" type="number" value={offer.price} onChange={(value) => update({ price: Number(value) || 0 })} />
        <Field label="Original price (SEK)" type="number" value={offer.originalPrice} onChange={(value) => update({ originalPrice: Number(value) || 0 })} />
        <label className="md:col-span-2 block text-sm font-semibold">
          Description
          <textarea rows={3} className="mt-2 w-full rounded-xl border border-line bg-cream px-3 py-2.5" value={offer.description} onChange={(event) => update({ description: event.target.value })} />
        </label>
        <Field
          label="Includes (one per line)"
          textarea
          value={(offer.includes || []).join("\n")}
          onChange={(value) => update({ includes: value.split("\n").map((item) => item.trim()).filter(Boolean) })}
        />
        <Field label="Fine print" value={offer.note} onChange={(value) => update({ note: value })} />
        <ImageUpload label="Deal photo" value={offer.image} onChange={(image) => update({ image, cartItem: { ...offer.cartItem, image } })} upload={upload} />
      </div>
    </section>
  );
}

function ShopPanel({ draft, setDraft }) {
  const restaurant = draft.restaurant;
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function update(patch) {
    setDraft((current) => ({
      ...current,
      restaurant: { ...current.restaurant, ...patch },
    }));
  }

  function downloadBackup() {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pizza-house-content.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        setDraft((current) => ({ ...current, ...parsed, restaurant: { ...current.restaurant, ...parsed.restaurant } }));
      } catch {
        window.alert("That file is not valid shop data.");
      }
    };
    reader.readAsText(file);
  }

  async function savePassword(event) {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");
    try {
      await changePassword(currentPassword, nextPassword);
      setPasswordMessage("Password updated.");
      setCurrentPassword("");
      setNextPassword("");
    } catch (err) {
      setPasswordError(err.message);
    }
  }

  return (
    <section className="space-y-10">
      <div>
        <h1 className="font-display text-3xl">Shop details</h1>
        <p className="mt-1 text-sm text-muted">Name, phone, WhatsApp, hours, address, and about text.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Brand name" value={restaurant.name} onChange={(value) => update({ name: value })} />
        <Field label="Short name" value={restaurant.shortName} onChange={(value) => update({ shortName: value })} />
        <Field label="Hero label" value={restaurant.heroLabel} onChange={(value) => update({ heroLabel: value })} />
        <Field label="Tagline" textarea value={restaurant.tagline} onChange={(value) => update({ tagline: value })} />
        <Field label="Hero support text" textarea value={restaurant.heroSupport} onChange={(value) => update({ heroSupport: value })} />
        <Field label="Phone shown on site" value={restaurant.phoneDisplay} onChange={(value) => update({ phoneDisplay: value })} />
        <Field label="Phone tel link" value={restaurant.phoneTel} onChange={(value) => update({ phoneTel: value })} />
        <Field
          label="WhatsApp number (digits only, with country code)"
          value={restaurant.whatsapp}
          onChange={(value) => update({ whatsapp: value.replace(/[^\d]/g, "") })}
        />
        <Field label="Email" value={restaurant.email} onChange={(value) => update({ email: value })} />
        <Field label="Address line 1" value={restaurant.addressLine1} onChange={(value) => update({ addressLine1: value })} />
        <Field label="Address line 2" value={restaurant.addressLine2} onChange={(value) => update({ addressLine2: value })} />
        <Field label="Hours title" value={restaurant.hoursTitle} onChange={(value) => update({ hoursTitle: value })} />
        <Field label="Hours time" value={restaurant.hoursTime} onChange={(value) => update({ hoursTime: value })} />
        <Field label="Hours note" value={restaurant.hoursNote} onChange={(value) => update({ hoursNote: value })} />
        <Field label="Google Maps URL" value={restaurant.mapsUrl} onChange={(value) => update({ mapsUrl: value })} />
        <Field label="About title" value={restaurant.aboutTitle} onChange={(value) => update({ aboutTitle: value })} />
        <Field label="About lead" textarea value={restaurant.aboutLead} onChange={(value) => update({ aboutLead: value })} />
        <Field
          label="About paragraphs (one per line)"
          textarea
          value={(restaurant.aboutBody || []).join("\n\n")}
          onChange={(value) => update({ aboutBody: value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean) })}
        />
        <Field label="Footer blurb" textarea value={restaurant.footerBlurb} onChange={(value) => update({ footerBlurb: value })} />
        <Field label="Copyright line" value={restaurant.copyright} onChange={(value) => update({ copyright: value })} />
      </div>

      <div className="rounded-2xl border border-line bg-cream p-5">
        <h2 className="font-display text-2xl">Backup</h2>
        <p className="mt-1 text-sm text-muted">Keep a copy of your menu and photos list on your computer.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn btn-ink" onClick={downloadBackup}>
            Download backup
          </button>
          <label className="btn btn-line cursor-pointer">
            Restore backup
            <input type="file" accept="application/json" className="sr-only" onChange={importBackup} />
          </label>
        </div>
      </div>

      <form className="rounded-2xl border border-line bg-cream p-5" onSubmit={savePassword}>
        <h2 className="font-display text-2xl">Change password</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Current password" type="password" value={currentPassword} onChange={setCurrentPassword} />
          <Field label="New password (8+ characters)" type="password" value={nextPassword} onChange={setNextPassword} />
        </div>
        {passwordMessage ? <p className="mt-3 text-sm text-ink">{passwordMessage}</p> : null}
        {passwordError ? <p className="mt-3 text-sm text-tomato">{passwordError}</p> : null}
        <button type="submit" className="btn btn-gold mt-4">
          Update password
        </button>
      </form>
    </section>
  );
}

function ReviewsPanel({ draft, setDraft }) {
  function updateReview(id, patch) {
    setDraft((current) => ({
      ...current,
      testimonials: current.testimonials.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }

  function addReview() {
    setDraft((current) => ({
      ...current,
      testimonials: [
        ...current.testimonials,
        { id: Date.now(), name: "Guest", city: "Mardan", quote: "", rating: 5, dish: "" },
      ],
    }));
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Reviews</h1>
          <p className="mt-1 text-sm text-muted">Replace the sample quotes with real guest comments.</p>
        </div>
        <button type="button" className="btn btn-ink" onClick={addReview}>
          Add review
        </button>
      </div>
      <Field
        label="Note under the heading"
        value={draft.testimonialsNote}
        onChange={(value) => setDraft((current) => ({ ...current, testimonialsNote: value }))}
      />
      <ul className="mt-6 space-y-4">
        {draft.testimonials.map((review) => (
          <li key={review.id} className="grid gap-3 rounded-2xl border border-line bg-cream p-4 md:grid-cols-2">
            <Field label="Name" value={review.name} onChange={(value) => updateReview(review.id, { name: value })} />
            <Field label="City" value={review.city} onChange={(value) => updateReview(review.id, { city: value })} />
            <Field label="Dish" value={review.dish} onChange={(value) => updateReview(review.id, { dish: value })} />
            <Field label="Rating (1–5)" type="number" value={review.rating} onChange={(value) => updateReview(review.id, { rating: Number(value) || 5 })} />
            <div className="md:col-span-2">
              <Field label="Quote" textarea value={review.quote} onChange={(value) => updateReview(review.id, { quote: value })} />
            </div>
            <button
              type="button"
              className="text-left text-sm font-semibold text-tomato"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  testimonials: current.testimonials.filter((item) => item.id !== review.id),
                }))
              }
            >
              Remove review
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function BuilderPanel({ draft, setDraft }) {
  function updateList(key, index, patch) {
    setDraft((current) => ({
      ...current,
      builderOptions: {
        ...current.builderOptions,
        [key]: current.builderOptions[key].map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
      },
    }));
  }

  return (
    <section>
      <h1 className="font-display text-3xl">Builder prices</h1>
      <p className="mt-1 text-sm text-muted">These numbers power the “Build your pizza” ticket.</p>
      {["sizes", "crusts", "sauces", "cheeses", "toppings"].map((key) => (
        <div key={key} className="mt-8">
          <h2 className="font-display text-2xl capitalize">{key}</h2>
          <ul className="mt-3 grid gap-3 md:grid-cols-2">
            {draft.builderOptions[key].map((item, index) => (
              <li key={item.id} className="grid grid-cols-2 gap-3 rounded-2xl border border-line bg-cream p-3">
                <Field label="Label" value={item.label} onChange={(value) => updateList(key, index, { label: value })} />
                <Field label="Price (SEK)" type="number" value={item.price} onChange={(value) => updateList(key, index, { price: Number(value) || 0 })} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function Field({ label, value, onChange, type = "text", textarea = false }) {
  const classes = "mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 outline-none focus:border-gold";
  return (
    <label className="block text-sm font-semibold capitalize">
      {label}
      {textarea ? (
        <textarea rows={4} className={classes} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input type={type} className={classes} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function ImageUpload({ label, value, onChange, upload }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const url = await upload(file);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="text-sm font-semibold">
      {label}
      {value ? <img src={value} alt="" className="mt-2 h-36 w-full rounded-xl object-cover" /> : null}
      <label className="btn btn-line mt-3 w-full cursor-pointer">
        {busy ? "Uploading…" : "Upload photo"}
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={onFile} disabled={busy} />
      </label>
      {error ? <p className="mt-2 font-normal text-tomato">{error}</p> : null}
    </div>
  );
}
