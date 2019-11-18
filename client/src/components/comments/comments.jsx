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
        <h1>Comments</h1>

        {this.props.isLoggedIn && (
          <NewComment
            PostID={this.props.PostID}
            refresh={this.refreshComments}
            token={this.props.token}
            UserID={this.props.UserID}
          />
        )}

        <div className="comments-container">
          {this.state.comments.map(comment => (
            <Comment
              key={comment.CommentID}
              CommentID={comment.CommentID}
              description={comment.CommentDescription}
              song={comment.CommentSong}
              UserID={comment.UserID}
              UserName={comment.UserName}
              currentUserID={this.props.UserID}
              token={this.props.token}
              refresh={this.refreshComments}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Comments;
