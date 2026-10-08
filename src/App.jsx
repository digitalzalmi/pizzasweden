import { ContentProvider } from "./context/ContentContext";
import { UiProvider } from "./context/UiContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useT } from "./i18n";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AdminApp from "./admin/AdminApp";

function Storefront() {
  return (
    <UiProvider>
      <SkipLink />
      <Navbar />
      <Home />
      <Footer />
    </UiProvider>
  );
}

function SkipLink() {
  const { t } = useT();
  return (
    <a className="skip-link" href="#main">
      {t("skipLink")}
    </a>
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
