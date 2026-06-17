import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <article className="movie-card">
      <img src={movie.posterUrl} alt={`${movie.title} poster`} />
      <div className="movie-card-body">
        <div className="movie-title-row">
          <h3>{movie.title}</h3>
          <span>{movie.rating.toFixed(1)}</span>
        </div>
        <p>{movie.overview}</p>
        <div className="meta-row">
          <span>{movie.language}</span>
          <span>{movie.duration} min</span>
          <span>{movie.certification}</span>
        </div>
        <div className="genre-row">
          {movie.genre.map((genre) => (
            <span key={genre}>{genre}</span>
          ))}
        </div>
        <Link className="btn btn-primary" to={`/booking?movie=${movie.id}`}>
          Book Tickets
        </Link>
      </div>
    </article>
  );
}
