import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user, logout, token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", category: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");

  useEffect(() => {
    if (user?.profilePicture) {
      setProfilePicUrl(`http://localhost:5000/${user.profilePicture}`);
    }
  }, [user]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/posts/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch posts");
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) fetchPosts();
  }, [user, token]);

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setEditForm({ title: post.title, content: post.content, category: post.category });
  };

  const handleSave = async (postId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update post");
      const updated = await res.json();
      setPosts(posts.map((p) => (p._id === postId ? updated : p)));
      setEditingPostId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (postId) => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete post");

      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!profileImage) return alert("Select a file first");

    const formData = new FormData();
    formData.append("profilePic", profileImage);

    try {
      const res = await fetch("http://localhost:5000/api/auth/profile-pic", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const updatedUser = await res.json();
      if (!res.ok) throw new Error(updatedUser.error || "Failed to upload");

      setProfilePicUrl(`http://localhost:5000/${updatedUser.profilePicture}`);
      alert("Profile picture updated!");
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const styles = {
    container: {
      backgroundColor: "#0d1117",
      color: "#c9d1d9",
      minHeight: "100vh",
      padding: "30px",
      fontFamily: "Segoe UI, sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    profileSection: {
      marginBottom: "30px",
      display: "flex",
      alignItems: "center",
      gap: "20px",
    },
    avatar: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid #58a6ff",
    },
    postCard: {
      backgroundColor: "#161b22",
      borderRadius: "10px",
      padding: "20px",
      marginBottom: "15px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#238636",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    editButton: {
      padding: "8px 16px",
      backgroundColor: "#1f6feb",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "10px",
    },
    deleteButton: {
      padding: "8px 16px",
      backgroundColor: "#da3633",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "8px 0",
      backgroundColor: "#0d1117",
      color: "#c9d1d9",
      border: "1px solid #30363d",
      borderRadius: "5px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Dashboard</h2>
        {user && <button onClick={logout} style={styles.button}>Logout</button>}
      </div>

      {user ? (
        <>
          <div style={styles.profileSection}>
            <img
              src={
                profilePicUrl && profilePicUrl !== "http://localhost:5000/"
                  ? profilePicUrl
                  : "https://via.placeholder.com/150"
              }
              alt="Profile"
              style={styles.avatar}
            />
            <div>
              <p><strong>Username:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <input type="file" onChange={handleProfilePicChange} />
              <button style={styles.button} onClick={handleUpload}>Update Picture</button>
            </div>
          </div>

          <h3>Your Posts</h3>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} style={styles.postCard}>
                {editingPostId === post._id ? (
                  <>
                    <input
                      style={styles.input}
                      name="title"
                      value={editForm.title}
                      onChange={handleChange}
                      placeholder="Title"
                    />
                    <textarea
                      style={styles.input}
                      name="content"
                      value={editForm.content}
                      onChange={handleChange}
                      placeholder="Content"
                      rows="4"
                    />
                    <input
                      style={styles.input}
                      name="category"
                      value={editForm.category}
                      onChange={handleChange}
                      placeholder="Category"
                    />
                    <button style={styles.button} onClick={() => handleSave(post._id)}>Save</button>
                  </>
                ) : (
                  <>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <small>Category: {post.category}</small>
                    <br />
                    <button style={styles.editButton} onClick={() => handleEdit(post)}>Edit</button>
                    <button style={styles.deleteButton} onClick={() => handleDelete(post._id)}>Delete</button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>You have not created any posts yet.</p>
          )}
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}

export default Dashboard;
