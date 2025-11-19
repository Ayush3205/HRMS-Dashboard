# Travel Booking System

A full-stack travel booking application built with React, Node.js, Express, and MongoDB.

## Features

### 1. Authentication & Authorization
- JWT-based authentication
- Role-based access control (User/Admin)
- Protected routes
- Secure password hashing

### 2. Home Page
- Display all available trips
- Search and filter trips by:
  - Source (From)
  - Destination (To)
  - Date
- Real-time trip listings
- Responsive design

### 3. Trip Booking Flow
- **Trip Details Page**: View trip information and select seats
- **Seat Selection**: Interactive seat map with availability
- **Checkout Page**: Review booking and select payment method
- **Booking Confirmation**: Success page with ticket download option

### 4. My Bookings Page
- View upcoming bookings
- View past bookings
- Cancel bookings (upcoming only)
- View/download tickets

### 5. Profile Page
- Display user information
- Account creation date
- User role display

### 6. Admin Panel
- **Add New Trips**: Create trips with all details
- **Manage Trips**: View, edit, and delete trips
- Vanilla CSS styling (as per requirements)
- Real-time updates

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- JWT (jsonwebtoken)
- bcryptjs
- Mongoose

### Frontend
- React
- React Router DOM
- Axios
- Tailwind CSS (for most pages)
- Vanilla CSS (for Admin Panel)
- Context API for state management

## Project Structure

```
hrms-assigment/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Trip.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── trips.js
│   │   └── bookings.js
│   ├── middleware/
│   │   └── auth.js
│   ├── index.js
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (connection string provided)

### Steps

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies for all packages:**
   ```bash
   npm run install-all
   ```

   Or install separately:
   ```bash
   # Root dependencies
   npm install
   
   # Server dependencies
   cd server
   npm install
   
   # Client dependencies
   cd ../client
   npm install
   ```

3. **Configure environment variables:**
   
   Create `server/.env` file with the following content:
   ```
   MONGO_URI=Your_MongoDB_URL
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   PORT=5000
   ```
   
   **Note:** The MongoDB URI is already provided. You can change the JWT_SECRET to any secure random string.

4. **Start the development servers:**
   
   From the root directory:
   ```bash
   npm run dev
   ```
   
   This will start both the backend (port 5000) and frontend (port 3000) servers.
   
   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm start
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

### Creating an Admin Account

To create an admin account, you can either:

1. **Register normally and update in database:**
   - Register a regular account
   - Update the user's role to 'admin' in MongoDB

2. **Use MongoDB directly:**
   ```javascript
   // In MongoDB shell or Compass
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

### First Steps

1. **Register/Login**: Create an account or login
2. **Add Trips (Admin)**: 
   - Login as admin
   - Go to Admin Panel
   - Add new trips
3. **Book Trips (User)**:
   - Browse available trips on home page
   - Use filters to find desired trips
   - Click "Book Now" on a trip
   - Select seats and proceed to checkout
   - Complete booking

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Trips
- `GET /api/trips` - Get all trips (with optional filters)
- `GET /api/trips/:id` - Get single trip
- `POST /api/trips` - Create trip (admin only)
- `PUT /api/trips/:id` - Update trip (admin only)
- `DELETE /api/trips/:id` - Delete trip (admin only)

### Bookings
- `GET /api/bookings/my-bookings` - Get user bookings (protected)
- `POST /api/bookings` - Create booking (protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (protected)
- `GET /api/bookings/:id` - Get single booking (protected)

## Key Features Implementation

### State Management
- React Context API for authentication state
- Local component state for forms and UI
- API calls with Axios interceptors

### Error Handling
- Try-catch blocks in all async operations
- User-friendly error messages
- API error interceptors
- Form validation

### Responsiveness
- Tailwind CSS responsive utilities
- Mobile-first approach
- Flexible grid layouts
- Responsive navigation

### Folder Structure
- Organized by feature/functionality
- Separation of concerns
- Reusable components
- Centralized utilities

## Notes

- The Admin Panel uses **Vanilla CSS** as per requirements
- Other pages use **Tailwind CSS** for faster development
- All routes are protected where necessary
- JWT tokens are stored in localStorage
- Seats are automatically initialized when a trip is created

## Development

### Running Tests
Currently, no test suite is configured. You can add tests using Jest and React Testing Library.

### Building for Production
```bash
cd client
npm run build
```

The production build will be in `client/build/`.

## License

This project is created for assignment purposes.

