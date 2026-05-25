import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useSession, signOut } from "../lib/auth.js";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

const ADMIN_TITLES = {
  "/admin":              "Admin · Dashboard",
  "/admin/bookings":     "Admin · Bookings",
  "/admin/site":         "Admin · Site Settings",
  "/admin/packages":     "Admin · Paket",
  "/admin/portfolio":    "Admin · Galeri",
  "/admin/categories":   "Admin · Kategori Galeri",
  "/admin/process":      "Admin · Proses",
  "/admin/testimonials": "Admin · Testimoni",
  "/admin/stats":        "Admin · Statistik",
  "/admin/marquee":      "Admin · Marquee",
  "/admin/nav":          "Admin · Menu Navigasi",
};

export default function AdminLayout() {
  const { session, loading } = useSession();
  const { pathname } = useLocation();
  useDocumentTitle(ADMIN_TITLES[pathname] || "Admin");

  if (loading) {
    return (
      <div className="adm-login">
        <div className="adm-login-card">Memuat sesi…</div>
      </div>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;

  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <div className="adm-brand">ELV <em>graduation</em></div>
        <div className="role">CMS · Admin</div>

        <nav className="adm-nav">
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/bookings">Bookings</NavLink>

          <div className="group-label">Konten</div>
          <NavLink to="/admin/site">Site Settings</NavLink>
          <NavLink to="/admin/packages">Paket</NavLink>
          <NavLink to="/admin/portfolio">Galeri</NavLink>
          <NavLink to="/admin/categories">Kategori Galeri</NavLink>
          <NavLink to="/admin/process">Proses</NavLink>
          <NavLink to="/admin/testimonials">Testimoni</NavLink>
          <NavLink to="/admin/stats">Statistik</NavLink>
          <NavLink to="/admin/marquee">Marquee</NavLink>
          <NavLink to="/admin/nav">Menu Navigasi</NavLink>

          <div className="group-label">Lainnya</div>
          <NavLink to="/" end>Lihat situs ↗</NavLink>
        </nav>

        <button className="signout" onClick={() => signOut().then(()=>location.replace("/admin/login"))}>
          ← Keluar ({session.user.email})
        </button>
      </aside>

      <main className="adm-main">
        <Outlet />
      </main>
    </div>
  );
}
