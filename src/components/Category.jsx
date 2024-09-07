import React, { useState, useEffect } from "react";
import "../css/Category.css";

const Category = ({ categories, onButtonClick }) => {
  const [showCategory, setShowCategory] = useState(false);
  // Set selectedCategory to the first category from the list by default
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(categories)[0] || null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowCategory(true);
      } else {
        setShowCategory(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Optionally update selectedCategory if categories change
    if (categories && Object.keys(categories).length > 0) {
      setSelectedCategory(Object.keys(categories)[0]);
    }
  }, [categories]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onButtonClick(category);  // Pass selected category
  };

  return (
    <div className="cont-div">
      <div className={`category ${showCategory ? 'show' : ''}`}>
        {Object.keys(categories).map((category, index) => (
          <button
            key={index}
            className={`category-button ${
              selectedCategory === category ? "selected" : ""
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Category;
