FROM node:24-slim

WORKDIR /app

# Install and build the frontend
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client/ ./client/
RUN cd client && npm run build

# Install backend dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copy backend source
COPY server/ ./server/

# Copy built frontend into a location the backend can serve
# (server/app.js expects ../client/dist relative to itself)

WORKDIR /app/server

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "server.js"]