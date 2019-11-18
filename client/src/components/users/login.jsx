import React, { Component } from "react";

class LogIn extends Component {
  constructor() {
    super();
    this.state = {
      isBadLogIn: false,
      badLogInMessage: ""
    };
  }

  handleOnChange = () => {
    this.setState({ isBadLogIn: false, badLogInMessage: "" });
  };

  handleSubmit = e => {
    e.preventDefault();

    fetch("/api/users/login", {
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
            isBadLogIn: true,
            badLogInMessage: "Incorrect Login"
          });
          return Promise.reject();
        }
      })
      .then(user => {
        this.props.handleLogIn(user[0].UserID, user[0].Username);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="log-in">
        <h2>Log In</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label className="form-text text-muted" htmlFor="username">
              Enter Username
            </label>
            <input
              onChange={this.handleOnChange}
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
              onChange={this.handleOnChange}
              className="form-control"
              type="password"
              name="password"
              placeholder="Password"
              id="password"
            />
          </div>
          {this.state.isBadLogIn && (
            <label className="form-text text-warning" htmlFor="username">
              {this.state.badLogInMessage}
            </label>
          )}

          <div className="postOrCancel">
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.props.handleLogInClose}
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

export default LogIn;
