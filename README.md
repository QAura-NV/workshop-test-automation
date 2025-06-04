# Workshop Test Automation

A full-stack application for learning and practicing test automation, built with PocketBase backend and SvelteKit frontend.

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Git

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd workshop-test-automation
   ```

2. **Start the application**
   ```bash
   docker compose up
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - PocketBase Admin UI: http://localhost:8080/_/

The application will automatically build and start both services. The backend data will be persisted in `./backend/pb_data/`.

### Stopping the Application

```bash
docker compose down
```

## Development Mode

For development with hot reloading and debugging:

```bash
docker compose -f compose.yaml -f compose.dev.yaml up
```

This enables:
- Volume mounts for live code changes
- Access to migration and hook files
- Development-friendly restart policies

## Architecture

- **Backend**: PocketBase (Go-based backend-as-a-service)
  - REST API with real-time subscriptions
  - Built-in admin dashboard
  - SQLite database
  - Runs on port 8080

- **Frontend**: SvelteKit application
  - Modern web framework with TypeScript
  - Tailwind CSS for styling
  - Form validation with Zod
  - Runs on port 3000

## Configuration

### Environment Variables

The application uses these environment variables:

**Frontend**:
- `PUBLIC_POCKETBASE_URL`: Backend API URL (default: `http://localhost:8080`)

**Backend**:
- `GOMEMLIMIT`: Memory limit for the Go application (default: `128MiB`)

### Customizing Configuration

To modify the configuration:

1. Copy and edit the compose files
2. Update environment variables as needed
3. Restart the services

## Troubleshooting

### Common Issues

**Port conflicts**:
- If ports 3000 or 8080 are in use, modify the port mappings in `compose.yaml`

**Permission issues**:
- Ensure Docker has permission to create volumes in the project directory
- On Linux, you may need to adjust file ownership: `sudo chown -R $USER:$USER backend/pb_data`

**Database issues**:
- Delete `backend/pb_data/` directory to reset the database
- Restart the services

### Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

## Data Persistence

Application data is stored in:
- `./backend/pb_data/` - Database and uploaded files
- `./backend/pb_migrations/` - Database migrations (development)
- `./backend/pb_hooks/` - Custom backend logic (development)

## Support

If you encounter issues:

1. Check the logs using the commands above
2. Ensure all prerequisites are installed
3. Try rebuilding the containers: `docker compose up --build`
4. Reset the database by removing `backend/pb_data/` directory
