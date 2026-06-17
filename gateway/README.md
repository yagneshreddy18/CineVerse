## API Gateway

Production CineVerse should use Spring Cloud Gateway as the single public API
entrypoint.

Routes:

- `/api/auth/**` -> auth-service
- `/api/movies/**` -> movie-service
- `/api/reviews/**` -> review-service
- `/api/theatres/**`, `/api/shows/**`, `/api/seats/**`, `/api/bookings/**` -> booking-service

Gateway responsibilities:

- JWT validation
- Request routing
- CORS
- Logging
- Rate limiting
- Hiding internal service addresses
