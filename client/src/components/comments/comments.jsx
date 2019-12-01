import React, { Component } from "react";
import Comment from "./comment";
import NewComment from "./newComment";
import "./comments.scss";

class Comments extends Component {
  constructor() {
    super();
    this.state = {
      comments: []
    };
  }

  componentDidMount() {
    this.refreshComments();
  }

  updateIsInPlaylist = (CommentID, value) => {
    fetch("/api/comments", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        CommentID: CommentID,
        value: value
      })
    }).then(() => {
      console.log("comment updated");
      this.refreshComments();
    });
  };

  addTrackToPlaylist = (CommentID, track) => {
    fetch(
      `https://api.spotify.com/v1/playlists/${this.props.Playlist}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.props.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          uris: [`spotify:track:${track}`]
        })
      }
    )
      .then(() => this.updateIsInPlaylist(CommentID, true))
      .catch(e => {
        console.log(e);
      });
  };

  removeTrackFromPlaylist = (CommentID, track) => {
    fetch(
      `https://api.spotify.com/v1/playlists/${this.props.Playlist}/tracks`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.props.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tracks: [{ uri: `spotify:track:${track}` }]
        })
      }
    )
      .then(() => this.updateIsInPlaylist(CommentID, false))
      .catch(e => {
        console.log(e);
      });
  };

  addAllTracksToPlaylist = () => {
    this.state.comments.forEach(comment => {
      if (!comment.IsInPlaylist) {
        this.addTrackToPlaylist(comment.CommentID, comment.CommentSong);
      }
    });
  };

  refreshComments = () => {
    fetch(`/api/comments/${this.props.PostID}`)
      .then(res => res.json())
      .then(comments =>
        this.setState({ comments }, () =>
          console.log(`comments fetched`, comments)
        )
      );
  };

  render() {
    return (
      <div className="comments-section">
        <div className="comments-header">
          <h1>Comments</h1>
          {this.props.currentUserName === this.props.UserName &&
            this.props.isLoggedInWithSpotify &&
            this.props.Playlist && (
              <button
                className="btn btn-secondary btn-spotify"
                onClick={this.addAllTracksToPlaylist}
              >
                Add All Tracks To Playlist
              </button>
            )}
        </div>
        {this.props.isLoggedIn && (
          <NewComment
            PostID={this.props.PostID}
            refresh={this.refreshComments}
            token={this.props.token}
            currentUserName={this.props.currentUserName}
            Playlist={this.props.Playlist}
          />
        )}

        <div className="comments-container">
          {this.state.comments.map(comment => (
            <Comment
              key={comment.CommentID}
              CommentID={comment.CommentID}
              description={comment.CommentDescription}
              song={comment.CommentSong}
              CommentDate={comment.CommentDate}
              UserName={comment.UserName}
              currentUserName={this.props.currentUserName}
              postUserName={this.props.UserName}
              isLoggedInWithSpotify={this.props.isLoggedInWithSpotify}
              IsInPlaylist={comment.IsInPlaylist}
              Playlist={this.props.Playlist}
              token={this.props.token}
              refresh={this.refreshComments}
              removeTrackFromPlaylist={this.removeTrackFromPlaylist}
              addTrackToPlaylist={this.addTrackToPlaylist}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Comments;
