# Step 1: Build the NestJS application
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Step 2: Serve the application
FROM node:20

# Set the working directory
WORKDIR /app

# Copy only the build output from the previous stage
COPY --from=build /app/dist ./dist

# Install production dependencies
COPY package.json yarn.lock ./
RUN yarn install --production

# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD ["node", "dist/main.js"]
