import React from "react";

const Navbar: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-semibold tracking-wide">🗒️ Notes App</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition-colors"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
