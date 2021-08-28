import React from 'react';
import { withRouter } from 'react-router-dom';
import './About.css';

/* About page:
   Consists of website description */

function About(props) {
  return(
    <div class="container my-4">
      <p class="font-weight-bold">This website allows you to safekeep your tokens in case of wallet credentials or password loss,
      as well as prevents you from forgetting about your tokens altogether. All you have to do is convert your tokens
      to this websites tokens in the Convert page.
      If you lose your wallet's password - we will transfer the tokens to a new wallet for you via LostFunds page.
      If you forget the website's password - you can send email authentication to your registered email address via forgot password.
      If you forget about this website - we will send you regular emails.
      You can convert our tokens back to etherum at any time!</p>
    </div>
  )
}

export default withRouter(About);