import React, { useState } from "react";
import EVFAQData from "./EVFAQData.json";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
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
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
          <p className="strawberry-no-results">No FAQs found matching your search.</p>
        )}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                currentPage === 1 ? "text-gray-400" : "text-indigo-600 hover:bg-gray-50"
              }`}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 text-sm font-semibold ${
                  page === currentPage
                    ? "bg-indigo-600 text-white"
                    : "text-gray-900 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                currentPage === totalPages ? "text-gray-400" : "text-indigo-600 hover:bg-gray-50"
              }`}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default EVFAQ;
