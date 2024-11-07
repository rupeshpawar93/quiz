FROM node:18-alpine3.16 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .


# Stage 2
FROM gcr.io/distroless/nodejs18-debian11

WORKDIR /app

COPY --from=build /app/node_modules /app
COPY --from=build /app /app

USER nonroot
EXPOSE 3000

CMD ["index.js"]
