import React, { Component } from "react";
import Post from "./post";
import "./posts.scss";
import NewPost from "./newPost";

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      numPosts: 5,
      pageNumber: 0,
      postCount: 0
    };
  }

  componentDidMount() {
    this.setState({ pageNumber: this.props.pageNumber }, () => {
      this.refreshPosts();
    });
  }

  refreshPosts = () => {
    fetch(`/api/posts/page/${this.state.numPosts}/${this.state.pageNumber}`)
      .then(res => res.json())
      .then(posts =>
        this.setState({ posts }, () =>
          console.log(
            `${this.state.numPosts} posts fetched on page ${this.state.pageNumber}`,
            posts
          )
        )
      )
      .then(() => this.getPostCount());
  };

  getPostCount = () => {
    fetch("/api/posts/count")
      .then(res => res.json())
      .then(res =>
        this.setState({ postCount: res.Count }, () =>
          console.log(`${this.state.postCount} posts total`, res)
        )
      );
  };

  handlePreviousPage = () => {
    if (this.state.pageNumber > 0) {
      const previousPage = this.state.pageNumber - 1;
      this.setState({ pageNumber: previousPage }, () => {
        this.refreshPosts();
      });
    }
  };

  handleNextPage = () => {
    if (
      this.state.numPosts * (this.state.pageNumber + 1) <
      this.state.postCount
    ) {
      const nextPage = this.state.pageNumber + 1;
      this.setState({ pageNumber: nextPage }, () => {
        this.refreshPosts();
      });
    }
  };

  render() {
    return (
      <div className="posts-section">
        <h1>Posts</h1>
        {this.props.isLoggedIn && (
          <NewPost
            refresh={this.refreshPosts}
            token={this.props.token}
            currentUserName={this.props.currentUserName}
            isLoggedInWithSpotify={this.props.isLoggedInWithSpotify}
            spotifyUserID={this.props.spotifyUserID}
          />
        )}

        <div className="posts-container">
          {this.state.posts.map(post => (
            <Post
              key={post.PostID}
              postID={post.PostID}
              refresh={this.refreshPosts}
              description={post.PostDescription}
              song={post.PostSong}
              UserName={post.UserName}
              numComments={post.numComments}
              PostDate={post.PostDate}
              Playlist={post.Playlist}
              currentUserName={this.props.currentUserName}
              token={this.props.token}
              handleViewComments={this.props.handleViewComments}
              isViewingComments={this.props.isViewingComments}
              pageNumber={this.state.pageNumber}
            />
          ))}
        </div>

        <div className="pageNav">
          <button
            className={
              this.state.pageNumber === 0
                ? "btn btn-secondary muted"
                : "btn btn-secondary"
            }
            onClick={this.handlePreviousPage}
          >
            Previous Page
          </button>

          <h4>page {this.state.pageNumber + 1}</h4>

          <button
            className={
              this.state.numPosts * (this.state.pageNumber + 1) >=
              this.state.postCount
                ? "btn btn-secondary muted"
                : "btn btn-secondary"
            }
            onClick={this.handleNextPage}
          >
            Next Page
          </button>
        </div>
      </div>
    );
  }
}

export default Posts;
