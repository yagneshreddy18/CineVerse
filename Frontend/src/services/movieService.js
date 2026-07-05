import { SEAT_LOCK_MS } from "../utils/constants.js";
import { bookedSeats, movies, reviews, shows, theatres } from "../utils/seedData.js";

const DB_KEY = "cineverse-db-v1";
const SESSION_KEY = "cineverse-session-v1";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function initialDb() {
  return {
    users: DEMO_USERS,
    movies,
    theatres,
    shows,
    reviews,
    bookedSeats,
    bookings: [],
    locks: {},
    events: [],
  };
}

function normalizeDb(db) {
  const seed = initialDb();
  return {
    ...seed,
    ...db,
    users: db.users?.length ? db.users : seed.users,
    movies: db.movies?.length ? db.movies : seed.movies,
    theatres: db.theatres?.length ? db.theatres : seed.theatres,
    shows: db.shows?.length ? db.shows : seed.shows,
    reviews: db.reviews || seed.reviews,
    bookedSeats: db.bookedSeats || seed.bookedSeats,
    bookings: db.bookings || [],
    locks: db.locks || {},
    events: db.events || [],
  };
}

function readDb() {
  const stored = localStorage.getItem(DB_KEY);
  if (!stored) {
    const db = initialDb();
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return db;
  }
  try {
    const db = normalizeDb(JSON.parse(stored));
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return db;
  } catch {
    const db = initialDb();
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return db;
  }
}

function writeDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function normalizeMoviePayload(movie, id) {
  const genre = Array.isArray(movie.genre)
    ? movie.genre
    : movie.genre.split(",").map((item) => item.trim()).filter(Boolean);

  return {
    ...movie,
    id,
    rating: Number(movie.rating || 0),
    duration: Number(movie.duration || 120),
    genre,
    posterUrl: movie.posterUrl || "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=700&q=80",
  };
}

function publicUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function createToken(user) {
  return `mock-jwt.${btoa(`${user.id}:${user.role}:${Date.now()}`)}.cineverse`;
}

function clearExpiredLocks(db) {
  const now = Date.now();
  Object.entries(db.locks).forEach(([key, lock]) => {
    if (lock.expiresAt <= now) {
      delete db.locks[key];
    }
  });
}

function seatKey(showId, seatId) {
  return `${showId}:${seatId}`;
}

