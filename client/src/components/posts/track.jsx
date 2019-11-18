import React, { Component } from "react";
import "./track.scss";

class Track extends Component {
  render() {
    return (
      <div
        className="track"
        onClick={() => this.props.trackClick(this.props.id)}
      >
        <div className="frame">
          <img src={this.props.trackAlbumArtUrl} alt={this.props.trackTitle} />
        </div>

        <div className="meta">
          <div>
            <h2>{this.props.trackTitle}</h2>
            <h3>
              {this.props.trackArtist} • {this.props.trackAlbum}
            </h3>
          </div>
        </div>
      </div>
    );
  }
}

export default Track;
