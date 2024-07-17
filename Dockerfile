FROM --platform=linux/amd64 node:20.11.1-alpine

# Set the working directory to /src
WORKDIR /app

# Expose port 5000 (adjusted to match containerPort in deployment)
EXPOSE 5000

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Command to run the application
CMD ["yarn", "start"]
