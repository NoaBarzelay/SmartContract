import React, {useState} from 'react';
import firebase from "firebase";
import './LoginForm.css';
import { withRouter } from "react-router-dom";

function LoginForm(props) {
    const [state , setState] = useState({
        email : "",
        password : "",
        successMessage: null
    })
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }
    const handleSubmitClick = (e) => {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(state.email, state.password)
        .then((userCredential) => {
            setState(prevState => ({
                ...prevState,
                'user': userCredential.user,
                'successMessage': 'Login successful. Redirecting to home page..'
            }))
            redirectToHome();
        })
        .catch((error) => {
            props.showError('Invalid username or password') 
        });
    }
    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/home');
    }
    const redirectToRegister = () => {
        props.history.push('/register'); 
        props.updateTitle('Register');
    }
    const resetPassword = () => {
        if (state.email) {
            firebase.auth().sendPasswordResetEmail(state.email)
            .then(() => setState(prevState => ({
                ...prevState,
                'successMessage' : "A reset email was sent to addres: " + state.email
                })))
            .catch((error) => {
                props.showError('Invalid email.')
            });
        } else {
            props.showError('Please fill email address.')
        }
    }

    return(
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="email" 
                       className="form-control" 
                       id="email" 
                       aria-describedby="emailHelp" 
                       placeholder="Enter email" 
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
                <div className="form-check">
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    onClick={handleSubmitClick}>
                        Submit
                </button>
            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="registerMessage">
                <span>Don't have an account? </span>
                <span className="loginText" onClick={() => redirectToRegister()}>Register</span> 
            </div>
            <div className="forgotPasswordMessage">
                <span>Forgot password? </span>
                <span className="loginText" onClick={() => resetPassword()}>Reset email address</span> 
            </div>
        </div>
    )
}

export default withRouter(LoginForm);