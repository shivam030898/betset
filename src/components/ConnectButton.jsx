import React, { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import "../css/ConnectButton.css";
import { WalletContext } from "../pages/WalletContext";

const contractABI = [
  /*...contract ABI...*/
];
const contractAddress = "0x89eD504B7B1f5799d81290Ff0D7D3c99D0a5D0E2";

const ConnectButton = () => {
  const { walletAddress, setWalletAddress } = useContext(WalletContext);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const storedWalletAddress = localStorage.getItem("walletAddress");
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
      setIsConnected(true);
    }
  }, [setWalletAddress]);

  async function requestAccount() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setWalletAddress(account);
        localStorage.setItem("walletAddress", account);
        setIsConnected(true);
      } catch (error) {
        console.log("Error connecting to MetaMask:", error);
      }
    } else {
      console.log("MetaMask not detected");
    }
  }

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log("Provider:", provider);

      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      console.log("Contract:", contractInstance);
    }
  }

  function disconnectWallet() {
    setWalletAddress("");
    localStorage.removeItem("walletAddress");
    setIsConnected(false);
  }

  return (
    <div className="connect-button-container">
      {isConnected ? (
        <button className="disconnect-button" onClick={disconnectWallet}>
          Disconnect
        </button>
      ) : (
        <button className="connect-button" onClick={connectWallet}>
          Connect
        </button>
      )}
      {walletAddress && (
        <h3 className="wallet-address">
          {walletAddress.slice(0, 5)}...{walletAddress.slice(-4)}
        </h3>
      )}
    </div>
  );
};

export default ConnectButton;
