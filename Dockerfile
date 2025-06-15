# Base image for backend
FROM python:3.10-slim AS backend

WORKDIR /app
COPY backend/ ./backend/
COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# frontend build step
FROM node:18 AS frontend
WORKDIR /frontend
COPY frontend/ .
RUN npm install && npm run build

# Final stage: serve both
FROM python:3.10-slim

WORKDIR /app
COPY --from=backend /app /app
COPY --from=frontend /frontend/build /app/frontend/build

RUN pip install --no-cache-dir -r backend/requirements.txt

# Install Uvicorn and CORS if not already in requirements.txt
RUN pip install uvicorn fastapi python-multipart

ENV PORT=10000
EXPOSE 10000

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "10000"]
