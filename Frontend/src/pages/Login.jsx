import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { authApi } from "../services/movieService.js";
import { ROLES } from "../utils/constants.js";

export default function Login() {
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "Student User",
    email: "user@cineverse.test",
    password: "password",
    role: ROLES.USER,
  });

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        login(form.email, form.password);
      } else {
        register(form);
      }
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  function quickLogin(email) {
    setError("");
    try {
      login(email, "password");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  function resetDemo() {
    authApi.resetDemoData();
    window.location.href = "/login";
  }

  return (
    <section className="login-page">
      <div className="login-visual">
        <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80" alt="Cinema seats" />
        <div>
          <p>Movie discovery, reviews, shows, and seat booking in learning project.</p>
        </div>
      </div>
      <form className="auth-panel" onSubmit={submit}>
        <div>
          <p className="eyebrow">CineVerse Access</p>
          <h1>{mode === "login" ? "Sign in" : "Create account"}</h1>
          {isAuthenticated && <p className="notice">You are already signed in. Use the dashboard link in the navigation bar.</p>}
        </div>
        {mode === "register" && (
          <label>
            Name
            <input name="name" value={form.name} onChange={updateField} required />
          </label>
        )}
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={updateField} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={updateField} required minLength={6} />
        </label>
        {mode === "register" && (
          <label>
            Role
            <select name="role" value={form.role} onChange={updateField}>
              <option value={ROLES.USER}>User</option>
              <option value={ROLES.THEATRE_OWNER}>Theatre Owner</option>
              <option value={ROLES.ADMIN}>Admin</option>
            </select>
          </label>
        )}
        {error && <p className="error">{error}</p>}
        <Button type="submit">{mode === "login" ? "Login" : "Register"}</Button>
        <Button type="button" variant="ghost" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Need an account?" : "Already registered?"}
        </Button>
        <div className="quick-logins">
          <span>Demo accounts</span>
          <button type="button" onClick={() => quickLogin("user@cineverse.test")}>User</button>
          <button type="button" onClick={() => quickLogin("owner@cineverse.test")}>Owner</button>
          <button type="button" onClick={() => quickLogin("admin@cineverse.test")}>Admin</button>
        </div>
        <button className="reset-link" type="button" onClick={resetDemo}>
          Reset demo data
        </button>
      </form>
    </section>
  );
}
