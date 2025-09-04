import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddDoc.css";

const AddDoc = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://localhost:5000/api/docs", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="doc-full"><div className="adddoc-container">
      <h2 className="add-doc-title">Add New Document</h2>
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
        <button type="submit">Save Document</button>
      </form>
      {error && <p className="error-msg">{error}</p>}
    </div></div>
  );
};

export default AddDoc;