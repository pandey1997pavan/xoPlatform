# PAVANxO Food Ordering Website

A modern food ordering website with a MongoDB database backend.

## Setup Instructions

1. Install MongoDB on your system:
   - Download and install MongoDB Community Server from: https://www.mongodb.com/try/download/community
   - Make sure MongoDB service is running

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open the website in your browser:
   - Navigate to http://localhost:3000

## Features

- Dynamic menu items loaded from database
- Category filtering (Pizza, Burgers, Pasta)
- Shopping cart functionality
- Contact form with database storage
- Responsive design

## Database Structure

The application uses MongoDB with the following collections:

1. menuItems:
   - name
   - description
   - price
   - category
   - image

2. orders:
   - items (array of menu items and quantities)
   - totalAmount
   - status
   - createdAt

3. contacts:
   - name
   - email
   - message
   - createdAt
