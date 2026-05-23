import { useState } from "react";
import { useReveal } from "./hooks/useReveal.js";
import { useParallax } from "./hooks/useParallax.js";

import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Marquee from "./components/Marquee.jsx";
import Services from "./components/Services.jsx";
import Portfolio from "./components/Portfolio.jsx";
import About from "./components/About.jsx";
import Process from "./components/Process.jsx";
import Testimonials from "./components/Testimonials.jsx";
import Booking from "./components/Booking.jsx";
import Footer from "./components/Footer.jsx";
import Lightbox from "./components/Lightbox.jsx";
import WhatsAppFAB from "./components/WhatsAppFAB.jsx";

export default function PublicSite() {
  const [lbItem, setLbItem] = useState(null);

  useReveal();
  useParallax();

  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <Services />
      <Portfolio onOpen={setLbItem} />
      <About />
      <Process />
      <Testimonials />
      <Booking />
      <Footer />

      <Lightbox item={lbItem} onClose={() => setLbItem(null)} />
      <WhatsAppFAB />
    </>
  );
}
