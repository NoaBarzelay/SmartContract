import React,{ useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import './Home.css';

/* Home page:
   Consists of convert button
   anf LostFunds button */

function Home(props) {
  
  const redirectToConvert = () => {
    props.updateTitle('Convert');
    props.history.push('/convert');
  }

  const redirectToLostFunds = () => {
    props.updateTitle('LostFunds');
    props.history.push('/lostfunds');
  }
  
  function homeBody() {
    if(props.location.pathname === '/home'){
      return (
      <div>
        <button className="btn btn-primary buttons" variant="contained" color="primary" onClick={() => redirectToConvert()}>Convert</button>
        <button className="btn btn-primary buttons" variant="contained" color="primary" onClick={() => redirectToLostFunds()}>LostFunds</button>
      </div>)
    }
  }

  return(
    <div className="row col-12 d-flex justify-content-center text-white">
      {homeBody()}
    </div>
  )
}

export default withRouter(Home);