import React, { Component } from "react";
import "./post.scss";

class Post extends Component {
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
    fetch(`/api/posts/${this.props.postID}`, {
      method: "DELETE"
    }).then(() => {
      this.props.refresh();
    });
  };

  handleFameClick = () => {
    this.setState({ displayWidget: !this.state.displayWidget });
  };

  render() {
    return (
      <div>
        <div className="post">
          <div className="frame" onClick={this.handleFameClick}>
            <img src={this.state.trackAlbumArtUrl} alt="" />
          </div>
          <div className="info">
            <div className="user-info">
              <h2
                className={
                  this.props.isViewingComments
                    ? "description bigger"
                    : "description"
                }
              >
                {this.props.description}
              </h2>
              <p className="username">Posted by {this.props.UserName}</p>
            </div>
            <div className="meta">
              <div>
                <h2>{this.state.trackTitle}</h2>
                <h3>
                  {this.state.trackArtist} • {this.state.trackAlbum}
                </h3>
              </div>
            </div>
            {!this.props.isViewingComments && (
              <div className="buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    this.props.handleViewComments({
                      UserName: this.props.UserName,
                      PostID: this.props.postID,
                      PostSong: this.props.song,
                      PostDescription: this.props.description,
                      pageNumber: this.props.pageNumber
                    })
                  }
                >
                  View Comments ({this.props.numComments})
                </button>
                {this.props.UserID === this.props.currentUserID && (
                  <button
                    className="btn btn-danger"
                    onClick={this.handleDelete}
                  >
                    DELETE
                  </button>
                )}
              </div>
            )}
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

export default Post;
