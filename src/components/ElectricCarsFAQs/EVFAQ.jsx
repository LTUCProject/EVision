import React, { useState } from "react";
import EVFAQData from "./EVFAQData.json";
import "./EVFAQ.css";

const EVFAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter FAQs based on search input in both question and answer
  const filteredFAQs = EVFAQData.filter((faq) =>
    `${faq.question} ${faq.answer}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredFAQs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredFAQs.slice(startIndex, startIndex + itemsPerPage);

  // Handle Page Change
const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  

  return (
    <div className="banana-container">
      <h1 className="apple-title">EV FAQs</h1>
      <div className="orange-search-box">
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pear-search-input"
        />
      </div>
      <div className="grid-container">
        {currentItems.length > 0 ? (
          currentItems.map((faq, index) => (
            <div key={index} className="grape-faq-card">
              {faq.image && (
                <img
                  src={faq.image}
                  alt={faq.question}
                  className="pineapple-image"
                />
              )}
              <h3 className="cherry-question">{faq.question}</h3>
              <p className="lemon-answer">{faq.answer}</p>
            </div>
          ))
        ) : (
          <p className="strawberry-no-results">
            No FAQs found matching your search.
          </p>
        )}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`page-button ${
                page === currentPage ? "active" : ""
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EVFAQ;
