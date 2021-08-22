import React, {useState} from 'react';
import firebase from "firebase";
import './LostFunds.css';
import { withRouter } from "react-router-dom";

function LostFunds(props) {
  const {database} = require('../../backend/firebase.js');
  const handleChange = (e) => {
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
  
  function changeAddress(newWalletAddress) {
    const user = firebase.auth().currentUser;
    if (user) {
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