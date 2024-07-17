FROM --platform=linux/amd64 node:20.11.1-alpine

# Set the working directory to /src
WORKDIR /src

# Expose port 5000
EXPOSE 5000

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Command to run the application
CMD ["yarn", "start"]
