import Hero from "../components/Hero";
import FeatureStrip from "../components/FeatureStrip";
import Menu from "../components/Menu";
import AtmosphereBanner from "../components/AtmosphereBanner";
import OfferBanner from "../components/OfferBanner";
import PizzaBuilder from "../components/PizzaBuilder";
import About from "../components/About";
import Services from "../components/Services";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <FeatureStrip />
      <Menu />
      <AtmosphereBanner />
      <OfferBanner />
      <PizzaBuilder />
      <About />
      <Services />
      <Testimonials />
      <Contact />
    </main>
  );
}
