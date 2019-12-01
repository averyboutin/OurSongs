import React, { Component } from "react";
import Track from "../posts/track";
import "./newComment.scss";

class NewComment extends Component {
  constructor() {
    super();
    this.state = {
      results: [],
      commentSong: "",
      commentDescription: "",
      isMakingNew: false,
      commentToPost: "",
      commentToPostID: "",
      badCommentSongMessage: "",
      badCommentDescriptionMessage: ""
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    if (
      this.state.commentToPost === "" &&
      this.state.commentDescription === ""
    ) {
      this.setState({
        badCommentSongMessage: "Please select a song",
        badCommentDescriptionMessage: "Comments must have a description"
      });
    } else if (this.state.commentToPost === "") {
      this.setState({
        badCommentSongMessage: "Please select a song"
      });
    } else if (this.state.commentDescription === "") {
      this.setState({
        badCommentDescriptionMessage: "Comments must have a description"
      });
    } else {
      fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          PostID: this.props.PostID,
          CommentDescription: this.state.commentDescription,
          //using commentToPostID in case user edits id after clicking on track
          CommentSong: this.state.commentToPostID,
          CommentDate: new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " "),
          UserName: this.props.currentUserName
        })
      })
        .then(() => {
          // if (this.props.Playlist) {
          //   fetch(
          //     `https://api.spotify.com/v1/playlists/${this.props.Playlist}/tracks`,
          //     {
          //       method: "POST",
          //       headers: {
          //         Authorization: `Bearer ${this.props.token}`,
          //         "Content-Type": "application/json"
          //       },
          //       body: JSON.stringify({
          //         uris: [`spotify:track:${this.state.commentToPostID}`]
          //       })
          //     }
          //   );
          // }
        })
        .then(() => {
          this.props.refresh();
          this.setState({
            results: [],
            commentSong: "",
            commentDescription: "",
            isMakingNew: false,
            commentToPost: "",
            badCommentSongMessage: "",
            badCommentDescriptionMessage: ""
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  handleOnChange = e => {
    this.setState({ commentSong: e.target.value, badCommentSongMessage: "" });
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
      commentSong: id,
      commentToPost: `${selectedTrack.name} by ${selectedTrack.artists[0].name}`,
      commentToPostID: id,
      badCommentSongMessage: ""
    });
  };

  handleCreateNewComment = () => {
    this.setState({ isMakingNew: true });
  };

  handleCancel = () => {
    this.setState({
      results: [],
      commentSong: "",
      commentDescription: "",
      isMakingNew: false,
      commentToPost: "",
      commentToPostID: "",
      badCommentSongMessage: "",
      badCommentDescriptionMessage: ""
    });
  };

  render() {
    return (
      <div>
        {this.state.isMakingNew ? (
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label className="form-text text-muted" htmlFor="CommentSong">
                Enter Spotify Track ID{" "}
                {this.state.commentToPost && (
                  <span htmlFor="CommentSong">
                    ({this.state.commentToPost})
                  </span>
                )}
              </label>
              <input
                onChange={this.handleOnChange}
                value={this.state.commentSong}
                className={
                  this.state.badCommentSongMessage
                    ? "form-control is-invalid"
                    : "form-control"
                }
                type="text"
                name="CommentSong"
                id="CommentSong"
              />
              <div className="invalid-feedback">
                {this.state.badCommentSongMessage}
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
              <label
                className="form-text text-muted"
                htmlFor="CommentDescription"
              >
                Enter Description
              </label>
              <input
                onChange={e =>
                  this.setState({
                    commentDescription: e.target.value,
                    badCommentDescriptionMessage: ""
                  })
                }
                value={this.state.commentDescription}
                className={
                  this.state.badCommentDescriptionMessage
                    ? "form-control is-invalid"
                    : "form-control"
                }
                type="text"
                name="CommentDescription"
                id="CommentDescription"
              />
              <div className="invalid-feedback">
                {this.state.badCommentDescriptionMessage}
              </div>
            </div>
            <div className="commentOrCancel">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.handleCancel}
              >
                Cancel
              </button>
              <input
                className="btn btn-primary"
                type="submit"
                value="Comment"
              />
            </div>
          </form>
        ) : (
          <button
            onClick={this.handleCreateNewComment}
            className="btn btn-primary"
          >
            Make A Comment
          </button>
        )}
      </div>
    );
  }
}

export default NewComment;
