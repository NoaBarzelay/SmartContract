import React from 'react';
import firebase from "firebase";
import { withRouter } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from '../../constants/apiConstants';

/*  Header to logged-in pages:
    Consists of logout button
    and 'about' redirect   */

function Header(props) {
    
    const capitalize = (s) => {
        if (typeof s !== 'string') return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    let title = capitalize(props.location.pathname.substring(1,props.location.pathname.length));
    if(props.location.pathname === '/') {
        title = 'Welcome';
    }

    function renderLogout() {
        if(props.location.pathname === '/home'){
            return(
                <div className="ml-auto">
                    <button className="btn btn-default" onClick={() => redirectToAbout()}>About</button>
                    <button className="btn btn-danger" onClick={() => handleLogout()}>Logout</button>
                </div>
            )
        } else {
            return(
                <div className="ml-auto">
                    <button className="btn btn-default" onClick={() => redirectToHome()}>Back</button>
                    <button className="btn btn-default" onClick={() => redirectToAbout()}>About</button>
                    <button className="btn btn-danger" onClick={() => handleLogout()}>Logout</button>
                </div>
            )
        }
    }

    function handleLogout() {
        firebase.auth().signOut().then(() => {
            localStorage.removeItem(ACCESS_TOKEN_NAME);
            props.history.push('/login');
            }).catch((error) => {
            props.showError(error.message);
            });
        }

    const redirectToAbout = () => {
        props.history.push('/about');
    }
    
    const redirectToHome = () => {
        props.history.push('/home');
    }

    return(
        <nav className="navbar navbar-dark bg-primary">
            <div className="row col-12 d-flex justify-content-center text-white">
                <span className="h3">{props.title || title}</span>
                {renderLogout()}
            </div>
        </nav>
    )
}

export default withRouter(Header);