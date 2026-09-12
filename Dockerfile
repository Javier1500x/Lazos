FROM node:20-alpine
WORKDIR /app
COPY backend/package.json backend/
RUN npm install
COPY backend/ backend/
EXPOSE 5000
CMD ["npm", "start"]
