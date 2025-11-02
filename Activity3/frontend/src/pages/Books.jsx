import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const API_URL = "http://localhost:5004";

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_URL}/books`);
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const fetchAuthors = async () => {
    try {
      const res = await axios.get(`${API_URL}/authors`);
      setAuthors(res.data);
    } catch (err) {
      console.error("Error fetching authors:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const addBook = async () => {
    if (!title || !author || !category) {
      alert("Please fill out all fields before adding a book.");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/books`, {
        title,
        author,
        category,
      });
      setBooks([...books, res.data]);
      setTitle("");
      setAuthor("");
      setCategory("");
    } catch (err) {
      console.error("Error adding book:", err);
      alert("Failed to add book. Check backend or console logs.");
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`${API_URL}/books/${id}`);
      setBooks(books.filter((book) => book._id !== id));
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        padding: "25px",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      {/* LEFT SIDE: ADD BOOK FORM */}
      <div
        style={{
          width: "38%",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "15px",
            fontSize: "20px",
          }}
        >
          📚 Add Book
        </h2>

        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "97%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />

        <select
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          <option value="">Select Author</option>
          {authors.map((a) => (
            <option key={a._id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={addBook}
          style={{
            width: "100%",
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "8px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ➕ Add Book
        </button>
      </div>

      {/* RIGHT SIDE: BOOK LIST */}
      <div
        style={{
          width: "50%",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ fontSize: "20px" }}>📖 Bookshelf</h2>
        {books.length === 0 ? (
          <div style={{ marginTop: "15px", color: "#999" }}>
            <p>No books added yet.</p>
          </div>
        ) : (
          <div style={{ marginTop: "15px" }}>
            {books.map((book) => (
              <div
                key={book._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#d8dddcff",
                  padding: "8px 12px",
                  marginBottom: "8px",
                  borderRadius: "5px",
                  fontSize: "14px",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <p>
                    <strong>Title:</strong> {book.title}
                  </p>
                  <p>
                    <strong>Author:</strong> {book.author}
                  </p>
                  <p>
                    <strong>Category:</strong> {book.category}
                  </p>
                </div>
                <button
                  onClick={() => deleteBook(book._id)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 8px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
