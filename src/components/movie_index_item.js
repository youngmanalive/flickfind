import React from "react";
import { imgURLBuilder } from "../config/api_util";
import Rating from 'react-rating';
import "../css/movie_index_item.css";

const Votes = ({ vote_average, vote_count }) => !vote_count ? <span>No votes</span> :
  <><Rating readonly stop={10} initialRating={vote_average} /> - <span>{vote_count} votes</span></>;

const MovieIndexItem = movie => (
  <>
    <div className="movie-poster">
      <img src={imgURLBuilder(movie.poster_path)} alt={movie.title} />
    </div>
    <div className="movie-details">
      <h1 className="movie-title">{movie.title}</h1>
      <h2 className="movie-year">Released: {movie.release_date.slice(0, 4)}</h2>
      <span className="movie-rating"><Votes {...movie} /></span>
      <p className="movie-overview">{movie.overview}</p>
    </div>
  </>
);

export default MovieIndexItem;