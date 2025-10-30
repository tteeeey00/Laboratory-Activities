import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
      <div className="bg-blue-600 text-white shadow-md flex justify-between items-center px-8 py-6 bg-blue-600">
        <Link to="/" className="text-lg font-semibold flex items-center space-x-2">
          <span role="img" aria-label="note">🗒️</span>
          <span>Notes App</span>
        </Link>

        <div className="flex space-x-4 items-center">
          {!isLoggedIn ? (
            <>
              {location.pathname !== "/login" && (
                <Link to="/login" className="hover:underline">Login</Link>
              )}
              {location.pathname !== "/register" && (
                <Link to="/register" className="hover:underline">Register</Link>
              )}
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-md text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
  );
};

export default Header;
