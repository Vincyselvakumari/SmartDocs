
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; 
import "./Register.css"; 

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState(""); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
     
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      const msg = err.response?.data?.error || "Account already exists";

      if (msg.includes("already")) {
        setError("Email already exists. Already a user?");
      } else {
        setError(msg);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>

       
        {error && (
          <p className="error-msg">
            {error}{" "}
            {error.includes("Already") && <Link to="/login">Login here</Link>}
          </p>
        )}
        <p className="small-text">
          Already a user? <Link to="/login" className="link">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;