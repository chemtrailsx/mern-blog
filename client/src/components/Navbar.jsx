import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaPenNib, FaUserCircle, FaHome } from "react-icons/fa";

function Navbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const styles = {
    navbar: {
      backgroundColor: "#161b22",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      color: "#c9d1d9",
      boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
    },
    left: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      cursor: "pointer",
    },
    logoText: {
      fontSize: "1.6rem",
      fontWeight: "bold",
      color: "#58a6ff",
    },
    links: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
    },
    link: {
      cursor: "pointer",
      fontSize: "1rem",
      color: "#c9d1d9",
      transition: "color 0.2s",
    },
    linkHover: {
      color: "#58a6ff",
    },
    profile: {
      cursor: "pointer",
      color: "#58a6ff",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontWeight: 500,
    },
  };

  return (
    <div style={styles.navbar}>
      {/* Logo + Title */}
      <div style={styles.left} onClick={() => navigate("/")}>
        <FaPenNib size={24} color="#58a6ff" />
        <span style={styles.logoText}>My Blog</span>
      </div>

      {/* Links */}
      <div style={styles.links}>
        <span style={styles.link} onClick={() => navigate("/")}>
          <FaHome style={{ marginRight: "6px" }} />
          Home
        </span>
        <span style={styles.link} onClick={() => navigate("/create")}>
          ✍️ Create Post
        </span>
        <div
          style={styles.profile}
          onClick={() => navigate(user ? "/dashboard" : "/register")}
        >
          <FaUserCircle />
          {user ? user.username : "Register/Login"}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
