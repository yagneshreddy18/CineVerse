import { useMemo, useState } from "react";
import Button from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { bookingApi, movieApi } from "../services/movieService.js";
import { ROLES } from "../utils/constants.js";

const emptyForm = {
  title: "",
  genre: "Drama",
  language: "Hindi",
  duration: 120,
  releaseDate: "2026-01-01",
  rating: 7.5,
  certification: "UA",
  posterUrl: "",
  overview: "",
};

function toFormMovie(movie) {
  return {
    ...movie,
    genre: movie.genre.join(", "),
  };
}

export default function Manage() {
  const { user } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [notice, setNotice] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const stats = bookingApi.stats();
  const events = bookingApi.listEvents().slice(0, 4);
  const movies = useMemo(() => movieApi.listMovies({ sort: "title" }), [refreshKey]);
  const isAdmin = user.role === ROLES.ADMIN;

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingMovieId(null);
  }

  function submit(event) {
    event.preventDefault();
    if (editingMovieId) {
      const updated = movieApi.updateMovie(editingMovieId, form);
      setNotice(`${updated.title} updated.`);
    } else {
      const created = movieApi.addMovie(form);
      setNotice(`${created.title} added to the catalog.`);
    }
    resetForm();
    setRefreshKey((key) => key + 1);
  }

  function startEdit(movie) {
    setEditingMovieId(movie.id);
    setForm(toFormMovie(movie));
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteMovie(movieId) {
    movieApi.deleteMovie(movieId);
    setNotice("Movie deleted from catalog.");
    if (editingMovieId === movieId) resetForm();
    setRefreshKey((key) => key + 1);
  }

  function eventTitle(event) {
    if (event.type === "BOOKING_CONFIRMED") return "Booking confirmed";
    return event.type.replaceAll("_", " ").toLowerCase();
  }

  function eventDetail(event) {
    const bookingId = event.payload?.bookingId?.replace("b-", "").slice(-6);
    const seats = event.payload?.seats?.join(", ");
    return `Booking #${bookingId} / seats ${seats}`;
  }

  return (
    <section className="page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{isAdmin ? "Admin Console" : "Theatre Owner Console"}</p>
          <h1>Manage CineVerse</h1>
        </div>
      </div>

      <div className="stat-grid">
        <div><strong>{stats.users}</strong><span>Users</span></div>
        <div><strong>{stats.theatres}</strong><span>Theatres</span></div>
        <div><strong>{stats.shows}</strong><span>Shows</span></div>
        <div><strong>{stats.bookings}</strong><span>Bookings</span></div>
      </div>

      <div className="manage-layout">
        <form className="manage-form" onSubmit={submit}>
          <div className="form-title-row">
            <div>
              <p className="eyebrow">Catalog Control</p>
              <h2>{editingMovieId ? "Update movie" : "Add movie"}</h2>
            </div>
            {editingMovieId && <Button type="button" variant="ghost" onClick={resetForm}>Cancel Edit</Button>}
          </div>
          <label>
            Movie title
            <input name="title" value={form.title} onChange={updateField} placeholder="Example: Project Premiere" required />
          </label>
          <label>
            Genres
            <input name="genre" value={form.genre} onChange={updateField} placeholder="Drama, Action" required />
          </label>
          <div className="form-grid">
            <label>
              Language
              <input name="language" value={form.language} onChange={updateField} required />
            </label>
            <label>
              Duration
              <input name="duration" type="number" min="1" value={form.duration} onChange={updateField} required />
            </label>
            <label>
              Release date
              <input name="releaseDate" type="date" value={form.releaseDate} onChange={updateField} required />
            </label>
            <label>
              Rating
              <input name="rating" type="number" min="0" max="10" step="0.1" value={form.rating} onChange={updateField} required />
            </label>
          </div>
          <label>
            Poster URL
            <input name="posterUrl" value={form.posterUrl} onChange={updateField} placeholder="Optional poster image URL" />
          </label>
          <label>
            Overview
            <textarea name="overview" value={form.overview} onChange={updateField} placeholder="Write a short synopsis" required />
          </label>
          <Button type="submit">{editingMovieId ? "Update Movie" : "Save Movie"}</Button>
          {notice && <p className="notice">{notice}</p>}
        </form>

        <section className="system-notes">
          <div>
            <p className="eyebrow">Catalog Updates</p>
            <h2>Existing movies</h2>
          </div>
          <div className="manage-movie-list">
            {movies.map((movie) => (
              <article key={movie.id} className={editingMovieId === movie.id ? "active" : ""}>
                <img src={movie.posterUrl} alt={`${movie.title} poster`} />
                <div>
                  <strong>{movie.title}</strong>
                  <span>{movie.language} / {movie.genre.join(", ")} / {movie.rating.toFixed(1)}</span>
                </div>
                <div className="movie-actions">
                  <Button type="button" variant="ghost" onClick={() => startEdit(movie)}>Edit</Button>
                  {isAdmin && <Button type="button" variant="ghost" onClick={() => deleteMovie(movie.id)}>Delete</Button>}
                </div>
              </article>
            ))}
          </div>

          <div className="event-list-header">
            <h2>Notification activity</h2>
            <span>{events.length ? `${events.length} latest` : "No activity yet"}</span>
          </div>
          <div className="event-list">
            {events.length === 0 ? (
              <p className="muted">Confirm a booking to see notification processing here.</p>
            ) : events.map((event) => (
              <article key={event.id}>
                <div>
                  <strong>{eventTitle(event)}</strong>
                  <span>{eventDetail(event)}</span>
                </div>
                <span className="status-pill">{event.status.toLowerCase()}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
