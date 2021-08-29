import React, {useState} from 'react';
import firebase from "firebase";
import './Convert.css';
import { withRouter } from "react-router-dom";
import Web3 from 'web3';
import Dex from '../../abis/DEX.json';
import Token from '../../abis/ERC20Token.json';

/*  Convert page:
    Consists of:
    Connect Wallet - connect to your registered wallet address and load SafeKeepToken and Ethereum info.
    Buy Token - buy SafekeepToken with Ethereum
    Sell Token - buy Ethereum with SafekeepToken   */

function Convert(props) {

  const [state , setState] = useState({ inputAmount: "0" });
  
  // The connected wallet account address
  const [account , setAccount] = useState('');
  
  // The connected wallet account ether balance
  const [ethBalance , setEthBalance] = useState('0');

  // The connected wallet account SafekeepToken balance
  const [tokenBalance , setTokenBalance] = useState('0');

  // The SafekeepToken Contract
  const [token , setToken] = useState();

  // The DEX Contract
  const [dex , setDex] = useState();

  // The DEX address
  const [dexAddress , setDexAddress] = useState();

  // Bool to determine whether to show wallet balances
  // (connected to wallet => false => not loading => show balances)
  const [loading , setLoading] = useState(true);

  async function loadBlockchainData() {
    const {database} = require('../../database/firebase.js');
    const user = firebase.auth().currentUser;
    if (!user)
    {
      props.showError('User not connected. Please connet to website.');
    } else {
      // get registered user wallet address
      const docRef = await database.collection("UsersWallets")
        .doc(user.uid).get();
      const registeredAccount = docRef.data().walletAddress;

      // get MetaMask wallet address
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      if (registeredAccount !== accounts[0]) {
        props.showError('Given wallet address different than registered address. ' +
                        'Please connect to the correct wallet or go to LostFunds page.');
      } else {
        if (accounts[0] !== undefined && accounts[0] !== '') {
          setEthBalance(await web3.eth.getBalance(accounts[0]));
        }
        
        // Load Token
        const networkId = await web3.eth.net.getId();
        const tokenData = Token.networks[networkId];
        if (tokenData) {
          const safekeepToken = new web3.eth.Contract(Token.abi, tokenData.address);
          setToken(safekeepToken);
          if(accounts[0] !== undefined && accounts[0] !== '') {
            let tokenBalance = await safekeepToken.methods.balanceOf(accounts[0]).call();
            setTokenBalance(tokenBalance.toString());
          }
        } else {
          window.alert('Token contract not deployed to detected network.');
        }
        
        // Load DEX
        const dexData = Dex.networks[networkId];
        if (dexData) {
          setDexAddress(dexData.address);
          setDex(new web3.eth.Contract(Dex.abi, dexData.address));
        } else {
          window.alert('DEX contract not deployed to detected network.');
        }
        
        setLoading(false);
      }
    }
  }

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  function buyTokens(etherAmount) {
    let convertedEtherAmount = etherAmount.toString();
    convertedEtherAmount = window.web3.utils.toWei(convertedEtherAmount, 'Ether');
    setLoading(true);
    dex.methods.buyTokens().send({ value: convertedEtherAmount, from: account, gas: 3000000 }).on('transactionHash', (hash) => {
      setLoading(false);
    });
  }

  function sellTokens(tokenAmount) {
    let convertedTokenAmount = tokenAmount.toString();
    convertedTokenAmount = window.web3.utils.toWei(convertedTokenAmount, 'Ether');
    setLoading(true);
    token.methods.approve(dexAddress, convertedTokenAmount).send({ from: account, gas: 3000000 }).on('transactionHash', (hash) => {
      dex.methods.sellTokens(convertedTokenAmount).send({ from: account }).on('transactionHash', (hash) => {
        setLoading(false)
      })
    });
  }

  const connectAccount = async () => {
    await loadWeb3();
    await loadBlockchainData();
  };


  let content;
  if (loading) {
    if (account !== undefined && account !== '') {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <p id="loader" className="text-center">Please connect to wallet</p>
    }
  } else {
    content =
      <div>
        <span className="float-right text-muted">
          Ether Balance: {window.web3.utils.fromWei(ethBalance, 'Ether')}
        </span>
        <span className="float-right text-muted">
          Token Balance: {window.web3.utils.fromWei(tokenBalance, 'Ether')}
        </span>
        <button className="btn btn-primary buy-sell"
                variant="contained" color="primary"
                onClick={() => buyTokens(state.inputAmount)}>
                  Buy Tokens
        </button>
        <button className="btn btn-primary buy-sell"
                variant="contained"
                color="primary"
                onClick={() => sellTokens(state.inputAmount)}>
                  Sell Tokens
        </button>
      </div>
  }
        
  return( 
    <div className="convert">
        Amount to buy/sell:
      <input className="inputAmount"
            placeholder={"how much to send?"}
            type="text" value={state.inputAmount} 
            onChange={(evt) => setState({inputAmount: evt.target.value})}
      />
      <button className="btn btn-primary connect"
              variant="contained"
              color="primary"
              onClick={connectAccount}>
                Connect wallet
      </button>
      {content}
    </div>
    )
}

export default withRouter(Convert);