import React, { Component } from "react";
import "./login.scss";

class LogIn extends Component {
  constructor() {
    super();
    this.state = {
      badLogInMessage: "",
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
              badLogInMessage: "Incorrect Login"
            });
            return Promise.reject();
          }
        })
        .then(result => {
          console.log(result);
          this.props.handleLogIn(result[0].UserName);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  generateRandomString(length) {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  handleLogInWithSpotify = () => {
    const client_id = "018eb308e675406b98d2e64a6bc3072c";
    const scope = "playlist-modify-public";
    const redirect_uri = "http://oursongs.tech/";
    const state = this.generateRandomString(16);

    let url = "https://accounts.spotify.com/authorize";
    url += "?response_type=token";
    url += "&client_id=" + encodeURIComponent(client_id);
    url += "&scope=" + encodeURIComponent(scope);
    url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
    url += "&state=" + encodeURIComponent(state);
    window.location = url;
  };

  render() {
    return (
      <div className="log-in">
        <h2>Log In</h2>
        <div>
          <button
            className="btn btn-primary btn-green"
            onClick={this.handleLogInWithSpotify}
          >
            Log In With Spotify
          </button>
        </div>
        <div className="divider">
          <div className="line"></div>
          <p>OR</p>
          <div className="line"></div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label className="form-text text-muted" htmlFor="username">
              Enter Username
            </label>
            <input
              value={this.state.username}
              onChange={e => {
                this.setState({
                  username: e.target.value,
                  badUserNameMessage: "",
                  badLogInMessage: ""
                });
              }}
              className={
                this.state.badUserNameMessage || this.state.badLogInMessage
                  ? "form-control is-invalid"
                  : "form-control"
              }
              type="text"
              name="username"
              placeholder="Username"
              id="username"
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
              value={this.state.password}
              onChange={e => {
                this.setState({
                  password: e.target.value,
                  badPassWordMessage: "",
                  badLogInMessage: ""
                });
              }}
              className={
                this.state.badPassWordMessage || this.state.badLogInMessage
                  ? "form-control is-invalid"
                  : "form-control"
              }
              type="password"
              name="password"
              placeholder="Password"
              id="password"
            />
            <div className="invalid-feedback">
              {this.state.badPassWordMessage}
            </div>
          </div>
          <div className="form-group">
            <label className="form-text" htmlFor="username">
              (Users not logged in with spotify will not be able to create
              spotify playlists)
            </label>
            <label className="form-text text-danger" htmlFor="username">
              {this.state.badLogInMessage}
            </label>
          </div>

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
