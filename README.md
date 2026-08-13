# RateNest

RateNest is a full-stack store rating and review platform that allows users to discover stores, view ratings, and submit or update their ratings.

The application provides secure authentication, role-based access control, store management, rating management, search, filtering, and dedicated dashboards for administrators, store owners, and users.

## Features

### Authentication & Authorization

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control
- Protected routes
- Secure logout
- Password change functionality

### User Roles

RateNest supports three different roles:

- **ADMIN** – Manage users, stores, and store requests
- **STORE_OWNER** – Manage and monitor their store
- **NORMAL_USER** – Browse stores and submit ratings

### Store Management

- Add and manage stores
- View store details
- Display store owner information
- Search stores
- Filter stores by rating
- Sort stores
- Display average rating
- Display total number of ratings

### Rating System

- Submit ratings from 1 to 5
- Prevent duplicate ratings for the same store
- Update existing ratings
- Automatically calculate average ratings
- Display total rating count
- Interactive star-rating interface

### Dashboards

#### Admin Dashboard
- Manage users
- Manage stores
- Add stores
- Manage store requests
- View system information

#### Store Owner Dashboard
- View store information
- Monitor store ratings
- View rating statistics

#### User Dashboard
- Browse stores
- Search and filter stores
- Submit ratings
- Update ratings
- Manage profile

## Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- Axios
- React Router
- CSS

### Backend
- Node.js
- Express.js
- JWT
- bcrypt
- CORS
- dotenv

### Database
- MySQL

### Tools
- Git
- GitHub
- VS Code
- MySQL Workbench

## Project Structure

```text
RateNest/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
