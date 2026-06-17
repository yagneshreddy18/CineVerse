import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { bookingApi, movieApi } from "../services/movieService.js";

export default function Booking() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [movieId, setMovieId] = useState(params.get("movie") || "");
  const shows = bookingApi.listShows(movieId);
  const [showId, setShowId] = useState(shows[0]?.id || "");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatMap, setSeatMap] = useState([]);
  const [message, setMessage] = useState("");
  const [review, setReview] = useState({ rating: 5, text: "" });

  const movies = useMemo(() => movieApi.listMovies(), []);
  const selectedShow = shows.find((show) => show.id === showId);
  const selectedMovie = selectedShow?.movie || movieApi.getMovie(movieId);
  const total = selectedSeats.reduce((sum, seatId) => {
    const seat = seatMap.find((item) => item.id === seatId);
    return sum + (seat?.price || 0);
  }, 0);

  useEffect(() => {
    const nextShows = bookingApi.listShows(movieId);
    setShowId(nextShows[0]?.id || "");
    setSelectedSeats([]);
  }, [movieId]);

  useEffect(() => {
    if (!showId) {
      setSeatMap([]);
      return;
    }
    setSeatMap(bookingApi.getSeatMap(showId, user.id));
  }, [showId, user.id, message]);

  function toggleSeat(seat) {
    if (!["AVAILABLE", "LOCKED_BY_YOU"].includes(seat.status)) return;
    setMessage("");
    setSelectedSeats((current) =>
      current.includes(seat.id) ? current.filter((item) => item !== seat.id) : [...current, seat.id]
    );
  }

  function lockSelected() {
    try {
      bookingApi.lockSeats(showId, selectedSeats, user.id);
      setMessage("Seats locked for 5 minutes. Confirm before the lock expires.");
      setSeatMap(bookingApi.getSeatMap(showId, user.id));
    } catch (err) {
      setMessage(err.message);
    }
  }

  function confirm() {
    try {
      const booking = bookingApi.confirmBooking(showId, selectedSeats, user);
      setSelectedSeats([]);
      setMessage(`Booking #${booking.id.replace("b-", "").slice(-6)} confirmed successfully.`);
    } catch (err) {
      setMessage(err.message);
    }
  }

  function submitReview(event) {
    event.preventDefault();
    if (!selectedMovie || !review.text.trim()) return;
    movieApi.addReview(selectedMovie.id, { userName: user.name, ...review });
    setReview({ rating: 5, text: "" });
    setMessage("Review added to the catalog.");
  }

  return (
    <section className="page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Booking Service</p>
          <h1>Book seats</h1>
        </div>
      </div>

      <div className="booking-layout">
        <aside className="booking-panel">
          <label>
            Movie
            <select value={movieId} onChange={(event) => setMovieId(event.target.value)}>
              <option value="">All movies</option>
              {movies.map((movie) => <option key={movie.id} value={movie.id}>{movie.title}</option>)}
            </select>
          </label>
          <label>
            Show
            <select value={showId} onChange={(event) => setShowId(event.target.value)} disabled={!shows.length}>
              {shows.map((show) => (
                <option key={show.id} value={show.id}>
                  {show.movie.title} - {show.theatre.name} - {show.time}
                </option>
              ))}
            </select>
          </label>
          {selectedMovie && (
            <div className="selected-movie">
              <img src={selectedMovie.posterUrl} alt={`${selectedMovie.title} poster`} />
              <div>
                <h2>{selectedMovie.title}</h2>
                <p>{selectedMovie.genre.join(", ")} - {selectedMovie.language}</p>
              </div>
            </div>
          )}
          <div className="booking-summary">
            <span>Selected</span>
            <strong>{selectedSeats.length ? selectedSeats.join(", ") : "None"}</strong>
            <span>Total</span>
            <strong>Rs {total}</strong>
          </div>
          <div className="button-row">
            <Button disabled={!selectedSeats.length} onClick={lockSelected}>Lock Seats</Button>
            <Button variant="secondary" disabled={!selectedSeats.length} onClick={confirm}>Confirm</Button>
          </div>
          {message && <p className="notice">{message}</p>}
        </aside>

        <section className="seat-zone">
          <div className="screen">SCREEN</div>
          {seatMap.length ? (
            <div className="seat-grid">
              {seatMap.map((seat) => (
                <button
                  key={seat.id}
                  className={`seat ${seat.status.toLowerCase().replaceAll("_", "-")} ${selectedSeats.includes(seat.id) ? "selected" : ""}`}
                  onClick={() => toggleSeat(seat)}
                  title={`${seat.id} ${seat.status}`}
                >
                  {seat.id}
                </button>
              ))}
            </div>
          ) : (
            <p className="muted">No seat layout is available for this selection.</p>
          )}
          <div className="legend">
            <span><b className="legend-box available" />Available</span>
            <span><b className="legend-box selected" />Selected</span>
            <span><b className="legend-box locked" />Locked</span>
            <span><b className="legend-box booked" />Booked</span>
          </div>
        </section>
      </div>

      {selectedMovie && (
        <section className="reviews-panel">
          <div className="section-heading">
            <h2>Reviews for {selectedMovie.title}</h2>
          </div>
          <form className="review-form" onSubmit={submitReview}>
            <select value={review.rating} onChange={(event) => setReview({ ...review, rating: event.target.value })}>
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>
            <input value={review.text} onChange={(event) => setReview({ ...review, text: event.target.value })} placeholder="Write a short review" />
            <Button type="submit">Add Review</Button>
          </form>
          <div className="review-list">
            {movieApi.reviews(selectedMovie.id).map((item) => (
              <article key={item.id}>
                <strong>{item.userName} - {item.rating}/5</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
