# ARG REACT_APP_API_KEY
# ARG REACT_APP_AUTH_DOMAIN
# ARG REACT_APP_PROJECT_ID
# ARG REACT_APP_STORAGE_BUCKET
# ARG REACT_APP_MESSAGING_SENDERID
# ARG REACT_APP_APP_ID
# ARG REACT_APP_MEASUREMENT_ID
# ARG REACT_APP_NODE_ENV
# ARG REACT_APP_IS_BACKEND_UPLOAD

# Use a lightweight Node.js base image for building
FROM node:14-alpine AS build

# Set a working directory in the container
WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Copy the rest of the application source code
COPY . .

ARG REACT_APP_API_KEY
ARG REACT_APP_AUTH_DOMAIN
ARG REACT_APP_PROJECT_ID
ARG REACT_APP_STORAGE_BUCKET
ARG REACT_APP_MESSAGING_SENDERID
ARG REACT_APP_APP_ID
ARG REACT_APP_MEASUREMENT_ID
ARG REACT_APP_NODE_ENV
ARG REACT_APP_IS_BACKEND_UPLOAD

ENV REACT_APP_API_KEY=${REACT_APP_API_KEY}
ENV REACT_APP_AUTH_DOMAIN=${REACT_APP_AUTH_DOMAIN}
ENV REACT_APP_PROJECT_ID=${REACT_APP_PROJECT_ID}
ENV REACT_APP_STORAGE_BUCKET=${REACT_APP_STORAGE_BUCKET}
ENV REACT_APP_MESSAGING_SENDERID=${REACT_APP_MESSAGING_SENDERID}
ENV REACT_APP_APP_ID=${REACT_APP_APP_ID}
ENV REACT_APP_MEASUREMENT_ID=${REACT_APP_MEASUREMENT_ID}
ENV REACT_APP_NODE_ENV=${REACT_APP_NODE_ENV}
ENV REACT_APP_IS_BACKEND_UPLOAD=${REACT_APP_IS_BACKEND_UPLOAD}

# Install dependencies and build the React app
RUN npm install react-scripts@4.0.1 && npm install && yarn build

# Use a lightweight Apache base image for serving the app
FROM httpd:alpine

# # Remove the default Apache index page (optional)
RUN rm -rf /usr/local/apache2/htdocs/*

# Copy the built React app from the build stage to the Apache container
COPY --from=build /app/build/ /usr/local/apache2/htdocs

COPY .htaccess /usr/local/apache2/htdocs

# Copy your custom Apache configuration file
COPY apache.conf /usr/local/apache2/conf/httpd.conf

ARG REACT_APP_API_KEY
ARG REACT_APP_AUTH_DOMAIN
ARG REACT_APP_PROJECT_ID
ARG REACT_APP_STORAGE_BUCKET
ARG REACT_APP_MESSAGING_SENDERID
ARG REACT_APP_APP_ID
ARG REACT_APP_MEASUREMENT_ID
ARG REACT_APP_NODE_ENV
ARG REACT_APP_IS_BACKEND_UPLOAD

ENV REACT_APP_API_KEY=${REACT_APP_API_KEY}
ENV REACT_APP_AUTH_DOMAIN=${REACT_APP_AUTH_DOMAIN}
ENV REACT_APP_PROJECT_ID=${REACT_APP_PROJECT_ID}
ENV REACT_APP_STORAGE_BUCKET=${REACT_APP_STORAGE_BUCKET}
ENV REACT_APP_MESSAGING_SENDERID=${REACT_APP_MESSAGING_SENDERID}
ENV REACT_APP_APP_ID=${REACT_APP_APP_ID}
ENV REACT_APP_MEASUREMENT_ID=${REACT_APP_MEASUREMENT_ID}
ENV REACT_APP_NODE_ENV=${REACT_APP_NODE_ENV}
ENV REACT_APP_IS_BACKEND_UPLOAD=${REACT_APP_IS_BACKEND_UPLOAD}

# Start Apache to serve the React app
CMD ["httpd", "-D", "FOREGROUND"]




# -------------------------------------------- OLD Docker Image ----------------------------------------------------------------#

# FROM node:14-slim

# RUN apt-get update \
#     && apt-get -y install apache2 \
#     && mkdir -p /usr/src/app

# #Create app directory
# WORKDIR /usr/src/app

# COPY package.json ./
# COPY . .

# ARG REACT_APP_API_KEY
# ARG REACT_APP_AUTH_DOMAIN
# ARG REACT_APP_PROJECT_ID
# ARG REACT_APP_STORAGE_BUCKET
# ARG REACT_APP_MESSAGING_SENDERID
# ARG REACT_APP_APP_ID
# ARG REACT_APP_MEASUREMENT_ID
# ARG REACT_APP_NODE_ENV
# ARG REACT_APP_IS_BACKEND_UPLOAD

# ENV REACT_APP_API_KEY=${REACT_APP_API_KEY}
# ENV REACT_APP_AUTH_DOMAIN=${REACT_APP_AUTH_DOMAIN}
# ENV REACT_APP_PROJECT_ID=${REACT_APP_PROJECT_ID}
# ENV REACT_APP_STORAGE_BUCKET=${REACT_APP_STORAGE_BUCKET}
# ENV REACT_APP_MESSAGING_SENDERID=${REACT_APP_MESSAGING_SENDERID}
# ENV REACT_APP_APP_ID=${REACT_APP_APP_ID}
# ENV REACT_APP_MEASUREMENT_ID=${REACT_APP_MEASUREMENT_ID}
# ENV REACT_APP_NODE_ENV=${REACT_APP_NODE_ENV}
# ENV REACT_APP_IS_BACKEND_UPLOAD=${REACT_APP_IS_BACKEND_UPLOAD}

# #Installation of NPM
# RUN npm install react-scripts@4.0.1 \
#     && npm install \
#     && yarn build
    
# RUN rm /var/www/html/index.html     
# RUN cp -r /usr/src/app/build/* /var/www/html
# COPY .htaccess /var/www/html

# RUN cat apache.conf > /etc/apache2/sites-available/000-default.conf \
#     && a2enmod rewrite \
#     && service apache2 restart

# CMD ["apachectl", "-D", "FOREGROUND"]
