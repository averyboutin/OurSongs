import React, { Component } from "react";
import Track from "./track";
import "./newPost.scss";

class NewPost extends Component {
  constructor() {
    super();
    this.state = {
      results: [],
      postSong: "",
      postDescription: "",
      makeSpotifyPlaylist: false,
      playlistID: "",
      isMakingNew: false,
      songToPost: "",
      songToPostID: "",
      badPostSongMessage: "",
      badPostDescriptionMessage: ""
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.songToPost === "" && this.state.postDescription === "") {
      this.setState({
        badPostSongMessage: "Please select a song",
        badPostDescriptionMessage: "Posts must have a description"
      });
    } else if (this.state.songToPost === "") {
      this.setState({
        badPostSongMessage: "Please select a song"
      });
    } else if (this.state.postDescription === "") {
      this.setState({
        badPostDescriptionMessage: "Posts must have a description"
      });
    } else {
      if (this.state.makeSpotifyPlaylist && this.props.isLoggedInWithSpotify) {
        fetch(
          `https://api.spotify.com/v1/users/${this.props.spotifyUserID}/playlists`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.props.token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: this.state.postDescription,
              public: true
            })
          }
        )
          .then(res => res.json())
          .then(response => {
            this.setState({ playlistID: response.id });
            return response.id;
          })
          .then(id => {
            fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${this.props.token}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                uris: [`spotify:track:${this.state.songToPostID}`]
              })
            });
          })
          .then(() => {
            this.makePost();
          });
      } else this.makePost();
    }
  };

  makePost = callback => {
    fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        PostDescription: this.state.postDescription,
        //using songToPostID in case user edits id after clicking on track
        PostSong: this.state.songToPostID,
        PostDate: new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        UserName: this.props.currentUserName,
        Playlist: this.state.playlistID
      })
    })
      .then(() => {
        this.props.refresh();
        this.setState({
          results: [],
          postSong: "",
          postDescription: "",
          makeSpotifyPlaylist: false,
          playlistID: "",
          isMakingNew: false,
          songToPost: "",
          songToPostID: "",
          badPostSongMessage: "",
          badPostDescriptionMessage: ""
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleOnChange = e => {
    this.setState({ postSong: e.target.value, badPostSongMessage: "" });
    fetch(
      `https://api.spotify.com/v1/search?q=${e.target.value}&type=track&market=US&limit=6`,
      {
        headers: {
          Authorization: `Bearer ${this.props.token}`
        }
      }
    )
      .then(res => res.json())
      .then(result => {
        if (result.tracks) {
          this.setState({
            results: result.tracks.items
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ results: [] });
      });
  };

  handleTrackClick = id => {
    const isTrack = element => element.id === id;
    const selectedTrackIndex = this.state.results.findIndex(isTrack);
    const selectedTrack = this.state.results[selectedTrackIndex];

    this.setState({
      results: [],
      postSong: id,
      songToPost: `${selectedTrack.name} by ${selectedTrack.artists[0].name}`,
      songToPostID: id,
      badPostSongMessage: ""
    });
  };

  handleCreateNewPost = () => {
    this.setState({ isMakingNew: true });
  };

  handleCancel = () => {
    this.setState({
      results: [],
      postSong: "",
      postDescription: "",
      makeSpotifyPlaylist: false,
      playlistID: "",
      isMakingNew: false,
      songToPost: "",
      songToPostID: "",
      badPostSongMessage: "",
      badPostDescriptionMessage: ""
    });
  };

  render() {
    return (
      <div>
        {this.state.isMakingNew ? (
          <form className="new-post-form" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label className="form-text text-muted" htmlFor="PostSong">
                Enter Spotify Track ID{" "}
                {this.state.songToPost && (
                  <span htmlFor="PostSong">({this.state.songToPost})</span>
                )}
              </label>
              <input
                onChange={this.handleOnChange}
                value={this.state.postSong}
                className={
                  this.state.badPostSongMessage
                    ? "form-control is-invalid"
                    : "form-control"
                }
                type="text"
                name="PostSong"
                id="PostSong"
              />
              <div className="invalid-feedback">
                {this.state.badPostSongMessage}
              </div>
            </div>
            <div>
              {this.state.results.map(track => (
                <Track
                  key={track.id}
                  trackClick={this.handleTrackClick}
                  trackAlbumArtUrl={track.album.images[2].url}
                  trackTitle={track.name}
                  trackArtist={track.artists[0].name}
                  trackAlbum={track.album.name}
                  id={track.id}
                />
              ))}
            </div>
            <div className="form-group">
              <label className="form-text text-muted" htmlFor="PostDescription">
                Enter Description
              </label>
              <input
                onChange={e =>
                  this.setState({
                    postDescription: e.target.value,
                    badPostDescriptionMessage: ""
                  })
                }
                value={this.state.postDescription}
                className={
                  this.state.badPostDescriptionMessage
                    ? "form-control is-invalid"
                    : "form-control"
                }
                type="text"
                name="PostDescription"
                id="PostDescription"
              />
              <div className="invalid-feedback">
                {this.state.badPostDescriptionMessage}
              </div>
            </div>
            <div className="form-group">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="makeSpotifyPlaylist"
                  defaultChecked={this.state.makeSpotifyPlaylist}
                  onChange={e => {
                    this.setState({
                      makeSpotifyPlaylist: !this.state.makeSpotifyPlaylist
                    });
                  }}
                  disabled={this.props.isLoggedInWithSpotify ? "" : "disabled"}
                />
                <label
                  className="custom-control-label"
                  htmlFor="makeSpotifyPlaylist"
                >
                  Make this post a Spotify playlist
                </label>
              </div>
            </div>

            <div className="postOrCancel">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.handleCancel}
              >
                Cancel
              </button>
              <input className="btn btn-primary" type="submit" value="Post" />
            </div>
          </form>
        ) : (
          <button
            onClick={this.handleCreateNewPost}
            className="btn btn-primary"
          >
            Create New Post
          </button>
        )}
      </div>
    );
  }
}

export default NewPost;
