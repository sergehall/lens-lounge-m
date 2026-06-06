FROM --platform=linux/amd64 node:24.15.0-alpine

# Set the working directory to /src
WORKDIR /app

# Expose port 5000 (adjusted to match containerPort in deployment)
EXPOSE 5000

RUN corepack enable && corepack prepare yarn@4.14.1 --activate

COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

COPY . ./

# Command to run the application
CMD ["yarn", "start"]
