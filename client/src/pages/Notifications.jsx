import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Notifications() {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data);
    };

    fetchNotifications();
  }, [token]);

  const styles = {
    container: {
      backgroundColor: "#0d1117",
      minHeight: "100vh",
      padding: "30px",
      color: "#c9d1d9",
      fontFamily: "Segoe UI, sans-serif",
    },
    notification: {
      backgroundColor: "#161b22",
      color: "#c9d1d9",
      margin: "10px 0",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    },
    empty: {
      marginTop: "20px",
      color: "#8b949e",
    },
  };

  return (
    <div style={styles.container}>
      <h2>🔔 Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map((n, idx) => (
          <div key={idx} style={styles.notification}>
            {n.message}
          </div>
        ))
      ) : (
        <p style={styles.empty}>No notifications yet.</p>
      )}
    </div>
  );
}

export default Notifications;
