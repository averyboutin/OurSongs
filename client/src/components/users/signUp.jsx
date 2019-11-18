import React, { Component } from "react";

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      isBadSignUp: false,
      badSignUpMessage: ""
    };
  }

  handleSubmit = e => {
    e.preventDefault();

    fetch("/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        UserName: e.target[0].value,
        Password: e.target[1].value
      })
    })
      .then(res => {
        if (res.status === 200) return res.json();
        else {
          this.setState({
            isBadSignUp: true,
            badSignUpMessage: "Username Taken"
          });
          return Promise.reject();
        }
      })
      .then(user => {
        this.props.handleSignUp(user.UserName);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="log-in">
        <h2>Sign Up</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label className="form-text text-muted" htmlFor="username">
              Enter Username
            </label>
            <input
              className="form-control"
              type="text"
              name="username"
              placeholder="Username"
              id="username"
            />
          </div>
          <div className="form-group">
            <label className="form-text text-muted" htmlFor="password">
              Enter Password
            </label>
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Password"
              id="password"
            />
          </div>
          {this.state.isBadSignUp && (
            <label className="form-text text-warning" htmlFor="username">
              {this.state.badSignUpMessage}
            </label>
          )}
          <div className="postOrCancel">
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.props.handleSignUpClose}
            >
              Cancel
            </button>
            <input className="btn btn-primary" type="submit" value="Submit" />
          </div>
        </form>
      </div>
    );
  }
}

export default SignUp;
