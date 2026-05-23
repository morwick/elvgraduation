import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { signIn, useSession } from "../lib/auth.js";
import { isSupabaseConfigured } from "../lib/supabase.js";

export default function Login() {
  const { session, loading } = useSession();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <div className="adm-login"><div className="adm-login-card">Memuat…</div></div>;
  if (session) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signIn(email, password);
      nav("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Gagal masuk.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <div className="adm-brand">ELV <em>graduation</em></div>
        <h1 className="adm-h">Masuk <em>admin</em></h1>
        <p className="adm-sub">Kelola seluruh konten situs ELV.GRADUATION.</p>

        {!isSupabaseConfigured && (
          <div className="adm-error">
            Supabase belum dikonfigurasi. Buat file <code>.env</code> dengan
            <code> VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code>,
            lalu restart dev server.
          </div>
        )}

        {error && <div className="adm-error">{error}</div>}

        <form onSubmit={submit}>
          <div className="adm-row">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="adm-row">
            <label>Password</label>
            <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          <button className="adm-btn primary" type="submit" disabled={busy || !isSupabaseConfigured} style={{width:"100%",justifyContent:"center"}}>
            {busy ? "Masuk…" : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
