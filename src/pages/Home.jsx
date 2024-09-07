import React, { useState, useEffect } from "react";
import Category from "../components/Category";
import Tiles from "./Tiles";
import "../css/Category.css";
import YesTileDialog from "./TileDialog";
import TextBar from "../components/TextBar";

const Home = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    heading: "",
    description: "",

  });
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://test42069-90c2e7951a82.herokuapp.com/markets"
        );
        const responseData = await response.json();

        if (!responseData || !Array.isArray(responseData.data)) {
          throw new Error("Invalid data format from API");
        }

        const data = responseData.data;

        const categorizedData = data.reduce((acc, item) => {
          const { category } = item;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push({
            ...item,
            result_date: item.result_date.split("T")[0],
            end_date: item.end_date.split("T")[0],
          });
          return acc;
        }, {});

        setCategories(categorizedData);

        const firstCategory = Object.keys(categorizedData)[0];
        if (firstCategory) {
          setSelectedCategory(firstCategory);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleButtonClick = (category) => {
    setSelectedCategory(category);
  };

  const openDialog = (tile) => {
    setDialogContent(tile);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  // Helper function to check if the tile is biddable
  const isBiddable = (endDate) => {
    const currentDate = new Date();
    const formattedEndDate = new Date(endDate);
    return currentDate <= formattedEndDate;
  };

  return (
    <div className="container">
      <div className="home">
        <TextBar />
        <Category
  categories={categories}
  onButtonClick={handleButtonClick}

/>


        <div className="category-div">
          {categories[selectedCategory]
            ?.sort((a, b) => {
              const aBiddable = isBiddable(a.end_date);
              const bBiddable = isBiddable(b.end_date);

              if (aBiddable && !bBiddable) return -1; // Biddable comes first
              if (!aBiddable && bBiddable) return 1;  // Non-biddable comes last

              // Sort by end date (ascending for biddable, descending for non-biddable)
              if (aBiddable && bBiddable) {
                return new Date(a.end_date) - new Date(b.end_date); // Ascending
              } else {
                return new Date(b.end_date) - new Date(a.end_date); // Descending
              }
            })
            .map((tile, index) => (
              <Tiles
                key={index}
                description={tile.description}
                marketId={tile.market_id}
                end_date={tile.end_date}
                result_date={tile.result_date}
                selectedCategory={selectedCategory}
              />
            ))}
        </div>

        <YesTileDialog
          isOpen={dialogOpen}
          onClose={closeDialog}
          {...dialogContent}
          selectedCategory={selectedCategory} 
        />
      </div>
    </div>
  );
};

export default Home;
