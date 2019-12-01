import React, { Component } from "react";
import "bootswatch/dist/cosmo/bootstrap.min.css";
import "./App.scss";
import Posts from "./components/posts/posts";
import Post from "./components/posts/post";
import Navbar from "./components/navbar/navbar";
import Comments from "./components/comments/comments";
import LogIn from "./components/users/login";
import SignUp from "./components/users/signUp";
import Welcome from "./components/users/welcome";

const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});

window.location.hash = "";

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: "",
      isLoggedIn: false,
      isLoggedInWithSpotify: false,
      UserName: "",
      spotifyUserID: "",
      isWelcoming: false,
      isSigningUp: false,
      isLoggingIn: false,
      isViewingPosts: true,
      isViewingComments: false,

      commentsData: {
        UserName: "",
        PostID: -1,
        PostSong: "",
        PostDescription: "",
        pageNumber: 0,
        PostDate: "",
        Playlist: ""
      }
    };
  }

  componentDidMount() {
    let _token = hash.access_token;
    if (_token) {
      //use spotify implicit grant token
      this.setState({ token: _token }, () => {
        fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${this.state.token}`
          }
        })
          .then(res => {
            return res.json();
          })
          .then(result => {
            console.log(result);
            this.setState({
              isLoggedIn: true,
              isLoggedInWithSpotify: true,
              UserName: result.display_name,
              spotifyUserID: result.id
            });
          });
      });
    } else {
      //use spotify client creditials flow token
      fetch("/api/token")
        .then(res => res.json())
        .then(result => this.setState({ token: result.access_token }))
        .then(this.setState({ isViewingPosts: true }));
    }
  }

  handleSignUpOpen = () => {
    this.setState({
      isSigningUp: true,
      isViewingPosts: false,
      isLoggingIn: false,
      isViewingComments: false
    });
  };

  handleSignUpClose = () => {
    this.setState({
      isSigningUp: false,
      isViewingPosts: true,
      isLoggingIn: false,
      isViewingComments: false
    });
  };

  handleSignUp = UserName => {
    this.setState({ UserName: UserName, isWelcoming: true });
    this.handleSignUpClose();
  };

  handleWelcomeGoBack = () => {
    this.setState({ isWelcoming: false, UserName: "" }, this.handleLogInOpen());
  };

  handleLogIn = UserName => {
    this.setState({
      UserName: UserName,
      isLoggedIn: true,
      isViewingPosts: true,
      isLoggingIn: false
    });
  };

  handleLogOut = () => {
    fetch("/api/token")
      .then(res => res.json())
      .then(result => this.setState({ token: result.access_token }))
      .then(
        this.setState({
          isLoggedIn: false,
          UserName: "",
          isLoggedInWithSpotify: false
        })
      );
  };

  handleLogInOpen = () => {
    this.setState({
      isLoggingIn: true,
      isViewingPosts: false,
      isSigningUp: false,
      isViewingComments: false
    });
  };

  handleLogInClose = () => {
    this.setState({
      isLoggingIn: false,
      isViewingPosts: true,
      isSigningUp: false,
      isViewingComments: false
    });
  };

  handleViewComments = e => {
    this.setState({
      isViewingPosts: false,
      isViewingComments: true,
      commentsData: {
        UserName: e.UserName,
        PostID: e.PostID,
        PostSong: e.PostSong,
        PostDescription: e.PostDescription,
        pageNumber: e.pageNumber,
        PostDate: e.PostDate,
        Playlist: e.Playlist
      }
    });
  };

  handleGoBackComments = () => {
    this.setState({
      isViewingPosts: true,
      isViewingComments: false,
      commentsPostID: -1
    });
  };

  render() {
    return (
      <div className="App">
        {this.state.isWelcoming && (
          <Welcome
            UserName={this.state.UserName}
            handleWelcomeGoBack={this.handleWelcomeGoBack}
          />
        )}
        <Navbar
          UserName={this.state.UserName}
          isLoggedIn={this.state.isLoggedIn}
          handleSignUpOpen={this.handleSignUpOpen}
          handleLogInOpen={this.handleLogInOpen}
          handleLogOut={this.handleLogOut}
        />
        <div className="container">
          {this.state.isSigningUp && (
            <SignUp
              handleSignUpClose={this.handleSignUpClose}
              handleSignUp={this.handleSignUp}
            />
          )}
          {this.state.isLoggingIn && (
            <LogIn
              handleLogInClose={this.handleLogInClose}
              handleLogIn={this.handleLogIn}
            />
          )}
          {this.state.isViewingComments && (
            <div>
              <button
                className="btn btn-secondary go-back-comments"
                onClick={this.handleGoBackComments}
              >
                Go Back
              </button>
              <Post
                UserName={this.state.commentsData.UserName}
                currentUserName={this.state.UserName}
                PostID={this.state.commentsData.PostID}
                song={this.state.commentsData.PostSong}
                description={this.state.commentsData.PostDescription}
                PostDate={this.state.commentsData.PostDate}
                Playlist={this.state.commentsData.Playlist}
                token={this.state.token}
                isViewingComments={this.state.isViewingComments}
              />
              <Comments
                isLoggedIn={this.state.isLoggedIn}
                isLoggedInWithSpotify={this.state.isLoggedInWithSpotify}
                UserName={this.state.commentsData.UserName}
                currentUserName={this.state.UserName}
                PostID={this.state.commentsData.PostID}
                Playlist={this.state.commentsData.Playlist}
                handleGoBackComments={this.handleGoBackComments}
                token={this.state.token}
              />
            </div>
          )}
          {this.state.isViewingPosts && (
            <Posts
              isLoggedIn={this.state.isLoggedIn}
              isLoggedInWithSpotify={this.state.isLoggedInWithSpotify}
              currentUserName={this.state.UserName}
              spotifyUserID={this.state.spotifyUserID}
              handleViewComments={this.handleViewComments}
              isViewingComments={this.state.isViewingComments}
              pageNumber={this.state.commentsData.pageNumber}
              token={this.state.token}
            />
          )}
        </div>
      </div>
    );
  }
}

export default App;
