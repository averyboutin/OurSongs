import React, { Component } from "react";
import "./welcome.scss";

class Welcome extends Component {
  state = {};
  render() {
    return (
      <div className="welcome">
        <div className="container">
          <img src="/icon.svg" alt="our songs logo" />
          <h1>Welcome, {this.props.UserName}</h1>
          <p>Log in to make posts and comments.</p>
          <button
            className="btn btn-primary"
            onClick={this.props.handleWelcomeGoBack}
          >
            Return to OurSongs
          </button>
        </div>
      </div>
    );
  }
}

export default Welcome;
