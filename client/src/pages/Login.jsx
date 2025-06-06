import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaLock, FaEnvelope } from "react-icons/fa";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setToken(data.token);

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#0d1117",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#c9d1d9",
      fontFamily: "Segoe UI, sans-serif",
    },
    formBox: {
      backgroundColor: "#161b22",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 0 20px rgba(0,0,0,0.4)",
      width: "100%",
      maxWidth: "400px",
    },
    heading: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#58a6ff",
      fontSize: "1.8rem",
    },
    inputGroup: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#0d1117",
      border: "1px solid #30363d",
      borderRadius: "8px",
      marginBottom: "15px",
      padding: "10px",
    },
    icon: {
      marginRight: "10px",
      color: "#58a6ff",
    },
    input: {
      background: "transparent",
      border: "none",
      outline: "none",
      color: "#c9d1d9",
      width: "100%",
      fontSize: "1rem",
    },
    button: {
      width: "100%",
      backgroundColor: "#238636",
      border: "none",
      padding: "12px",
      borderRadius: "8px",
      color: "#fff",
      fontWeight: "bold",
      cursor: "pointer",
      fontSize: "1rem",
      marginTop: "10px",
    },
    error: {
      color: "#f85149",
      marginBottom: "15px",
      textAlign: "center",
    },
    footerText: {
      textAlign: "center",
      marginTop: "20px",
    },
    link: {
      color: "#58a6ff",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>Login to Your Blog</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <FaEnvelope style={styles.icon} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <FaLock style={styles.icon} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <p style={styles.footerText}>
          Don’t have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;