import React, { useRef, useEffect, useState } from 'react';
import '../css/TileDialog.css';
import '../css/Tiles.css';
import CancelIcon from '@mui/icons-material/Cancel';
import { ethers } from 'ethers'; 

const contractAbi = [{"inputs":[{"internalType":"address","name":"_stableToken","type":"address"},{"internalType":"address","name":"_feeCollector","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"marketId","type":"uint256"},{"indexed":true,"internalType":"address","name":"bettor","type":"address"},{"indexed":false,"internalType":"bool","name":"betOnYes","type":"bool"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"BetPlaced","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"marketId","type":"uint256"},{"indexed":true,"internalType":"address","name":"bettor","type":"address"},{"indexed":false,"internalType":"bool","name":"betOnYes","type":"bool"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"}],"name":"BetWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"marketId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newEndDate","type":"uint256"}],"name":"EndDateUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"marketId","type":"uint256"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":false,"internalType":"uint256","name":"endDate","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"resultDate","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"commission","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"withdrawCommission","type":"uint256"}],"name":"MarketCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"marketId","type":"uint256"},{"indexed":false,"internalType":"bool","name":"outcome","type":"bool"}],"name":"MarketResolved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"marketId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newResultDate","type":"uint256"}],"name":"ResultDateUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"marketId","type":"uint256"},{"indexed":true,"internalType":"address","name":"claimant","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"WinningsClaimed","type":"event"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"marketId","type":"uint256"}],"name":"claimWinnings","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_description","type":"string"},{"internalType":"uint256","name":"_endDate","type":"uint256"},{"internalType":"uint256","name":"_resultDate","type":"uint256"},{"internalType":"uint256","name":"_commission","type":"uint256"},{"internalType":"uint256","name":"_withdrawCommission","type":"uint256"}],"name":"createMarket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"feeCollector","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"marketCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"markets","outputs":[{"internalType":"uint256","name":"marketId","type":"uint256"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"endDate","type":"uint256"},{"internalType":"uint256","name":"resultDate","type":"uint256"},{"internalType":"uint256","name":"totalYesBets","type":"uint256"},{"internalType":"uint256","name":"totalNoBets","type":"uint256"},{"internalType":"bool","name":"resolved","type":"bool"},{"internalType":"bool","name":"outcome","type":"bool"},{"internalType":"uint256","name":"commission","type":"uint256"},{"internalType":"uint256","name":"withdrawCommission","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"marketId","type":"uint256"},{"internalType":"bool","name":"betOnYes","type":"bool"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"placeBet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"marketId","type":"uint256"},{"internalType":"bool","name":"outcome","type":"bool"}],"name":"resolveMarket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stableToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"marketId","type":"uint256"},{"internalType":"uint256","name":"newEndDate","type":"uint256"}],"name":"updateEndDate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"marketId","type":"uint256"},{"internalType":"uint256","name":"newResultDate","type":"uint256"}],"name":"updateResultDate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"marketId","type":"uint256"},{"internalType":"bool","name":"betOnYes","type":"bool"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawBet","outputs":[],"stateMutability":"nonpayable","type":"function"}
];
const stableTokenAbi=[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"addAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"admins","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_spender","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gov","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"id","outputs":[{"internalType":"string","name":"_name","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"inPrivateTransferMode","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isHandler","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isMinter","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonStakingAccounts","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nonStakingSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"removeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_gov","type":"address"}],"name":"setGov","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_handler","type":"address"},{"internalType":"bool","name":"_isActive","type":"bool"}],"name":"setHandler","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_inPrivateTransferMode","type":"bool"}],"name":"setInPrivateTransferMode","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"}],"name":"setInfo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_minter","type":"address"},{"internalType":"bool","name":"_isActive","type":"bool"}],"name":"setMinter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"stakedBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalStaked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_recipient","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_sender","type":"address"},{"internalType":"address","name":"_recipient","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"_account","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawToken","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const contractAddress = '0x89eD504B7B1f5799d81290Ff0D7D3c99D0a5D0E2'; 
const stableTokenAddress ='0x2b622D678380e41B2e0aed16e70Ebc348d71DB65';


const NoTileDialog = ({ isOpen, onClose, heading, description, img, marketId,end_date,result_date }) => {
  const noDialogRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [ethersProvider, setEthersProvider] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  const handleClickOutside = (event) => {
    if (noDialogRef.current && !noDialogRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    async function initializeEthers() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const instance = new ethers.Contract(contractAddress, contractAbi, signer);
        const accounts = await provider.listAccounts();
        setWalletAddress(accounts[0]);
        setEthersProvider(provider);
        setContractInstance(instance);
      } catch (error) {
        console.error('Error initializing ethers:', error);
      }
    }

    if (isOpen) {
      initializeEthers();
    }

    return () => {
      setEthersProvider(null);
      setContractInstance(null);
      setWalletAddress(null);
    };
  }, [isOpen]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleBetYesClick = async () => {

    if (!inputValue) {
      alert('Please enter an amount');
      return;
    }

    if (!ethersProvider || !contractInstance || !walletAddress) return;
  
    const amount = ethers.utils.parseEther(inputValue); 
    console.log('Market ID:', marketId);
    console.log('Amount:', amount.toString());
  
    try {
     
      const stableTokenInstance = new ethers.Contract(stableTokenAddress, stableTokenAbi, ethersProvider.getSigner());
      const allowance = await stableTokenInstance.allowance(walletAddress, contractAddress);
      const amountBN = ethers.BigNumber.from(amount);
      const allowanceBN = ethers.BigNumber.from(allowance);

      if (allowanceBN.gte(amountBN)) {
        const transaction = await contractInstance.placeBet(marketId, false, amount);
        await transaction.wait();
        console.log('Bet placed successfully!');
      } else {
        const approveTx = await stableTokenInstance.approve(contractAddress, amount);
        await approveTx.wait();

        const transaction = await contractInstance.placeBet(marketId, false, amount);
        await transaction.wait();
        console.log('Bet placed successfully!');
      }
    } catch (error) {
      console.error('Error placing bet:', error);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="tile-dialog-overlay">
          <div className="no-tile-dialog" ref={noDialogRef}>
            <button className='close-button' onClick={onClose}><CancelIcon /></button>
            <div className="tile-dialog-content">
              {img && <img src={img} alt={heading} className="event-image" />}
              <h2>{description}</h2>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="normal-input"
                placeholder="Enter amount"
              />
              <div className="button-container">
                <button className="no-bet-button" onClick={handleBetYesClick}>Bet No</button>
              </div>
              <div className='misc'>
              <p>Ends on:</p><p>{end_date}</p>
              <p>Result on:</p><p>{result_date}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default NoTileDialog;