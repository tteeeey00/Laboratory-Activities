import React from "react";
import AuthorPage from "./components/AuthorPage";
import CategoryPage from "./components/CategoryPage";
import BookPage from "./components/BookPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-700">📚 Bookshelf Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <AuthorPage />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <CategoryPage />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <BookPage />
        </div>
      </div>
    </div>
  );
}