function publishEvent(db, type, payload) {
  db.events.unshift({
    id: `evt-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    status: "QUEUED",
    attempts: 0,
    payload,
    createdAt: new Date().toISOString(),
  });
}

function processQueuedEvents(db) {
  db.events.forEach((event) => {
    if (event.status !== "QUEUED") return;
    event.attempts += 1;
    event.status = "PROCESSED";
    event.processedAt = new Date().toISOString();
    event.message = `Notification sent for booking ${event.payload.bookingId}`;
  });
}

export const authApi = {
  getSession() {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  },
  async login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Invalid credentials');
    }
    const session = { token: data.token, user: data.user };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },
  async register({ name, email, password, role }) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    const session = { token: data.token, user: data.user };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },
  logout() {
    localStorage.removeItem(SESSION_KEY);
  },
};

export const movieApi = {
  listMovies({ search = "", genre = "All", language = "All", sort = "rating" } = {}) {
    const db = readDb();
    let result = clone(db.movies);
    if (search) {
      const query = search.toLowerCase();
      result = result.filter((movie) => movie.title.toLowerCase().includes(query));
    }
    if (genre !== "All") {
      result = result.filter((movie) => movie.genre.includes(genre));
    }
    if (language !== "All") {
      result = result.filter((movie) => movie.language === language);
    }
    return result.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "releaseDate") return new Date(b.releaseDate) - new Date(a.releaseDate);
      return b.rating - a.rating;
    });
  },
  getMovie(movieId) {
    const movie = readDb().movies.find((item) => item.id === movieId);
    return movie ? clone(movie) : null;
  },
  addMovie(movie) {
    const db = readDb();
    const created = normalizeMoviePayload(movie, `m-${Date.now()}`);
    db.movies.unshift(created);
    writeDb(db);
    return created;
  },
  updateMovie(movieId, movie) {
    const db = readDb();
    const index = db.movies.findIndex((item) => item.id === movieId);
    if (index === -1) {
      throw new Error("Movie not found");
    }
    const updated = normalizeMoviePayload(movie, movieId);
    db.movies[index] = updated;
    writeDb(db);
    return updated;
  },
  deleteMovie(movieId) {
    const db = readDb();
    db.movies = db.movies.filter((movie) => movie.id !== movieId);
    db.reviews = db.reviews.filter((review) => review.movieId !== movieId);
    writeDb(db);
  },
  reviews(movieId) {
    return clone(readDb().reviews.filter((review) => review.movieId === movieId));
  },
  addReview(movieId, { userName, rating, text }) {
    const db = readDb();
    db.reviews.unshift({
      id: `r-${Date.now()}`,
      movieId,
      userName,
      rating: Number(rating),
      text,
    });
    writeDb(db);
  },
};

export const bookingApi = {
  listShows(movieId) {
    const db = readDb();
    return clone(
      db.shows
        .filter((show) => !movieId || show.movieId === movieId)
        .map((show) => ({
          ...show,
          movie: db.movies.find((movie) => movie.id === show.movieId),
          theatre: db.theatres.find((theatre) => theatre.id === show.theatreId),
        }))
    );
  },
  getSeatMap(showId, userId) {
    const db = readDb();
    clearExpiredLocks(db);
    const show = db.shows.find((item) => item.id === showId);
    if (!show) return [];
    const theatre = db.theatres.find((item) => item.id === show.theatreId);
    if (!theatre) return [];
    const screen = theatre.screens.find((item) => item.id === show.screenId);
    if (!screen) return [];
    const rows = ["A", "B", "C", "D", "E", "F"];
    const seats = [];
    for (const row of rows) {
      for (let number = 1; number <= Math.ceil(screen.capacity / rows.length); number += 1) {
        const id = `${row}${number}`;
        const key = seatKey(showId, id);
        const isBooked = (db.bookedSeats[showId] || []).includes(id);
        const lock = db.locks[key];
        seats.push({
          id,
          type: row <= "B" ? "PREMIUM" : "REGULAR",
          price: show.price + (row <= "B" ? 80 : 0),
          status: isBooked ? "BOOKED" : lock ? (lock.userId === userId ? "LOCKED_BY_YOU" : "LOCKED") : "AVAILABLE",
          expiresAt: lock?.expiresAt,
        });
      }
    }
    writeDb(db);
    return seats.slice(0, screen.capacity);
  },
  lockSeats(showId, seatIds, userId) {
    const db = readDb();
    clearExpiredLocks(db);
    for (const seatId of seatIds) {
      const key = seatKey(showId, seatId);
      const booked = (db.bookedSeats[showId] || []).includes(seatId);
      const lockedByOther = db.locks[key] && db.locks[key].userId !== userId;
      if (booked || lockedByOther) {
        throw new Error(`${seatId} is no longer available`);
      }
    }
    seatIds.forEach((seatId) => {
      db.locks[seatKey(showId, seatId)] = {
        userId,
        expiresAt: Date.now() + SEAT_LOCK_MS,
      };
    });
    writeDb(db);
  },
  confirmBooking(showId, seatIds, user) {
    const db = readDb();
    clearExpiredLocks(db);
    seatIds.forEach((seatId) => {
      const lock = db.locks[seatKey(showId, seatId)];
      if (!lock || lock.userId !== user.id) {
        throw new Error("Seat lock expired. Please select seats again.");
      }
    });
    db.bookedSeats[showId] = [...new Set([...(db.bookedSeats[showId] || []), ...seatIds])];
    seatIds.forEach((seatId) => delete db.locks[seatKey(showId, seatId)]);
    const show = db.shows.find((item) => item.id === showId);
    const booking = {
      id: `b-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      showId,
      movieId: show.movieId,
      seats: seatIds,
      amount: seatIds.length * show.price,
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
    };
    db.bookings.unshift(booking);
    publishEvent(db, "BOOKING_CONFIRMED", {
      bookingId: booking.id,
      userId: user.id,
      userName: user.name,
      movieId: booking.movieId,
      showId: booking.showId,
      seats: seatIds,
    });
    processQueuedEvents(db);
    writeDb(db);
    return booking;
  },
  listBookings(user) {
    const db = readDb();
    const bookings = user.role === "ADMIN" ? db.bookings : db.bookings.filter((booking) => booking.userId === user.id);
    return clone(
      bookings.map((booking) => ({
        ...booking,
        movie: db.movies.find((movie) => movie.id === booking.movieId),
        show: db.shows.find((show) => show.id === booking.showId),
      }))
    );
  },
  stats() {
    const db = readDb();
    const totalRevenue = db.bookings.reduce((sum, booking) => sum + booking.amount, 0);
    const activeLocks = Object.values(db.locks).filter((lock) => lock.expiresAt > Date.now()).length;
    return {
      users: db.users.length,
      movies: db.movies.length,
      shows: db.shows.length,
      bookings: db.bookings.length,
      totalRevenue,
      theatres: db.theatres.length,
      activeLocks,
      events: db.events.length,
    };
  },
  listEvents() {
    const db = readDb();
    processQueuedEvents(db);
    writeDb(db);
    return clone(db.events);
  },
};
