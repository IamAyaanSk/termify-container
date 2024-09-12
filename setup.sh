#!/bin/bash

# Update and upgrade the package list
echo "Updating and upgrading the package list..."
apt update -y && apt upgrade -y

# Install necessary packages
echo "Installing required packages..."
apt-get install -y ca-certificates curl gnupg --no-install-recommends 

# Create a directory for apt keyrings
echo "Creating keyrings directory..."
mkdir -p /etc/apt/keyrings

# Add NodeSource GPG key
echo "Adding NodeSource GPG key..."
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

# Add Node.js repository
echo "Adding Node.js repository..."
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list

# Update package list again to include Node.js repository
echo "Updating package list..."
apt update -y

# Install Node.js, Git, Make, Python3, and Build-essential packages
echo "Installing Node.js, Git, Make, Python3, and Build-essential..."
apt-get install -y nodejs git make python3 build-essential --no-install-recommends 

# Install pnpm globally
echo "Installing pnpm..."
npm install -g pnpm

# Set environment variables
echo "Setting environment variables for pnpm..."
export PNPM_HOME="/pnpm"
export PATH="$PNPM_HOME:$PATH"

# Copy server files (you might want to adjust this path)
echo "Copying server files..."
cp -r ./ /root/server

# Change directory to the server root
echo "Changing to server directory..."
cd /root/server

# Install dependencies and build the project
echo "Installing dependencies and building the project..."
pnpm install && pnpm build

# Create a new user without password
echo "Creating new user 'damner'..."
adduser damner --disabled-password --gecos ""

# Switch to the new user
echo "Switching to new user 'damner'..."
su - damner << 'EOF'

# Create a code directory
echo "Creating code directory for 'damner' user..."
mkdir /home/damner/code

# Change to the code directory
cd /home/damner/code

# Create a main.js file
echo "Creating main.js file..."
touch main.js

EOF

# Change back to the root user
echo "Switching back to root user..."
su - root

# Change to the server directory
echo "Changing to server directory..."
cd /root/server

# Expose port 3000
echo "Exposing port 3000..."

# Start the server using pnpm
echo "Starting the server..."
pnpm start
