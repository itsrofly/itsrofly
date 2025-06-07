ARG NODE_VERSION=21.1.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

COPY . .

# Install packages
RUN yarn install

# Run the build script.
RUN yarn run build

# Use production node environment by default.
ENV NODE_ENV production

# Expose the port that the application listens on.
EXPOSE 4000

# Run the application.
CMD yarn serve
