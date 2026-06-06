# Step 1: Build the NestJS application
FROM node:24.15.0 AS build

# Set the working directory
WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.14.1 --activate

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Step 2: Serve the application
FROM node:24.15.0

# Set the working directory
WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.14.1 --activate

# Copy only the build output from the previous stage
COPY --from=build /app/dist ./dist

# Install production dependencies
COPY package.json yarn.lock ./
RUN yarn install --production

# Expose the port the app runs on
EXPOSE 3002

# Start the application
CMD ["node", "dist/main.js"]
