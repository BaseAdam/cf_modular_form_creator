FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# browser-side fetch target, baked into the bundle at build time (vite reads it during build)
ARG VITE_API_URL=http://localhost:5001
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "--port", "5173"]
