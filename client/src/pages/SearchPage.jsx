import React, { useState } from "react";
import axios from "axios";
import "./SearchPage.css";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/docs/search",
        { query },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`},
        }
      );
      setResults(res.data);
    } catch (err) {
      setError("Search failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h2>Semantic Search</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search documents..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p className="info-msg">Searching...</p>}
      {error && <p className="error-msg">{error}</p>}

      <div className="search-results">
        {results.length === 0 && !loading ? (
          <p className="info-msg">No results yet. Try searching!</p>
        ) : (
          results.map((doc) => (
            <div key={doc._id} className="result-card">
              <h3>{doc.title}</h3>
              {doc.summary && (
                <p>
                  <strong>Summary:</strong> {doc.summary}
                </p>
              )}
              <p>
                <strong>Author:</strong> {doc.createdBy?.name || "Unknown"}
              </p>
              {doc.tags?.length > 0 && (
                <div className="tags">
                  {doc.tags.map((tag, idx) => (
                    <span key={idx} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPage;