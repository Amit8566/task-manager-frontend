
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckSquare, ArrowRight } from "lucide-react";
import { loginUser } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
     const data = await loginUser(form);
const token = data.result?.token || data.token || data.data?.token;

if (!token) {
  throw new Error("Login succeeded, but no token was returned by the server.");
}

localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(data.result || data.data?.user || data.user || {}));

navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to log in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="brand">
          <span className="brand-icon"><CheckSquare size={23} /></span>
          TaskFlow
        </div>

        <div className="visual-content">
          <span className="eyebrow">WORK SMARTER, NOT HARDER</span>
          <h1>Make every task<br />count.</h1>
          <p>
            Organize your work, collaborate with your team, and
            turn your plans into progress.
          </p>

          <div className="visual-card">
            <div className="visual-card-top">
              <span className="mini-check">✓</span>
              <span>Weekly goals</span>
              <span className="goal-percent">75%</span>
            </div>
            <div className="progress-track">
              <div className="progress-value" />
            </div>
            <p className="visual-caption">You're making great progress!</p>
          </div>
        </div>

        <p className="visual-footer">Plan better. Achieve more.</p>
      </section>

      <section className="auth-panel">
        <div className="auth-form-wrap">
          <div className="mobile-brand">
            <span className="brand-icon"><CheckSquare size={22} /></span>
            TaskFlow
          </div>

          <span className="form-kicker">WELCOME BACK</span>
          <h2>Sign in to your account</h2>
          <p className="form-subtitle">
            Enter your details to continue to your dashboard.
          </p>

          {error && <div className="form-error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div className="password-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create account</Link>
          </p>

          <p className="form-terms">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  );
}
