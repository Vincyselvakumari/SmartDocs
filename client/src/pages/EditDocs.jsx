import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./AddDoc.css"; 

const EditDoc = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/docs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}`},
        });
        setFormData({ title: res.data.title, content: res.data.content });
      } catch (err) {
        setError("Failed to load document");
      }
    };
    fetchDoc();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting update:", formData); // 👈 check values
  try {
    await axios.put(`http://localhost:5000/api/docs/${id}`, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`},
    });
    navigate("/dashboard");
  } catch (err) {
    setError("Update failed: " + (err.response?.data?.error || err.message));
  }
};

  return (
    <div className="doc-full">
      <div className="adddoc-container">
        <h2 className="add-doc-title">Edit Document</h2>
        <form onSubmit={handleSubmit} className="adddoc-form">
          <input
            type="text"
            name="title"
            placeholder="Document Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="content"
            placeholder="Enter content here..."
            value={formData.content}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Update Document</button>
        </form>
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
};

export default EditDoc;