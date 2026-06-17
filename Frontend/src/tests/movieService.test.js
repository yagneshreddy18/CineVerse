import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

class LocalStorageMock {
  constructor() {
    this.store = new Map();
  }

  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }

  setItem(key, value) {
    this.store.set(key, String(value));
  }

  removeItem(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

globalThis.localStorage = new LocalStorageMock();
globalThis.btoa = (value) => Buffer.from(value, "utf8").toString("base64");

const { authApi, bookingApi, movieApi } = await import("../services/movieService.js");

beforeEach(() => {
  localStorage.clear();
});

test("auth login returns a safe user and mock JWT", () => {
  const session = authApi.login("user@cineverse.test", "password");

  assert.equal(session.user.email, "user@cineverse.test");
  assert.equal(session.user.password, undefined);
  assert.match(session.token, /^mock-jwt\./);
});

test("movie catalog supports search and genre filtering", () => {
  const result = movieApi.listMovies({ search: "inception", genre: "Sci-Fi" });

  assert.equal(result.length, 1);
  assert.equal(result[0].title, "Inception");
});

test("seat locking prevents another user from booking the same seat", () => {
  const user = authApi.login("user@cineverse.test", "password").user;
  const owner = authApi.login("admin@cineverse.test", "password").user;

  bookingApi.lockSeats("sh-1", ["B1"], user.id);

  assert.throws(() => bookingApi.lockSeats("sh-1", ["B1"], owner.id), /B1 is no longer available/);
});

test("confirmed booking publishes a processed notification event", () => {
  const user = authApi.login("user@cineverse.test", "password").user;

  bookingApi.lockSeats("sh-1", ["B2"], user.id);
  const booking = bookingApi.confirmBooking("sh-1", ["B2"], user);
  const events = bookingApi.listEvents();

  assert.equal(booking.status, "CONFIRMED");
  assert.equal(events[0].type, "BOOKING_CONFIRMED");
  assert.equal(events[0].status, "PROCESSED");
});

test("reset demo data clears session and restores seeded stats", () => {
  authApi.login("user@cineverse.test", "password");
  authApi.resetDemoData();

  assert.equal(authApi.getSession(), null);
  assert.equal(bookingApi.stats().movies, 6);
  assert.equal(bookingApi.stats().events, 0);
});

test("older local data is normalized with new fields", () => {
  localStorage.setItem("cineverse-db-v1", JSON.stringify({ users: [], movies: [] }));

  const stats = bookingApi.stats();

  assert.equal(stats.movies, 6);
  assert.equal(stats.activeLocks, 0);
  assert.equal(stats.events, 0);
});

test("movie catalog supports create, update, and delete", () => {
  const created = movieApi.addMovie({
    title: "Test Movie",
    genre: "Drama, Mystery",
    language: "Hindi",
    duration: 100,
    releaseDate: "2026-02-01",
    rating: 7,
    certification: "UA",
    posterUrl: "",
    overview: "Created during test.",
  });

  const updated = movieApi.updateMovie(created.id, {
    ...created,
    title: "Updated Test Movie",
    genre: "Drama",
    rating: 8.2,
  });

  assert.equal(updated.title, "Updated Test Movie");
  assert.equal(updated.genre.length, 1);
  assert.equal(movieApi.getMovie(created.id).rating, 8.2);

  movieApi.deleteMovie(created.id);
  assert.equal(movieApi.getMovie(created.id), null);
});
