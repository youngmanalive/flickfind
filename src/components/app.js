import React from "react";
import MovieIndex from "./movie_index";
import { fetchMovies } from "../config/api_util";
import copyToClipboard from "../config/copy_to_clipboard";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.defaultState();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFetch = this.handleFetch.bind(this);
    this.handleHash = this.handleHash.bind(this);
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

  componentDidMount() {
    if (window.location.hash) this.handleHash();
    window.addEventListener("hashchange", this.handleHash);
  }

  handleHash() {
    const { location: { hash } } = window;
    if (hash) {
      const query = decodeURI(hash.slice(1, hash.length));
      this.setState({ query }, this.handleFetch); 
    }
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
        this.typingTimeout = setTimeout(() => this.handleFetch(1, query), 250);
      });
    }
  }

  handleFetch(page = 1, query) {
    // handle possibility that query was cleared
    if (!this.state.query.length) return;
    
    fetchMovies(this.state.query, page).then(res => {
      if (res.error) {
        this.setState({ error: true });
      } else {
        // one last check when response is received:
        // if query state has changed during request, do not update results.
        // this means a new response is incoming or the query has been cleared.
        // page changes are unaffected by this.
        if (!this.state.query.length || (query && query !== this.state.query)) return;

        this.setState({
          activePage: page,
          movies: res.results,
          totalResults: res.total_results <= 20000 ? res.total_results : 20000
        });
      }
    });
  }

  render() {
    const link = (
      <div className="link-share">
        <button 
          className="share-button"
          onClick={() => copyToClipboard(this.state.query)}>
          Share this search
        </button>
      </div>
    );

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
            {this.state.query.length && this.state.totalResults ? link : null }
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
