import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { bookingApi, movieApi } from "../services/movieService.js";
import { ROLES } from "../utils/constants.js";

const roleActions = {
  [ROLES.USER]: [
    { title: "Browse movies", text: "Search the latest catalog and compare ratings.", to: "/movies" },
    { title: "Book tickets", text: "Choose a show, lock seats, and confirm booking.", to: "/booking" },
    { title: "Share reviews", text: "Rate movies and add short viewer feedback.", to: "/booking" },
  ],
  [ROLES.THEATRE_OWNER]: [
    { title: "Update catalog", text: "Edit movie details, posters, language, and ratings.", to: "/manage" },
    { title: "Review listings", text: "Check how movies appear to users.", to: "/movies" },
    { title: "Track activity", text: "Monitor booking notifications in the manage console.", to: "/manage" },
  ],
  [ROLES.ADMIN]: [
    { title: "Manage catalog", text: "Add, update, or delete movie records.", to: "/manage" },
    { title: "Book demo seats", text: "Validate the booking workflow end to end.", to: "/booking" },
    { title: "Audit activity", text: "Review platform activity and service health.", to: "/manage" },
  ],
};

export default function Dashboard() {
  const { user } = useAuth();
  const stats = bookingApi.stats();
  const movies = movieApi.listMovies().slice(0, 3);
  const bookings = bookingApi.listBookings(user).slice(0, 4);
  const actions = roleActions[user.role];
  const canBook = user.role !== ROLES.THEATRE_OWNER;

  return (
    <section className="page">
      <div className="hero-band">
        <div>
          <p className="eyebrow">Welcome back, {user.name}</p>
          <h1>CineVerse dashboard</h1>
          <p>Discover movies, manage catalog details, and run the booking workflow from one clean workspace.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/movies">Browse Movies</Link>
            {canBook ? <Link className="btn btn-secondary" to="/booking">Start Booking</Link> : <Link className="btn btn-secondary" to="/manage">Manage Catalog</Link>}
          </div>
        </div>
        <img src="https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=900&q=80" alt="Movie theatre screen" />
      </div>

      <div className="stat-grid">
        <div><strong>{stats.movies}</strong><span>Movies</span></div>
        <div><strong>{stats.shows}</strong><span>Shows</span></div>
        <div><strong>{stats.bookings}</strong><span>Bookings</span></div>
        <div><strong>Rs {stats.totalRevenue}</strong><span>Revenue</span></div>
      </div>

      <section className="quick-panel">
        <div className="section-heading">
          <h2>{user.role === ROLES.USER ? "What you can do" : "Workspace shortcuts"}</h2>
          <span>{user.role.replaceAll("_", " ")}</span>
        </div>
        <div className="quick-action-grid">
          {actions.map((action) => (
            <Link key={action.title} to={action.to}>
              <strong>{action.title}</strong>
              <span>{action.text}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="two-column">
        <section>
          <div className="section-heading">
            <h2>Top catalog picks</h2>
            <Link to="/movies">View all</Link>
          </div>
          <div className="compact-list">
            {movies.map((movie) => (
              <article key={movie.id}>
                <img src={movie.posterUrl} alt={`${movie.title} poster`} />
                <div>
                  <h3>{movie.title}</h3>
                  <p>{movie.genre.join(", ")} - {movie.rating.toFixed(1)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section>
          <div className="section-heading">
            <h2>{user.role === ROLES.USER ? "Your bookings" : "Booking overview"}</h2>
          </div>
          <div className="compact-list text-list">
            {bookings.length === 0 ? (
              <p>{user.role === ROLES.THEATRE_OWNER ? "Bookings appear here after users confirm seats." : "No bookings yet."}</p>
            ) : bookings.map((booking) => (
              <article key={booking.id}>
                <div>
                  <h3>{booking.movie?.title}</h3>
                  <p>{booking.seats.join(", ")} - Rs {booking.amount} - {booking.status}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
