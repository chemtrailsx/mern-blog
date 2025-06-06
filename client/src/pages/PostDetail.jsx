import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch post");
        setPost(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPost();
  }, [id]);

  const styles = {
    container: {
      backgroundColor: "#0d1117",
      color: "#c9d1d9",
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "Segoe UI, sans-serif",
    },
    backBtn: {
      backgroundColor: "#21262d",
      color: "#58a6ff",
      border: "none",
      borderRadius: "5px",
      padding: "10px 15px",
      marginBottom: "20px",
      cursor: "pointer",
    },
    card: {
      backgroundColor: "#161b22",
      borderRadius: "10px",
      padding: "25px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    },
    title: {
      color: "#58a6ff",
    },
    content: {
      marginTop: "15px",
      lineHeight: "1.6",
    },
  };

  if (!post) return <div style={styles.container}>Loading...</div>;

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div style={styles.card}>
        <h1 style={styles.title}>{post.title}</h1>
        <p style={styles.content}>{post.content}</p>
        <small>Category: {post.category}</small>
      </div>
    </div>
  );
}

export default PostDetail;
