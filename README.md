# Government Hospital Management System

A comprehensive hospital management system built with React, TypeScript, Node.js, and MongoDB.

## Features

- **Hospital Management**: Add, edit, and delete hospitals with detailed information
- **Doctor Management**: Manage doctor profiles, qualifications, and specializations
- **Schedule Management**: Handle doctor schedules and availability
- **Admin Dashboard**: Secure admin panel with full CRUD operations
- **Responsive Design**: Modern UI built with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd project
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Install backend dependencies
```bash
cd server
npm install
```

### 4. Set up environment variables
Create a `config.env` file in the `server` directory:
```env
MONGODB_URI=mongodb://localhost:27017/hospital-management
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
```

### 5. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
```

### 6. Seed the database
```bash
cd server
npm run seed
```

This will create:
- Default admin user (username: `admin`, password: `admin123`)
- Sample hospitals, doctors, and schedules

### 7. Start the backend server
```bash
cd server
npm run dev
```

The backend will run on `http://localhost:5000`

### 8. Start the frontend
In a new terminal:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

### Admin Access
1. Navigate to the Admin page
2. Login with:
   - Username: `admin`
   - Password: `admin123`

### Admin Features
- **Hospitals**: Add, edit, and delete hospitals
- **Doctors**: Manage doctor profiles and information
- **Schedules**: Handle appointment schedules
- **Real-time Updates**: All changes are immediately reflected

### API Endpoints

#### Authentication
- `POST /api/admin/login` - Admin login

#### Hospitals
- `GET /api/admin/hospitals` - Get all hospitals
- `POST /api/admin/hospitals` - Create new hospital
- `PUT /api/admin/hospitals/:id` - Update hospital
- `DELETE /api/admin/hospitals/:id` - Delete hospital

#### Doctors
- `GET /api/admin/doctors` - Get all doctors
- `POST /api/admin/doctors` - Create new doctor
- `PUT /api/admin/doctors/:id` - Update doctor
- `DELETE /api/admin/doctors/:id` - Delete doctor

#### Schedules
- `GET /api/admin/schedules` - Get all schedules
- `POST /api/admin/schedules` - Create new schedule
- `PUT /api/admin/schedules/:id` - Update schedule
- `DELETE /api/admin/schedules/:id` - Delete schedule

## Project Structure

```
project/
├── src/                    # Frontend source code
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── context/           # React context
│   ├── services/          # API services
│   └── types/             # TypeScript types
├── server/                 # Backend source code
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── scripts/           # Database scripts
│   └── config.env         # Environment variables
└── README.md              # This file
```

## Technologies Used

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected admin routes
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.