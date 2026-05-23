import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContentProvider } from "./context/ContentContext.jsx";

import PublicSite from "./PublicSite.jsx";

import Login from "./admin/Login.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import Bookings from "./admin/Bookings.jsx";
import SiteSettings from "./admin/SiteSettings.jsx";
import Packages from "./admin/Packages.jsx";
import Portfolio from "./admin/Portfolio.jsx";
import Categories from "./admin/Categories.jsx";
import ProcessSteps from "./admin/ProcessSteps.jsx";
import Testimonials from "./admin/Testimonials.jsx";
import Stats from "./admin/Stats.jsx";
import Marquee from "./admin/Marquee.jsx";
import NavLinks from "./admin/NavLinks.jsx";

import "./admin/admin.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ContentProvider>
              <PublicSite />
            </ContentProvider>
          }
        />

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="bookings"     element={<Bookings />} />
          <Route path="site"         element={<SiteSettings />} />
          <Route path="packages"     element={<Packages />} />
          <Route path="portfolio"    element={<Portfolio />} />
          <Route path="categories"   element={<Categories />} />
          <Route path="process"      element={<ProcessSteps />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="stats"        element={<Stats />} />
          <Route path="marquee"      element={<Marquee />} />
          <Route path="nav"          element={<NavLinks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
