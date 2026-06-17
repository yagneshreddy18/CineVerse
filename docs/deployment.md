## CineVerse Deployment Guide

### Local Docker Run

From the repository root:

```bash
cd docker
docker compose up --build
```

Services included:

- React frontend on `http://localhost:3000`
- PostgreSQL on `localhost:5432`
- MongoDB on `localhost:27017`
- Redis on `localhost:6379`
- RabbitMQ on `localhost:5672`
- RabbitMQ management UI on `http://localhost:15672`

### CI/CD

The workflow at `.github/workflows/ci.yml` runs on pushes and pull requests.
It installs frontend dependencies, runs automated tests, builds the React app,
and validates the Docker image build.

### Production Shape

```text
User -> NGINX -> React Frontend -> API Gateway -> Microservices
                                      |
                                      -> PostgreSQL / MongoDB / Redis / RabbitMQ
```

Use environment variables for service URLs, credentials, JWT secrets, and
production profiles. HTTPS should be terminated at NGINX or the cloud load
balancer.
