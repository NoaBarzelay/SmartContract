import React, {useState} from 'react';
import firebase from "firebase";
import './RegistrationForm.css';
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import { withRouter } from "react-router-dom";
import Web3 from 'web3';

/*  Registration page:
    Consists of email, password, confirm password
    And Wallet Address which connects on registration   */

function RegistrationForm(props) {

    const {database} = require('../../database/firebase.js');

    const [state , setState] = useState({
        email : "",
        password : "",
        confirmPassword: "",
        walletAddress: "",
        connectedWalletAddress: "",
        user: null,
        successMessage: null
    });

    const handleChange = (e) => {
        const {id , value} = e.target; 
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }

    const sendDetailsToServer = async () => {
        if (state.email.length && state.password.length) {
            // Assert input wallet address isn't registered
            let addressInUse = false;
            await database.collection("UsersWallets").where("walletAddress", "==", state.walletAddress)
                .get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        props.showError('Wallet address is already in use.');
                        addressInUse = true;
                    });
                });
        
            if (!addressInUse) {
                // register user in databases
                props.showError(null);
                firebase.auth().createUserWithEmailAndPassword(state.email, state.password)
                .then(userCredential => {
                    database.collection("UsersWallets").doc(userCredential.user.uid).set({
                        walletAddress: state.walletAddress
                    });
                    setState(prevState => ({
                        ...prevState,
                        'user': userCredential.user,
                        'successMessage': 'Registration successful. Redirecting to home page..'
                    }));
                })
                .then(() => redirectToHome())
                .catch((error) => {
                    props.showError(error.message)
                });
            }
        } else {
            props.showError('Please enter valid username and password')    
        }
    };

    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/home');
    };

    const redirectToLogin = () => {
        props.updateTitle('Login')
        props.history.push('/login'); 
    };

    const handleSubmitClick = async (e) => {
        e.preventDefault();
        await connectWallet();
        if (state.password === state.confirmPassword) {
            if (state.connectedWalletAddress === state.walletAddress) {
                sendDetailsToServer(); 
            } else if (state.connectedWalletAddress !== "") {
                props.showError('You must be connected to the wallet address you submitted');
            }

        } else {
            props.showError('Passwords do not match');
        }
    };

    async function connectWallet() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
        else {
            props.showError('Non-Ethereum browser detected. You should consider trying MetaMask!');
            return;
        }

        const accounts = await window.web3.eth.getAccounts();
        setState(prevState => ({
            ...prevState,
            'connectedWalletAddress': accounts[0],
            'successMessage': "You are now connected to the wallet address you submitted and can register"
        }));
    }

    return(
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                <label htmlFor="exampleInputEmail1">Email Address</label>
                <input type="email" 
                       className="form-control" 
                       id="email" 
                       aria-describedby="emailHelp" 
                       placeholder="Enter Email" 
                       value={state.email}
                       onChange={handleChange}
                />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" 
                        className="form-control" 
                        id="password" 
                        placeholder="Password"
                        value={state.password}
                        onChange={handleChange} 
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Confirm Password</label>
                    <input type="password" 
                        className="form-control" 
                        id="confirmPassword" 
                        placeholder="Confirm Password"
                        value={state.confirmPassword}
                        onChange={handleChange} 
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleFormControlInput1">Wallet Address</label>
                    <input type="text" 
                        className="form-control" 
                        id="walletAddress" 
                        placeholder="Wallet Address"
                        value={state.walletAddress}
                        onChange={handleChange} 
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    onClick={handleSubmitClick}>
                    Register
                </button>
            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="mt-2">
                <span>Already have an account? </span>
                <span className="loginText" onClick={() => redirectToLogin()}>Login here</span> 
            </div>
            
        </div>
    )
}

export default withRouter(RegistrationForm);