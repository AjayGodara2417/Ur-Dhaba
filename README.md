# Ur Dhaba - Restaurant Management Platform

A full-stack food delivery and restaurant management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User Authentication (JWT)
  - Multiple user roles (Customer, Restaurant Owner, Admin)
  - Secure password hashing
  - Protected routes

- Restaurant Management
  - Create and manage restaurants
  - Update restaurant details
  - Toggle restaurant status
  - Manage business hours
  - Upload and manage documents
  - Handle bank details

- Menu Management
  - Create and manage menu items
  - Categories and customizations
  - Price management
  - Item availability toggle

- Order System
  - Real-time order tracking
  - Order history
  - Status updates
  - Payment integration

## Tech Stack

### Frontend
- React.js
- Redux Toolkit for state management
- Material-UI for styling
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ur-dhaba.git
cd ur-dhaba
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

4. Set up environment variables
Create .env files in both frontend and backend directories:

Backend (.env):
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ur-dhaba
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

Frontend (.env):
```
REACT_APP_API_URL=http://localhost:5000/api
```

5. Run the application
Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm start
```

## API Documentation

### Authentication Endpoints
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Restaurant Endpoints
- POST /api/restaurants - Create a restaurant
- GET /api/restaurants - Get all restaurants
- GET /api/restaurants/:id - Get single restaurant
- PUT /api/restaurants/:id - Update restaurant
- DELETE /api/restaurants/:id - Delete restaurant
- PUT /api/restaurants/:id/status - Toggle restaurant status
- PUT /api/restaurants/:id/hours - Update business hours
- PUT /api/restaurants/:id/documents - Update documents

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - your.email@example.com
Project Link: https://github.com/yourusername/ur-dhaba