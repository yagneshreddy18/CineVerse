## CineVerse Architecture

CineVerse follows the architecture described in the project PDFs:

```text
React Frontend -> API Gateway -> Spring Boot Microservices -> Data Stores
```

### Services

| Service | Responsibility | Store |
| --- | --- | --- |
| Auth Service | Register, login, JWT generation, RBAC | PostgreSQL |
| Movie Service | Movie CRUD, search, filtering, poster metadata | MongoDB |
| Review Service | Ratings and user reviews | MongoDB |
| Booking Service | Theatre, screen, show, seat locks, bookings | PostgreSQL + Redis |
| Notification Service | Consume booking events and send email/SMS | RabbitMQ |
| Gateway | Route `/api/*`, validate JWT, apply cross-cutting filters | Spring Cloud Gateway |

### Frontend Modules

The runnable `Frontend` app implements the complete UI flow using local storage
as a mock database:

1. Login/register with JWT-style token persistence.
2. Dashboard with role-aware actions.
3. Movie catalog with search, genre/language filters, and sorting.
4. Booking page with show selection, seat map, temporary seat locks, and booking
   confirmation.
5. Management page for admins and theatre owners.
6. Booking notification events with a queue-style processed event log.

### Booking Consistency Model

Seat state follows a finite state model:

```text
AVAILABLE -> LOCKED -> CONFIRMED
AVAILABLE -> LOCKED -> EXPIRED -> AVAILABLE
```

The production design uses Redis keys like `seat:{showId}:{seatId}` with a TTL
of five minutes. The current frontend demo mirrors that behavior with local
storage lock records and expiry timestamps.

### Event-Driven Flow

After booking confirmation, the Booking Service publishes a
`BOOKING_CONFIRMED` event. In production this event goes through RabbitMQ to a
Notification Service. In the runnable frontend, events are stored and processed
locally so the flow can be demonstrated without a broker:

```text
Booking confirmed -> Event queued -> Consumer processes -> Notification sent
```

### Production Upgrade Path

The demo can be migrated to the target microservice version by replacing
`Frontend/src/services/movieService.js` with Axios calls to the gateway routes
documented in `docs/api_design.md`.
