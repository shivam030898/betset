import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaWallet } from "react-icons/fa";
import { LuCircleDollarSign } from "react-icons/lu";
import { FaBars, FaTimes } from "react-icons/fa";
import compLogo from "./newLogo1.png";
import "../css/Navbar.css";
import ConnectButton from "./ConnectButton";


const Navbar = ({ onMarketDataFetched }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const navRef = useRef();
 
  const showNavbar = () => {
    navRef.current.classList.toggle("active");
  };

  const handleNavigation = (path) => {
    // Close the navbar
    showNavbar();
  };

  const handleWalletConnected = (address) => {
    setWalletAddress(address);
  };

  return (
    <div className="navbar">
      <Link
        to={"/"}
        style={{ textDecoration: "none" }}
        onClick={() => handleNavigation("/")}
      >
        <div className="logo">
          <img src={compLogo} alt="Logo" />
        </div>
      </Link>
      <div ref={navRef} className="nav-buttons">
        <FaTimes className="close-icon" onClick={showNavbar} />

        <Link
          to={"/bets"}
          style={{ textDecoration: "none" }}
          onClick={() => handleNavigation("/bets")}
        >
          <div className="nav-button">
            <LuCircleDollarSign size={25} />
            My Bets
          </div>
        </Link>

        <div className="wallet-container">
          {walletAddress && (
            <div className="wallet-address">
              <FaWallet />
              <span>{walletAddress}</span>
            </div>
          )}
          <ConnectButton 
            onMarketDataFetched={onMarketDataFetched}
            onWalletConnected={handleWalletConnected}
          />
        </div>
      </div>
      <FaBars className="menu-icon" onClick={showNavbar} />
    </div>
  );
};

export default Navbar;
