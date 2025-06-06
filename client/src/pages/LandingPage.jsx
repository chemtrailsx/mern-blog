// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to My Blog</h1>
      <p style={styles.subtitle}>Discover stories, share ideas, and connect.</p>
      <div style={styles.buttonContainer}>
        <Link to="/login" style={styles.button}>Login</Link>
        <Link to="/register" style={styles.buttonOutline}>Register</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#0d1117",
    color: "#c9d1d9",
    minHeight: "100vh",
    padding: "50px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Segoe UI, sans-serif",
    textAlign: "center",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "20px",
    color: "#58a6ff",
  },
  subtitle: {
    fontSize: "1.25rem",
    marginBottom: "40px",
  },
  buttonContainer: {
    display: "flex",
    gap: "20px",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#238636",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
  buttonOutline: {
    padding: "12px 24px",
    border: "2px solid #58a6ff",
    color: "#58a6ff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    transition: "background-color 0.3s, color 0.3s",
  },
};

export default LandingPage;
