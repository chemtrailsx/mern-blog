import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch posts when search or category changes
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let query = [];
        if (selectedCategory !== "all") query.push(`category=${selectedCategory}`);
        if (searchTerm) query.push(`search=${encodeURIComponent(searchTerm)}`);

        const res = await fetch(`http://localhost:5000/api/posts?${query.join("&")}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch posts");

        setFilteredPosts(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
  }, [selectedCategory, searchTerm]);

  // Get all categories on first load
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/posts");
        const data = await res.json();
        setPosts(data);
        const unique = [...new Set(data.map(post => post.category))];
        setCategories(unique);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  const styles = {
    container: {
      backgroundColor: "#0d1117",
      color: "#c9d1d9",
      minHeight: "100vh",
      padding: "30px 50px",
      fontFamily: "Segoe UI, sans-serif",
    },
    title: {
      fontSize: "2.2rem",
      marginBottom: "20px",
      color: "#58a6ff",
      textAlign: "center",
    },
    filterContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "20px",
      gap: "15px",
    },
    searchInput: {
      padding: "10px",
      width: "100%",
      maxWidth: "400px",
      borderRadius: "6px",
      border: "1px solid #30363d",
      backgroundColor: "#161b22",
      color: "#c9d1d9",
      outline: "none",
      fontSize: "0.9rem",
    },
    filterSelect: {
      backgroundColor: "#21262d",
      color: "#c9d1d9",
      border: "1px solid #30363d",
      borderRadius: "6px",
      padding: "8px 12px",
      fontSize: "0.9rem",
      outline: "none",
      cursor: "pointer",
      transition: "border-color 0.2s ease",
    },
    resultsCount: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#8b949e",
      fontSize: "0.9rem",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "20px",
    },
    card: {
      backgroundColor: "#161b22",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
      cursor: "pointer",
      transition: "transform 0.2s ease",
    },
    postTitle: {
      color: "#58a6ff",
      fontSize: "1.4rem",
      marginBottom: "10px",
    },
    category: {
      fontStyle: "italic",
      color: "#8b949e",
      fontSize: "0.85rem",
    },
    noResults: {
      textAlign: "center",
      color: "#8b949e",
      fontSize: "1.1rem",
      marginTop: "40px",
    },
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>Explore All Blogs</h1>

        <div style={styles.filterContainer}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {filteredPosts.length > 0 && (
          <div style={styles.resultsCount}>
            Showing {filteredPosts.length} posts
            {selectedCategory !== "all" && ` in "${selectedCategory}"`}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        )}

        <div style={styles.grid}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post._id}
                style={styles.card}
                onClick={() => navigate(`/post/${post._id}`)}
              >
                <h2 style={styles.postTitle}>{post.title}</h2>
                <p>{post.content.slice(0, 120)}...</p>
                <div style={styles.category}>Category: {post.category}</div>
              </div>
            ))
          ) : (
            <div style={styles.noResults}>
              No posts found {selectedCategory !== "all" && `in "${selectedCategory}"`}{" "}
              {searchTerm && `matching "${searchTerm}"`}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
