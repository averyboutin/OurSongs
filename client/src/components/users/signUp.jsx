import React, { Component } from "react";
import "./signUp.scss";

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      badUserNameMessage: "",
      badPassWordMessage: "",
      username: "",
      password: ""
    };
  }

  handleSubmit = e => {
    e.preventDefault();

    if (this.state.username === "" && this.state.password === "") {
      this.setState({
        badUserNameMessage: "Must have a username",
        badPassWordMessage: "Must have a password"
      });
    } else if (this.state.username === "") {
      this.setState({ badUserNameMessage: "Must have a username" });
    } else if (this.state.password === "") {
      this.setState({ badPassWordMessage: "Must have a password" });
    } else {
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
            this.setState({ badUserNameMessage: "Username Taken" });
            return Promise.reject();
          }
        })
        .then(user => {
          this.props.handleSignUp(user.UserName);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    return (
      <div className="log-in">
        <h2>Sign Up</h2>
        <div className="sign-up-container">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label className="form-text text-muted" htmlFor="username">
                Enter Username
              </label>
              <input
                className={
                  this.state.badUserNameMessage
                    ? "form-control is-invalid"
                    : "form-control"
                }
                type="text"
                name="username"
                placeholder="Username"
                id="username"
                value={this.state.username}
                onChange={e => {
                  this.setState({
                    username: e.target.value,
                    badUserNameMessage: ""
                  });
                }}
              />
              <div className="invalid-feedback">
                {this.state.badUserNameMessage}
              </div>
            </div>
            <div className="form-group">
              <label className="form-text text-muted" htmlFor="password">
                Enter Password
              </label>
              <input
                className={
                  this.state.badPassWordMessage
                    ? "form-control is-invalid"
                    : "form-control"
                }
                type="password"
                name="password"
                placeholder="Password"
                id="password"
                value={this.state.password}
                onChange={e => {
                  this.setState({
                    password: e.target.value,
                    badPassWordMessage: ""
                  });
                }}
              />
              <div className="invalid-feedback">
                {this.state.badPassWordMessage}
              </div>
            </div>

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
      </div>
    );
  }
}

export default SignUp;
