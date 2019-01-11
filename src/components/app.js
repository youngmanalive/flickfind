import React from "react";
import MovieIndex from "./movie_index";
import { fetchMovies } from "../config/api_util";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.defaultState();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFetch = this.handleFetch.bind(this);
    this.typingTimeout = null;
  }

  defaultState() {
    return({
      query: "",
      movies: [],
      activePage: 1,
      totalResults: null,
      error: false
    })
  }

  handleInputChange(e) {
    const query = e.currentTarget.value;

    // use a short timeout so we're not firing repeated requests.
    if (this.typingTimeout) clearTimeout(this.typingTimeout);

    // check for empty query
    if (!query.trim().length) {
      this.setState(this.defaultState());
    } else {
      this.setState({ query, error: false }, () => {
        this.typingTimeout = setTimeout(this.handleFetch, 150);
      });
    }
  }

  handleFetch(page = 1) {
    // make sure query has not been cleared during timeout
    if (!this.state.query.length) return;

    fetchMovies(this.state.query, page).then(res => {
      if (res.error) {
        this.setState({ error: true });
      } else {
        this.setState({
          activePage: page,
          movies: res.results,
          totalResults: res.total_results <= 20000 ? res.total_results : 20000
        });
      }
    });
  }

  render() {
    return (
      <div className="app">
        <div className="header-container">
          <div className="title">
            <h1>FlickFind</h1>
            <h2>Search for movies!</h2>
          </div>
          <div className="search">
            <input
              type="text"
              className="search-bar"
              onChange={this.handleInputChange}
              value={this.state.query}
              placeholder="Enter a movie title..."
            />
          </div>
        </div>
        <div className="movie-index">
          <MovieIndex {...this.state} handlePageChange={this.handleFetch} />
        </div>
      </div>
    );
  }
}

export default App;
