import "./App.css";
import Navbar from "./components/Navbar";
import MyBets from "./pages/MyBets";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import { ethers } from "ethers";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { WalletProvider } from "./pages/WalletContext";

// import Hero from "./components/Hero";

const App = () => {
  return (
    <WalletProvider>
      <Router>
        <div>
          <Navbar />
          {/* <Hero /> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bets" element={<MyBets />} />
          </Routes>
          <Footer />
 
        </div>
      </Router>
    </WalletProvider>
  );
};
export default App;
