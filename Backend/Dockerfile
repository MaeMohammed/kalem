FROM node:20-slim
WORKDIR /app
COPY Backend/package*.json ./
RUN npm install
COPY Backend/ .
EXPOSE 5001
CMD ["node", "src/app.js"]