import React, {useState} from 'react';
import firebase from "firebase";
import './Convert.css';
import { withRouter } from "react-router-dom";
import Web3 from 'web3';
import Dex from '../../abis/DEX.json';
import Token from '../../abis/ERC20Token.json';

// const Web3 = require("web3")

function Convert(props) {
    const [state , setState] = useState({
        val: "0"
    })

    const [account , setAccount] = useState('')

    const [ethBalance , setEthBalance] = useState('0')

    const [tokenBalance , setTokenBalance] = useState('0')

    const [token , setToken] = useState()

    const [dex , setDex] = useState()

    const [dexAddress , setDexAddress] = useState()

    const [loading , setLoading] = useState(true)





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


    async function loadBlockchainData() {
        const web3 = window.web3
    
        const accounts = await web3.eth.getAccounts()
        setAccount(accounts[0])
    

        
       if(account != undefined && account !== '') {
        setEthBalance(await web3.eth.getBalance(account))
       }
        
    
        // Load Token
        const networkId =  await web3.eth.net.getId()
        const tokenData = Token.networks[networkId]
        if(tokenData) {
          setToken(new web3.eth.Contract(Token.abi, tokenData.address))
          if(account != undefined && account !== '') {
            let tokenBalance = await token.methods.balanceOf(account).call()
            setTokenBalance(tokenBalance.toString())
          }
         
        } else {
          window.alert('Token contract not deployed to detected network.')
        }
    
        // Load DEX
        const dexData = Dex.networks[networkId]
        if(dexData) {
          setDexAddress(dexData.address)
          setDex(new web3.eth.Contract(Dex.abi, dexAddress))
        } else {
          window.alert('DEX contract not deployed to detected network.')
        }
    
        setLoading(false)
      }

    async function loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      }



    function buyTokens(etherAmount) {
        let convertedEtherAmount = etherAmount.toString()
        convertedEtherAmount = window.web3.utils.toWei(convertedEtherAmount, 'Ether')
        setLoading(true)
        dex.methods.buyTokens().send({ value: convertedEtherAmount, from: account }).on('transactionHash', (hash) => {
          setLoading(false)
        })
      }

    function sellTokens(tokenAmount) {
        let convertedTokenAmount = tokenAmount.toString()
        convertedTokenAmount = window.web3.utils.toWei(convertedTokenAmount, 'Ether')
        setLoading(true)
        token.methods.approve(dexAddress, convertedTokenAmount).send({ from: account }).on('transactionHash', (hash) => {
          dex.methods.sellTokens(convertedTokenAmount).send({ from: account }).on('transactionHash', (hash) => {
            setLoading(false)
          })
        })
      }

    const connectAccount = async () => {
        await loadWeb3();
        await loadBlockchainData();
      };


    let content
    if(loading) {
      if(account != undefined && account !== '') {
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

                <button className="btn btn-primary buy-sell" variant="contained" color="primary" onClick={() => buyTokens(state.val)}>Buy Tokens</button>
                <button className="btn btn-primary buy-sell" variant="contained" color="primary" onClick={() => sellTokens(state.val)}>Sell Tokens</button>
        </div>
    }
        
    return( 
        <div className="convert">
            Amount to buy/sell:
        <input className="inputAmount" placeholder={"how much to send?"} type="text" value={state.val} 
        onChange={(evt) => setState({
            val: evt.target.value
          })} />
        <button className="btn btn-primary connect" variant="contained" color="primary" onClick={connectAccount}>Connect wallet</button>
        {content}
      </div>
    )
}

export default withRouter(Convert);