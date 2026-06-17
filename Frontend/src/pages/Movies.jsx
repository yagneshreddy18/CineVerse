import { useMemo, useState } from "react";
import MovieCard from "../components/MovieCard.jsx";
import { movieApi } from "../services/movieService.js";
import { movies as seedMovies } from "../utils/seedData.js";

export default function Movies() {
  const genres = useMemo(() => ["All", ...new Set(seedMovies.flatMap((movie) => movie.genre))], []);
  const languages = useMemo(() => ["All", ...new Set(seedMovies.map((movie) => movie.language))], []);
  const [filters, setFilters] = useState({ search: "", genre: "All", language: "All", sort: "rating" });
  const movies = movieApi.listMovies(filters);

  function updateFilter(event) {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  }

  return (
    <section className="page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Movie Catalog Service</p>
          <h1>Browse movies</h1>
        </div>
        <span>{movies.length} results</span>
      </div>
      <div className="filters">
        <input name="search" value={filters.search} onChange={updateFilter} placeholder="Search by title" />
        <select name="genre" value={filters.genre} onChange={updateFilter}>
          {genres.map((genre) => <option key={genre}>{genre}</option>)}
        </select>
        <select name="language" value={filters.language} onChange={updateFilter}>
          {languages.map((language) => <option key={language}>{language}</option>)}
        </select>
        <select name="sort" value={filters.sort} onChange={updateFilter}>
          <option value="rating">Sort by rating</option>
          <option value="releaseDate">Sort by release date</option>
          <option value="title">Sort by title</option>
        </select>
      </div>
      <div className="movie-grid">
        {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </section>
  );
}
