import React, { Component } from "react";
import "./comment.scss";
import moment from "moment";
import * as Vibrant from "node-vibrant";

class Comment extends Component {
  constructor() {
    super();
    this.state = {
      trackAlbumArtUrl: null,
      trackTitle: null,
      trackArtist: null,
      trackAlbum: null,
      displayWidget: false
    };
  }

  componentDidMount() {
    fetch(`https://api.spotify.com/v1/tracks/${this.props.song}`, {
      headers: {
        Authorization: `Bearer ${this.props.token}`
      }
    })
      .then(res => res.json())
      .then(result => {
        this.setState({
          trackAlbumArtUrl: result.album.images[1].url,
          trackTitle: result.name,
          trackArtist: result.artists[0].name,
          trackAlbum: result.album.name
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          trackAlbumArtUrl: "/unknownTrack.jpg",
          trackTitle: "[unknown track]",
          trackArtist: "[unkown artist]",
          trackAlbum: "[unknown album]"
        });
      });
  }

  handleDelete = () => {
    fetch(`/api/comments/${this.props.CommentID}`, {
      method: "DELETE"
    }).then(() => {
      this.props.refresh();
    });
  };

  handleFameClick = () => {
    this.setState({ displayWidget: !this.state.displayWidget });
  };

  handleAddOrRemove = () => {
    this.props.IsInPlaylist
      ? this.props.removeTrackFromPlaylist(
          this.props.CommentID,
          this.props.song
        )
      : this.props.addTrackToPlaylist(this.props.CommentID, this.props.song);
  };

  handleCommentClick = () => {
    Vibrant.from(this.state.trackAlbumArtUrl)
      .getPalette()
      .then(palette => {
        console.log(palette);
        document.body.style.background = `linear-gradient(-30deg, ${palette.LightMuted.hex}, #ffffff)`;
      });
  };

  render() {
    return (
      <div onClick={this.handleCommentClick}>
        <div
          className={
            this.props.IsInPlaylist ? "comment is-in-playlist" : "comment"
          }
        >
          <div className="frame" onClick={this.handleFameClick}>
            <img
              src={this.state.trackAlbumArtUrl}
              alt={`album art for ${this.state.trackAlbum}`}
            />
          </div>
          <div className="info">
            <div className="user-info">
              <div className="username-date">
                <p className="username">Posted by {this.props.UserName}</p>
                <p className="date">
                  {moment(this.props.CommentDate).format("MMM Do YY, h:mm a")}
                </p>
              </div>
              <h2 className="description">{this.props.description}</h2>
            </div>
            <div className="meta">
              <div>
                <h2>{this.state.trackTitle}</h2>
                <h3>
                  {this.state.trackArtist} • {this.state.trackAlbum}
                </h3>
              </div>
              <div className="buttons">
                {this.props.currentUserName === this.props.postUserName &&
                  this.props.isLoggedInWithSpotify &&
                  this.props.Playlist && (
                    <button
                      className="btn btn-secondary btn-spotify"
                      onClick={() => {
                        this.handleAddOrRemove();
                      }}
                    >
                      Add or Remove From Playlist
                    </button>
                  )}
                {this.props.UserName === this.props.currentUserName && (
                  <button
                    className="btn btn-danger"
                    onClick={this.handleDelete}
                  >
                    DELETE
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {this.state.displayWidget && (
          <iframe
            src={`https://open.spotify.com/embed/track/${this.props.song}`}
            title={this.props.song}
            width="100%"
            height="80"
            frameBorder="0"
            allowtransparency="true"
            allow="encrypted-media"
          ></iframe>
        )}
      </div>
    );
  }
}

export default Comment;
