# Step 1: Build the React application
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
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
