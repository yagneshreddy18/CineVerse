export const ROLES = {
  USER: "USER",
  THEATRE_OWNER: "THEATRE_OWNER",
  ADMIN: "ADMIN",
};

export const ROLE_LABELS = {
  USER: "User",
  THEATRE_OWNER: "Theatre Owner",
  ADMIN: "Admin",
};

export const SEAT_LOCK_MS = 5 * 60 * 1000;

export const DEMO_USERS = [
  {
    id: "u-1",
    name: "Aarav Mehta",
    email: "user@cineverse.test",
    password: "password",
    role: ROLES.USER,
  },
  {
    id: "u-2",
    name: "Nisha Rao",
    email: "owner@cineverse.test",
    password: "password",
    role: ROLES.THEATRE_OWNER,
  },
  {
    id: "u-3",
    name: "Kabir Admin",
    email: "admin@cineverse.test",
    password: "password",
    role: ROLES.ADMIN,
  },
];
