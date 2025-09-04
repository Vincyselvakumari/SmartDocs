import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./dashboard.css";
import SearchBox from "../Components/SearchBox"; 
import QABox from "../Components/QABox";

const Dashboard = () => {
  const [docs, setDocs] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/docs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}`},
        });
        setDocs(res.data);
      } catch (err) {
        console.error("Error fetching docs:", err);
      }
    };
    fetchDocs();
  }, [location.key]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/docs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`},
      });
      setDocs(docs.filter((doc) => doc._id !== id));
    } catch (err) {
      console.error("Error deleting doc:", err.response?.data || err.message);
    }
  };

  const handleSearchResults = (results) => {
    setDocs(results);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-wrapper">
        <h1 className="dashboard-title">Your Documents</h1>

        <SearchBox onResults={handleSearchResults} />
        <QABox/>

        <Link to="/add-doc" className="btn-add">
          <span> + Add Document</span>
        </Link>

        <div className="document-grid">
          {docs.length === 0 ? (
            <p className="no-docs">No documents yet. Add one!</p>
          ) : (
            docs.map((doc) => (
              <div key={doc._id} className="document-card">
                <h3 className="document-title">{doc.title}</h3>
                {doc.summary && (
                  <p className="document-summary">
                    <strong>Summary:</strong> {doc.summary}
                  </p>
                )}
                <p className="document-author">
                  <strong>Author:</strong> {doc.createdBy?.name || "Unknown"}
                </p>
                {doc.tags?.length > 0 && (
                  <div className="document-tags">
                    {doc.tags.map((tag, idx) => (
                      <span key={idx} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="document-actions">
                  <Link to={`/edit/${doc._id}`} className="btn btn-edit">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="btn btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;