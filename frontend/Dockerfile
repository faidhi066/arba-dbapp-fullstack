# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the package.json and lock files, then install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 4173

# Build the app
RUN npm run build

# Set environment for production or development
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Default command to start the server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]

