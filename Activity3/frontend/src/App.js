import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Authors from "./pages/Authors";
import Categories from "./pages/Categories";
import Books from "./pages/Books";

function App() {
  const navStyle = {
    backgroundColor: "#1976d2",
    color: "white",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    margin: "0 15px",
    fontWeight: "bold",
  };

  return (
    <Router>
      <div>
        <nav style={navStyle}>
          <h1>📚 My Bookshelf</h1>
          <div>
            <Link style={linkStyle} to="/authors">Authors</Link>
            <Link style={linkStyle} to="/categories">Categories</Link>
            <Link style={linkStyle} to="/books">Books</Link>
          </div>
        </nav>

        <div style={{ padding: "30px" }}>
          <Routes>
            <Route path="/authors" element={<Authors />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/books" element={<Books />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
