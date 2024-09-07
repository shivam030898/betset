import React, { useContext, useEffect, useState } from "react";
import { WalletContext } from "./WalletContext";
import "../css/Mybets.css";
import NoImage from "../components/assests/404.avif";

const MyBets = () => {
  const { walletAddress } = useContext(WalletContext);
  const [bets, setBets] = useState([]);
  const [marketDetails, setMarketDetails] = useState({});
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await fetch(
          `https://test42069-90c2e7951a82.herokuapp.com/bets/bettor/${walletAddress}`
        );
        const result = await response.json();
        console.log("Bets API response:", result);
        if (Array.isArray(result.data)) {
          setBets(result.data);
        } else {
          console.error("API response does not contain an array:", result);
        }
      } catch (error) {
        console.error("Error fetching bets:", error);
      }
    };

    if (walletAddress) {
      fetchBets();
    }
  }, [walletAddress]);

  useEffect(() => {
    const fetchMarketDetails = async (marketId) => {
      try {
        const response = await fetch(
          `https://test42069-90c2e7951a82.herokuapp.com/markets/id/${marketId}`
        );
        const result = await response.json();
        console.log(`Market details for ${marketId}:`, result);
        if (result && result.data && result.data.length > 0) {
          setMarketDetails((prevDetails) => ({
            ...prevDetails,
            [marketId]: result.data[0], // Store the object directly
          }));
        } else {
          console.error(`No data found for market ${marketId}:`, result);
        }
      } catch (error) {
        console.error(`Error fetching details for market ${marketId}:`, error);
      }
    };

    bets.forEach((bet) => {
      if (!marketDetails[bet.market_id]) {
        fetchMarketDetails(bet.market_id);
      }
    });
  }, [bets]);

  const formatAmount = (amount) => {
    const amountStr = amount.toString();
    if (amountStr.length > 18) {
      return (
        amountStr.slice(0, -18) + "." + amountStr.slice(-18).replace(/0+$/, "")
      );
    }
    return amountStr;
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredBets = bets.filter((bet) => {
    const description = marketDetails[bet.market_id]?.description || "";
    return description.toLowerCase().includes(searchInput.toLowerCase());
  });

  const highlightMatch = (text, search) => {
    if (!search) return text;
    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const formatDate = (dateString) => {
    return dateString ? dateString.split("T")[0] : "Loading...";
  };

  return (
    <div className="mybets-container">
      <h1>My Bets</h1>
      <input
        type="text"
        placeholder="Search descriptions..."
        value={searchInput}
        onChange={handleSearchChange}
        className="search-bar"
      />
      {console.log("Market Details State:", marketDetails)}
      <div className="tile-container">
        {filteredBets.length > 0 ? (
          filteredBets.map((bet) => (
            <div
              key={bet.id}
              className={`my-bet-tile ${
                bet.bet_on_yes ? "bet-on-yes" : "bet-on-no"
              }`}
            >
              <h2>
                {highlightMatch(
                  marketDetails[bet.market_id]?.description || "Loading...",
                  searchInput
                )}
              </h2>
              <h4>Bet Amount: {formatAmount(bet.amount)}</h4>
              <p
                className={`bet-on ${
                  bet.bet_on_yes ? "bet-on-yes" : "bet-on-no"
                }`}
              >
                Bet On: {bet.bet_on_yes ? "Yes" : "No"}
              </p>
              <h5>
                End Date: {formatDate(marketDetails[bet.market_id]?.end_date)}
              </h5>
              <h5>
                Result Date:{" "}
                {formatDate(marketDetails[bet.market_id]?.result_date)}
              </h5>
            </div>
          ))
        ) : (
          <div className="no-bets-container">
            <img src={NoImage} alt="No Bets" className="no-bets-image" />
            <p className="para">No bets found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBets;
