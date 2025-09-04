import React, { useState } from "react";
import axios from "axios";
import "./SearchBox.css";

const SearchBox = ({ onResults }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/docs/search",
        { query },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}`},
        }
      );
      onResults(res.data); 
    } catch (err) {
      console.error("Search error:", err.response?.data || err.message);
      onResults([]); 
    }
    setLoading(false);
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Search documents..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
};

export default SearchBox;