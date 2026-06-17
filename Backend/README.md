## Backend Microservice Plan

The runnable implementation is currently in `Frontend` with a local mock API.
These backend folders are reserved for the Spring Boot services described in
the project PDFs.

Recommended service layout:

```text
Backend/
  auth-service/
  movie-service/
  review-service/
  booking-service/
  notification-service/
```

Each service should follow:

```text
controller -> service -> repository -> entity/dto
```

Core production dependencies:

- Spring Web
- Spring Security
- Spring Data JPA for Auth/Booking
- Spring Data MongoDB for Movie/Review
- Spring Data Redis for seat locks
- Spring AMQP for RabbitMQ events
- PostgreSQL Driver
- Validation
- Lombok

Until those services are generated, `Frontend/src/services/movieService.js`
acts as the API boundary and can be replaced with Axios calls later.

### Verify Backend Contract

```bash
node Backend/verify-contract.cjs
```

This validates the documented service map, routes, roles, storage choices, and
RabbitMQ event contract.
