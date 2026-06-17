## CineVerse API Design

All production APIs should return a standard response:

```json
{
  "status": "success",
  "message": "Operation completed",
  "data": {}
}
```

### Auth Service

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Register user with name, email, password, role |
| POST | `/api/auth/login` | Validate credentials and return JWT |
| GET | `/api/auth/logout` | Client logout endpoint |
| POST | `/api/auth/forgot-password` | Start password reset |
| POST | `/api/auth/reset-password` | Complete password reset |

### Movie Catalog Service

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/movies` | Paginated movie list with sorting |
| GET | `/api/movies/{id}` | Movie detail |
| POST | `/api/movies` | Create movie, theatre owner/admin only |
| PUT | `/api/movies/{id}` | Update movie |
| DELETE | `/api/movies/{id}` | Delete movie |
| GET | `/api/movies/search?title=&genre=&rating=` | Search/filter catalog |
| POST | `/api/movies/upload` | Upload poster image |

### Review Service

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/reviews` | Add review/rating |
| GET | `/api/reviews/{movieId}` | Fetch reviews for a movie |

### Booking Service

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/theatres` | Fetch theatres |
| GET | `/api/shows?movieId=` | Fetch shows |
| GET | `/api/seats/{showId}` | Fetch seat availability |
| POST | `/api/seats/lock` | Lock seats using Redis TTL |
| POST | `/api/bookings` | Confirm booking |
| GET | `/api/bookings/me` | User booking history |

### Event/Notification Service

| Method | Endpoint/Event | Purpose |
| --- | --- | --- |
| Event | `BOOKING_CONFIRMED` | Published after successful booking |
| Queue | `bookingQueue` | RabbitMQ durable queue for booking notifications |
| DLQ | `bookingQueue.dlq` | Failed notification messages after retries |
| GET | `/api/events` | Admin event visibility, optional |

### RBAC Matrix

| Feature | User | Theatre Owner | Admin |
| --- | --- | --- | --- |
| View movies | Yes | Yes | Yes |
| Book tickets | Yes | No | Yes |
| Add/manage movies | No | Yes | Yes |
| Manage shows | No | Yes | Yes |
| Manage users | No | No | Yes |
| View reports | No | Yes | Yes |
