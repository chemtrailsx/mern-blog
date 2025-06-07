import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Notifications() {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const res = await fetch("http://localhost:5000/api/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setNotifications(data);
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const markAllAsRead = async () => {
    await fetch("http://localhost:5000/api/notifications/mark-all-read", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchNotifications(); // Refresh after marking
  };

  const styles = {
    container: {
      backgroundColor: "#0d1117",
      minHeight: "100vh",
      padding: "30px",
      color: "#c9d1d9",
      fontFamily: "Segoe UI, sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    button: {
      backgroundColor: "#238636",
      color: "white",
      border: "none",
      padding: "8px 14px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: 500,
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
      <div style={styles.header}>
        <h2>🔔 Notifications</h2>
        {notifications.length > 0 && (
          <button style={styles.button} onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>
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
