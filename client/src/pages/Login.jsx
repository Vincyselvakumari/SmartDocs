import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

    
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.error || "Something went wrong";
      if (msg.includes("Invalid credentials")) {
        setError("Email not registered. Go to ");
      } else {
        setError(msg);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form className="login-form"onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email"
            value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password"
            value={formData.password} onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
        {error && (
          <p className="error-msg">
            {error}
            {error.includes("Email not registered") && <Link to="/register">Register</Link>}
          </p>
        )}
        <p className="small-text">New user? <Link to="/register" className="link">Sign up here</Link></p>
      </div>
    </div>
  );
};

export default Login;