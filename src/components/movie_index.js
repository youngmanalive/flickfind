import React from 'react';
import '../css/movie_index.css';
import Pagination from "react-js-pagination";
import MovieIndexItem from "./movie_index_item";

class MovieIndex extends React.Component {
  render() {
    const { movies, activePage, totalResults, error } = this.props;
    
    if (error) return <h1 className="movie-index-msg">Oops, something went wrong...</h1>;

    if (totalResults === null) return (
      <div>
        <img className="film-icon" src={require('../img/camera.svg')} alt="film icon" />
        <h1 className="welcome">Find a Flick!</h1>
      </div>
    );

    if (totalResults === 0) return <h1 className="movie-index-msg">No movies found! :(</h1>;

    return (
      <>
        <div className="movie-index-results">
          <h1>{totalResults} movie{totalResults === 1 ? '' : 's'} found!</h1>
          <Pagination
            activePage={activePage}
            itemsCountPerPage={20}
            totalItemsCount={totalResults}
            pageRangeDisplayed={10}
            onChange={this.props.handlePageChange}
          />
          <h1>page {activePage} of {Math.ceil(totalResults / 20)}</h1>
        </div>
        <ul className="movie-list">
          {movies.map(movie => (
            <li key={movie.id} className="movie-index-item">
              <MovieIndexItem {...movie} />
            </li>
          ))}
        </ul>
      </>
    );
  }
}

export default MovieIndex;