import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaPenNib, FaUserCircle, FaHome, FaBell } from "react-icons/fa";

function Navbar() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token) return;

    const fetchUnread = async () => {
      const res = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const unread = data.filter((n) => !n.read).length;
      setUnreadCount(unread);
    };

    fetchUnread();
  }, [token]);

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
    },
    profile: {
      cursor: "pointer",
      color: "#58a6ff",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontWeight: 500,
    },
    bellContainer: {
      position: "relative",
      cursor: "pointer",
    },
    bell: {
      fontSize: "1.2rem",
      color: "#c9d1d9",
    },
    badge: {
      position: "absolute",
      top: "-5px",
      right: "-5px",
      backgroundColor: "red",
      color: "white",
      borderRadius: "50%",
      padding: "2px 6px",
      fontSize: "0.7rem",
    },
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.left} onClick={() => navigate("/")}>
        <FaPenNib size={24} color="#58a6ff" />
        <span style={styles.logoText}>My Blog</span>
      </div>

      <div style={styles.links}>
        <span style={styles.link} onClick={() => navigate("/")}>
          <FaHome style={{ marginRight: "6px" }} />
          Home
        </span>
        <span style={styles.link} onClick={() => navigate("/create")}>
          ✍️ Create Post
        </span>

        <div style={styles.bellContainer} onClick={() => navigate("/notifications")}>
          <FaBell style={styles.bell} title="Notifications" />
          {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
        </div>

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
