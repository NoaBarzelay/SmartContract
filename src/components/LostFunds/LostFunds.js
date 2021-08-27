import React, {useState} from 'react';
import firebase from "firebase";
import './LostFunds.css';
import { withRouter } from "react-router-dom";
import Token from '../../abis/ERC20Token.json';
import Web3 from 'web3';
import PrivateKey from '../../utils/PrivateKey.json';

function LostFunds(props) {
  const {database} = require('../../backend/firebase.js');
  const handleChange = (e) => {
    console.log(PrivateKey.ownerPrivateKey);
    const {id , value} = e.target;
    setState(prevState => ({
      ...prevState,
      [id] : value
    }));
  };
  const [state , setState] = useState({
    newWalletAddress: "",
    successMessage: null
  });
  
  async function changeAddress(newWalletAddress) {
    const user = firebase.auth().currentUser;
    let prevAddress;
    if (user) {
      await database.collection("UsersWallets").doc(user.uid).get().then((doc) => {
        if (doc.exists) {
          prevAddress = doc.data().walletAddress;
          console.log(prevAddress);
        } else {
          console.log("no such doc");
        }
      }).catch((error) => {
        console.log("Error getting doc:", error);
      });

      window.web3 = new Web3(window.ethereum);

      const networkId =  await window.web3.eth.net.getId()
      const tokenData = Token.networks[networkId]
      if(tokenData) {
        const token = new window.web3.eth.Contract(Token.abi, tokenData.address);
        const prevAddressBalance = await token.methods.balanceOf(prevAddress).call();
      //  const ownerAddress = await token.methods.getOwner().call();
      //  const PRIVATE_KEY = '0x4f18e725bf92b827a13880ab100a159acde1936b5a917146de774e95dc7b3c5d'
        window.web3.eth.accounts.wallet.add(PrivateKey.ownerPrivateKey)
        const ownerAccount = window.web3.eth.accounts.wallet[0].address
        await token.methods.transferLostFunds(prevAddress, state.newWalletAddress, prevAddressBalance).send({from: ownerAccount, gasPrice: 21000, gas: 3000000});
        await window.web3.eth.accounts.wallet.clear();
        console.log("web3.eth.accounts.wallet:", window.web3.eth.accounts.wallet)
        // probably need to remove the owner
       //  web3.eth.accounts.wallet.remove(0);
       // or web3.eth.accounts.wallet.clear();
      }
      

      database.collection("UsersWallets").doc(user.uid).set({
        walletAddress: newWalletAddress
      });
      setState(prevState => ({
        ...prevState,
        'successMessage' : "Wallet address changed to: " + newWalletAddress
      }));
    } else {
      props.showError('User is not connected. Please login or register.');
    }
  }

  return(
  <div className="LostFunds">
    New wallet address:
    <input className="inputAmount"
      placeholder={"enter wallet address"}
      type="text"
      value={state.newWalletAddress} 
      size="50"
      id="newWalletAddress"
      onChange={handleChange}
    />
    <button className="btn btn-primary change address"
      variant="contained"
      color="primary"
      onClick={() => changeAddress(state.newWalletAddress)}>
        Change Wallet Address
    </button>
    <div className="alert alert-success mt-2"
      style={{display: state.successMessage ? 'block' : 'none' }}
      role="alert">
        {state.successMessage}
    </div>
  </div>
  )
}

export default withRouter(LostFunds);