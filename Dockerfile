FROM node:20-alpine as base

FROM base as build
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

FROM base as development
WORKDIR /app
COPY --from=build /app/ .
CMD ["npm", "run", "dev"]

FROM base as production
WORKDIR /app
COPY --from=build /app/.medusa/server .
RUN npm i
CMD ["npm", "run", "start"]
