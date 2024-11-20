import React, { useState, useEffect } from 'react';
import './ScrollUpButton.css';
 
const ScrollUpButton = () => {
  const [isVisible, setIsVisible] = useState(false);
 
  useEffect(() => {
    const scrollUp = () => {
      if (window.scrollY >= 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
 
    window.addEventListener('scroll', scrollUp);
 
    return () => {
      window.removeEventListener('scroll', scrollUp);
    };
  }, []);
 
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
 
  return (
    <div>
      {isVisible && (
        <button className="scrollup" onClick={scrollToTop}>
          <i className="bx bx-chevrons-up"></i>
        </button>
      )}
    </div>
  );
};
 
export default ScrollUpButton;