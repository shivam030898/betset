import React, { useEffect, useState } from "react";
import YesTileDialog from "./TileDialog";
import NoTileDialog from "./NoTileDialog";
import "../css/Tiles.css";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import sports from "../components/assests/sports.jpg";
import election from "../components/assests/Politics.jpg";
import GeoImage from "../components/assests/Geo.jpg";
import movies from "../components/assests/movies.jpg";
import crypto from "../components/assests/crypto.jpg";
import Olympics from "../components/assests/Olympic.jpg"

const Tiles = ({
  result_date,
  end_date,
  description,
  marketId,
  selectedCategory,
}) => {
  const [isYesDialogOpen, setYesDialogOpen] = useState(false);
  const [isNoDialogOpen, setNoDialogOpen] = useState(false);
  const [totalBets, setTotalBets] = useState(0);

  const isEndDatePassed = (endDate) => {
    if (!endDate) return false;
    const currentDate = new Date();
    const formattedEndDate = new Date(endDate);
    return currentDate > formattedEndDate;
  };

  const endDatePassed = isEndDatePassed(end_date);

  useEffect(() => {
    const fetchTotalBets = async () => {
      try {
        const response = await fetch(
          `https://test42069-90c2e7951a82.herokuapp.com/bets/market/${marketId}/total-bet-amount`
        );
        const data = await response.json();
        setTotalBets(data.totalAmount);
      } catch (error) {
        console.error("Error fetching total bets:", error);
      }
    };

    fetchTotalBets();
  }, [marketId]);

  const openYesDialog = () => setYesDialogOpen(true);
  const closeYesDialog = () => setYesDialogOpen(false);

  const openNoDialog = () => setNoDialogOpen(true);
  const closeNoDialog = () => setNoDialogOpen(false);

  // Function to format total bets in millions if large
  const formatTotalBets = (total) => {
    const valueInEth = parseFloat(total) / 1e18; // Convert to Ether
    if (valueInEth >= 1e6) {
      return `${(valueInEth / 1e6).toFixed(2)}M`; // Convert to millions
    }
    return valueInEth.toFixed(2); // Otherwise, show 2 decimal places
  };

  const displayTotalBets = formatTotalBets(totalBets);

  const trimFirstWord = (text) => {
    const words = text.split(" ");
    return words.slice(1).join(" ");
  };

  const trimmedDescription = trimFirstWord(description);

  const categoryImages = {
    sports: sports,
    movies: movies,
    crypto: crypto,
    election: election,
    geopolitics: GeoImage,
    olympics:Olympics
  };

  const tileImage = categoryImages[selectedCategory];

  return (
    <>
      <div className={`tile ${endDatePassed ? "not-biddable" : ""}`}>
        {endDatePassed && (
          <div className="overlay">
            <span>Market not biddable</span>
          </div>
        )}
        <div className="tile-content">
          <div className="tileimg-div">
            <img src={tileImage} alt={selectedCategory} />    
          </div>
          <h2>{trimmedDescription}</h2>
          <div className="button-group">
            <button
              className="yes-button"
              onClick={openYesDialog}
              disabled={endDatePassed}
            >
              Yes
            </button>
            <button
              className="no-button"
              onClick={openNoDialog}
              disabled={endDatePassed}
            >
              No
            </button>
          </div>
          <div className="misc">
            <div className="tooltip">
              <SavingsOutlinedIcon style={{ color: "#4a90e2" }} />
              <span className="tooltiptext bg-black text-white p-2 rounded">
                Total Bets
              </span>
              <p>{displayTotalBets}</p>
            </div>
            <div className="tooltip">
              <QueryBuilderIcon style={{ color: "#4a90e2" }} />
              <span className="tooltiptext bg-black text-white p-2 rounded">
                End Date
              </span>
              <p>{new Date(result_date).toLocaleDateString()}</p>
            </div>
            <div className="tooltip">
              <EmojiEventsOutlinedIcon style={{ color: "#4a90e2" }} />
              <span className="tooltiptext bg-black text-white p-2 rounded">
                Result Date
              </span>
              <p>{new Date(result_date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      <YesTileDialog
        isOpen={isYesDialogOpen}
        onClose={closeYesDialog}
        description={description}
        marketId={marketId}
        end_date={end_date}
        result_date={result_date}
      />
      <NoTileDialog
        isOpen={isNoDialogOpen}
        onClose={closeNoDialog}
        description={description}
        marketId={marketId}
        end_date={end_date}
        result_date={result_date}
      />
    </>
  );
};

export default Tiles;
