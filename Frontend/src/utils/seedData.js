export const movies = [
  {
    id: "m-101",
    title: "Inception",
    genre: ["Sci-Fi", "Thriller"],
    language: "English",
    duration: 148,
    releaseDate: "2010-07-16",
    rating: 8.8,
    certification: "UA",
    posterUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    overview: "A skilled extractor enters dreams to plant an idea while reality folds around the mission.",
  },
  {
    id: "m-102",
    title: "Interstellar",
    genre: ["Sci-Fi", "Adventure"],
    language: "English",
    duration: 169,
    releaseDate: "2014-11-07",
    rating: 8.7,
    certification: "UA",
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    overview: "Explorers travel through a wormhole to find a future for humanity beyond a dying Earth.",
  },
  {
    id: "m-103",
    title: "Dangal",
    genre: ["Drama", "Sports"],
    language: "Hindi",
    duration: 161,
    releaseDate: "2016-12-21",
    rating: 8.3,
    certification: "U",
    posterUrl: "https://image.tmdb.org/t/p/w500/p2lVAcPuRPSO8Al6hDDGw0OgMi8.jpg",
    overview: "A former wrestler trains his daughters to compete at the highest level.",
  },
  {
    id: "m-104",
    title: "Vikram",
    genre: ["Action", "Thriller"],
    language: "Tamil",
    duration: 174,
    releaseDate: "2022-06-03",
    rating: 8.2,
    certification: "UA",
    posterUrl: "https://image.tmdb.org/t/p/w500/774UV1aCURb4s4JfEFg3IEMu5Zj.jpg",
    overview: "A special investigator follows a trail of masked vigilantes, cartels, and hidden motives.",
  },
  {
    id: "m-105",
    title: "Spider-Man: Across the Spider-Verse",
    genre: ["Animation", "Action"],
    language: "English",
    duration: 140,
    releaseDate: "2023-06-02",
    rating: 8.6,
    certification: "U",
    posterUrl: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    overview: "Miles Morales meets a multiverse of Spider-People while choosing what kind of hero he must be.",
  },
  {
    id: "m-106",
    title: "Jawan",
    genre: ["Action", "Drama"],
    language: "Hindi",
    duration: 169,
    releaseDate: "2023-09-07",
    rating: 7.0,
    certification: "UA",
    posterUrl: "https://image.tmdb.org/t/p/w500/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg",
    overview: "A driven vigilante challenges corruption through audacious public actions.",
  },
];

export const theatres = [
  {
    id: "t-1",
    name: "CineVerse Central",
    location: "Ahmedabad",
    screens: [
      { id: "s-1", name: "Audi 1", capacity: 48 },
      { id: "s-2", name: "Audi 2", capacity: 36 },
    ],
  },
  {
    id: "t-2",
    name: "Galaxy Premiere",
    location: "Mumbai",
    screens: [{ id: "s-3", name: "IMAX", capacity: 60 }],
  },
];

export const shows = [
  { id: "sh-1", movieId: "m-101", theatreId: "t-1", screenId: "s-1", time: "10:30 AM", price: 220 },
  { id: "sh-2", movieId: "m-101", theatreId: "t-2", screenId: "s-3", time: "08:00 PM", price: 340 },
  { id: "sh-3", movieId: "m-102", theatreId: "t-1", screenId: "s-2", time: "06:15 PM", price: 260 },
  { id: "sh-4", movieId: "m-103", theatreId: "t-1", screenId: "s-1", time: "02:00 PM", price: 180 },
  { id: "sh-5", movieId: "m-104", theatreId: "t-2", screenId: "s-3", time: "11:15 PM", price: 300 },
  { id: "sh-6", movieId: "m-105", theatreId: "t-1", screenId: "s-2", time: "12:45 PM", price: 240 },
  { id: "sh-7", movieId: "m-106", theatreId: "t-2", screenId: "s-3", time: "04:20 PM", price: 280 },
];

export const bookedSeats = {
  "sh-1": ["A1", "A2", "C5", "F4"],
  "sh-2": ["B4", "B5", "D8"],
  "sh-3": ["A3", "E2"],
};

export const reviews = [
  { id: "r-1", movieId: "m-101", userName: "Aarav", rating: 5, text: "Tense, clever, and still fun to rewatch." },
  { id: "r-2", movieId: "m-102", userName: "Nisha", rating: 5, text: "Grand scale with a strong emotional core." },
  { id: "r-3", movieId: "m-103", userName: "Kabir", rating: 4, text: "A strong sports drama with excellent performances." },
];
