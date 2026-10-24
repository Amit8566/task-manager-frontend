
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckSquare, ArrowRight } from "lucide-react";
import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/login", {
        replace: true,
        state: { message: "Account created successfully. Please sign in." },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create your account. Please try again."
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
          <span className="eyebrow">YOUR WORK, IN SYNC</span>
          <h1>Great work<br />starts here.</h1>
          <p>
            Bring your tasks together, set priorities, and make
            teamwork feel effortless.
          </p>

          <div className="visual-card">
            <div className="sample-task">
              <span className="sample-task-check">✓</span>
              <div>
                <strong>Plan your next project</strong>
                <small>Stay focused on what matters</small>
              </div>
            </div>
            <div className="sample-task">
              <span className="sample-task-check">✓</span>
              <div>
                <strong>Collaborate with your team</strong>
                <small>Make progress together</small>
              </div>
            </div>
          </div>
        </div>

        <p className="visual-footer">One workspace. More possibilities.</p>
      </section>

      <section className="auth-panel">
        <div className="auth-form-wrap register-form">
          <div className="mobile-brand">
            <span className="brand-icon"><CheckSquare size={22} /></span>
            TaskFlow
          </div>

          <span className="form-kicker">GET STARTED FOR FREE</span>
          <h2>Create your account</h2>
          <p className="form-subtitle">
            A few details and you're ready to organize your work.
          </p>

          {error && <div className="form-error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="register-name">Full name</label>
              <input
                id="register-name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                maxLength={80}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-email">Email address</label>
              <input
                id="register-email"
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
              <label htmlFor="register-password">Password</label>
              <div className="password-wrap">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
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

            <div className="form-group">
              <label htmlFor="confirm-password">Confirm password</label>
              <div className="password-wrap">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword
                    ? <EyeOff size={19} />
                    : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          <p className="form-terms">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  );
}
