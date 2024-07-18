FROM --platform=linux/amd64 node:20.11.1-alpine

# Set the working directory to /src
WORKDIR /app

# Expose port 5000 (adjusted to match containerPort in deployment)
EXPOSE 5000

COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

COPY . ./

# Command to run the application
CMD ["yarn", "start"]
