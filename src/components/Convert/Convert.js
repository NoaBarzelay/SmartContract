import React, {useState} from 'react';
import firebase from "firebase";
import './Convert.css';
import { withRouter } from "react-router-dom";

const Web3 = require("web3")

function Convert(props) {
    const [state , setState] = useState({
        val: "0"
    })
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }


    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/home');
    }
    const redirectToRegister = () => {
        props.history.push('/register'); 
        props.updateTitle('Register');
    }


    let accounts = [];
    const connectAccount = () => {
        getAccount();
      };
      
      async function getAccount() {
          console.log("here");
        accounts = await (window)?.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(accounts);
      }

      //Sending Ethereum to an address
    const sendEthToAddress = async (value) => {
    console.log(value);

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();

    const NameContract = new web3.eth.Contract([
        {
          "constant": true,
          "inputs": [],
          "name": "token",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Bought",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Sold",
          "type": "event"
        },
        {
          "constant": false,
          "inputs": [],
          "name": "buy",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "sell",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ], '0xcb2E6F14ea863ecc4356A083893A1130Ffe5aB91');
    NameContract.methods.buy().send({ from: accounts[0], value: Web3.utils.toWei('2', 'ether'), gasPrice: '10000000000000',
    gas: 1000000 });


  /*  const amount = Web3.utils.toWei(value, 'ether');
    const formatted_value = Web3.utils.toHex(amount);
    return  (window)?.ethereum.request({
    method: 'eth_sendTransaction',
    params: [
        {
        from: accounts[0],
        to: '0xcC9e20D6AE81D98Ca0CB45098F51A2673a4BC347',
        value: formatted_value,
        gasPrice: '0x09184e72a000',
        gas: '0x5208',
        },
    ],
    })
    .then((txHash) => txHash)
    .catch((error) => error); */
    };
        
    return(
        <div className="convert">
        <input placeholder={"how much to send?"} type="text" value={state.val} 
        onChange={(evt) => setState({
            val: evt.target.value
          })} />
        <button variant="contained" color="primary" onClick={connectAccount}>Connect wallet</button>
        <button variant="contained" color="primary" onClick={() => sendEthToAddress(state.val)}>Send Eth</button>
      </div>
    )
}

export default withRouter(Convert);