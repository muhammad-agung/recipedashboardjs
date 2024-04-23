import React, { useState } from "react";
import "./Navbar.css";
import { getAuth, signOut } from "firebase/auth";
import { Link as RouterLink } from 'react-router-dom';
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth).then(() => {
        navigate("/signIn", { replace: true });
      });
      
      // Redirect to login or perform any additional actions on logout
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  }

  return (
    <nav>
      <Link to="/" className="title">
        Dashboard
      </Link>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul style={{fontWeight:"bold"}} className={menuOpen ? "open" : ""}>
        <li>
        <Link component={RouterLink} to={`/`}>Recipe List</Link>
        </li>
        <li>
        <Link component={RouterLink} to={`/newrecipe`}>Create New Recipe</Link>
        </li>
        <li>
        <Link component={RouterLink} to={`/category`}>Category</Link>
        </li>
        <li>
          <Link onClick={handleLogout}>Logout</Link>
        </li>
      </ul>
    </nav>
  );
};
