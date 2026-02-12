# Docker Deployment

## Services

- backend (Express) on port `5000`
- frontend (Next.js) on port `3001` (container port `3000`)
- mongo on port `27017` (optional; can use external MongoDB)

## Required environment variables

- `MONGODB_URI`
  - If you want to use the MongoDB container from compose, you can omit it.
  - Default inside compose: `mongodb://mongo:27017/lms`
- `JWT_SECRET`
  - Set a strong secret in production.

## Run

From the project root:

```bash
docker compose up -d --build
```

Open:

- Frontend: http://localhost:3001
- Backend: http://localhost:5001
- Swagger: http://localhost:5001/api-docs

## Using external MongoDB

Set `MONGODB_URI` in your server `.env` (or export it before running compose). Example:

```bash
export MONGODB_URI='mongodb+srv://...'
export JWT_SECRET='...'
docker compose up -d --build
```

If you use external MongoDB you may remove the `mongo` service from `docker-compose.yml`.

## Notes

- Frontend proxies API requests via `/api/*` rewrite.
- In Docker this rewrite uses `BACKEND_URL=http://backend:5000` (set in compose).
