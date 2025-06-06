import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function CreatePost() {
  // const { user } = useContext(AuthContext);
  // const token = user?.token;
  const { user, token } = useContext(AuthContext); // ✅ include token here

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.content || !formData.category) {
      setError("All fields are required");
      return;
    }

    if (!token) {
  setError("Login expired or invalid. Please log in again.");
  return;
}


    const postData = new FormData();
    postData.append("title", formData.title);
    postData.append("content", formData.content);
    postData.append("category", formData.category);
    if (image) postData.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: postData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create post");

      setSuccess("Post created successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create a New Blog Post</h2>
      {error && <p style={{ ...styles.message, color: "#e74c3c" }}>{error}</p>}
      {success && <p style={{ ...styles.message, color: "#2ecc71" }}>{success}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={formData.title}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <textarea
          name="content"
          placeholder="Start writing your post..."
          value={formData.content}
          onChange={handleChange}
          rows={6}
          style={styles.textarea}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category (e.g. Technology, Life, Travel)"
          value={formData.category}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={styles.fileInput}
        />
        {preview && <img src={preview} alt="Preview" style={styles.preview} />}
        <button type="submit" style={styles.button}>Publish Post</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 0 25px rgba(0, 0, 0, 0.05)",
    fontFamily: `"Segoe UI", Tahoma, Geneva, Verdana, sans-serif`,
    color: "#111",
  },
  heading: {
    textAlign: "center",
    fontSize: "28px",
    marginBottom: "25px",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  input: {
    padding: "12px 16px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    backgroundColor: "#f9f9f9",
    transition: "border 0.2s ease",
  },
  textarea: {
    padding: "12px 16px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
    resize: "vertical",
    outline: "none",
    transition: "border 0.2s ease",
  },
  fileInput: {
    fontSize: "16px",
  },
  preview: {
    maxWidth: "100%",
    maxHeight: "250px",
    borderRadius: "10px",
    objectFit: "cover",
    border: "1px solid #ccc",
  },
  button: {
    padding: "14px",
    fontSize: "16px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    letterSpacing: "0.5px",
    transition: "background-color 0.3s ease",
  },
  message: {
    fontSize: "16px",
    textAlign: "center",
    fontWeight: "500",
  },
};

export default CreatePost;
