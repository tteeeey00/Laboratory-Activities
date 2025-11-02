import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Authors() {
  const [name, setName] = useState("");
  const [authors, setAuthors] = useState([]);
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const res = await axios.get("http://localhost:5004/authors");
      setAuthors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addAuthor = async () => {
    if (!name.trim()) {
      setMessage("⚠️ Please input first!");
      return;
    }
    try {
      await axios.post("http://localhost:5004/authors", { name });
      setName("");
      setMessage("");
      fetchAuthors();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAuthor = async (id) => {
    try {
      await axios.delete(`http://localhost:5004/authors/${id}`);
      fetchAuthors();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (id, currentName) => {
    setEditId(id);
    setEditName(currentName);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) return;
    try {
      await axios.patch(`http://localhost:5004/authors/${id}`, { name: editName });
      setEditId(null);
      setEditName("");
      fetchAuthors();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px 20px",
        gap: "20px",
      }}
    >
      {/* Add Author Section */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "280px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "8px" }}>👤</div>
        <h2 style={{ marginBottom: "15px", fontSize: "18px", color: "#333" }}>
          Add Author
        </h2>
        <input
          type="text"
          placeholder="Enter author name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "10px",
            fontSize: "14px",
            textAlign: "center",
          }}
        />
        <button
          onClick={addAuthor}
          style={{
            width: "100%",
            padding: "8px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Add Author
        </button>
        {message && (
          <p style={{ color: "red", marginTop: "8px", fontWeight: "500" }}>
            {message}
          </p>
        )}
      </div>

      {/* Author List Section */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "350px",
        }}
      >
        <h3
          style={{
            marginBottom: "12px",
            color: "#333",
            fontSize: "18px",
            textAlign: "center",
          }}
        >
          👥 Author List
        </h3>
        {authors.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              fontSize: "15px",
              color: "#888",
              padding: "25px 10px",
              border: "2px dashed #ddd",
              borderRadius: "8px",
            }}
          >
            👤 No authors yet
          </div>
        ) : (
          authors.map((a) => (
            <div
              key={a._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "14px",
                marginBottom: "8px",
                padding: "8px",
                border: "1px solid #eee",
                borderRadius: "8px",
                backgroundColor: "#fafafa",
              }}
            >
              {editId === a._id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{
                      flexGrow: 1,
                      marginRight: "8px",
                      padding: "4px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      fontSize: "13px",
                    }}
                  />
                  <div>
                    <button
                      onClick={() => saveEdit(a._id)}
                      style={{
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "4px 6px",
                        cursor: "pointer",
                        fontSize: "12px",
                        marginRight: "5px",
                      }}
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "4px 6px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      ✖ Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span>👤 {a.name}</span>
                  <div>
                    <button
                      onClick={() => startEdit(a._id, a.name)}
                      style={{
                        backgroundColor: "#ffc107",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "4px 6px",
                        cursor: "pointer",
                        fontSize: "12px",
                        marginRight: "5px",
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteAuthor(a._id)}
                      style={{
                        backgroundColor: "#e74c3c",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "4px 6px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
