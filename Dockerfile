# Use an official Node.js runtime as the base image
FROM node:18.17.0

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Set the CONVEX_DEPLOY_KEY environment variable
ARG CONVEX_DEPLOY_KEY
ARG ConvexReactClient 
ENV CONVEX_DEPLOY_KEY=$CONVEX_DEPLOY_KEY
ENV ConvexReactClient = $ConvexReactClient 

# Set the EDGE_STORE_ACCESS_KEY and EDGE_STORE_SECRET_KEY environment variables
ARG EDGE_STORE_ACCESS_KEY
ARG EDGE_STORE_SECRET_KEY
ENV EDGE_STORE_ACCESS_KEY=$EDGE_STORE_ACCESS_KEY
ENV EDGE_STORE_SECRET_KEY=$EDGE_STORE_SECRET_KEY

RUN echo $CONVEX_DEPLOY_KEY
RUN echo $EDGE_STORE_ACCESS_KEY
RUN echo $EDGE_STORE_SECRET_KEY
RUN echo $ConvexReactClient 

# Build the application
RUN npx convex deploy 
RUN npm run build 

# Expose port 3000
EXPOSE 3000
# Start the application
CMD [ "npm", "start"]