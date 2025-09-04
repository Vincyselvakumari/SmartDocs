import "./Home.css"; 
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
     <div className="contents"> <h1>Welcome to SmartDocs</h1>
      <p>Your AI Powered Knowledge Hub</p>
      <Link to="/register" className="btn-start">Get Started</Link></div>
    </div>
  );
};

export default Home;