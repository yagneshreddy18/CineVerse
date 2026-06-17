## CineVerse

CineVerse is a full-stack learning project for a movie discovery and booking
platform. This repository contains a runnable React implementation of the
project flows described in the day-wise PDFs:

- Authentication with mock JWT persistence
- Role-based access for User, Theatre Owner, and Admin
- Movie catalog, search, filters, sorting, reviews, and ratings
- Theatre/show browsing
- Seat layout, temporary locking, booking confirmation, and booking history
- Booking notification events using a RabbitMQ-style producer/consumer flow
- Automated service tests for auth, catalog, seat locks, and booking events
- Dockerfile, Docker Compose, NGINX config, and GitHub Actions CI workflow
- Architecture/API documentation for the Spring Boot microservice version

### Run the Frontend

```bash
cd Frontend
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

### Demo Logins

Use any password with one of these accounts:

| Role | Email |
| --- | --- |
| User | user@cineverse.test |
| Theatre Owner | owner@cineverse.test |
| Admin | admin@cineverse.test |

You can also register a new user from the login page.

### Project Layout

```text
Frontend/     React app and mock service layer
Backend/      Microservice folders for auth, movie, review, and booking service
gateway/      API gateway notes/config placeholder
docs/         Architecture and API design documentation
docker/       Local infrastructure compose file placeholder
```

### What Is Simulated

The current runnable app uses browser `localStorage` as a local database so it
works immediately on a student machine. The code and documentation still map to
the intended production architecture: React frontend, Spring Boot services,
PostgreSQL for auth/booking, MongoDB for movie catalog, Redis for seat locks,
RabbitMQ for async events, and an API gateway for routing and JWT validation.

### Verify

```bash
cd Frontend
npm test
npm run build
```
