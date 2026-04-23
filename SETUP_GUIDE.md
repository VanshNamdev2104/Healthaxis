# HealthAxis - Complete Project Setup Guide

## 📋 Project Overview

HealthAxis is a comprehensive healthcare management platform that connects patients, doctors, and hospitals. It provides appointment booking, medical consultation, and hospital management features.

## 🏗️ Project Structure

```
HealthAxis/
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── app/              # App configuration & routing
│   │   ├── assets/           # Images, icons, fonts
│   │   ├── components/       # Reusable components
│   │   ├── features/         # Feature modules
│   │   │   ├── admin/        # Admin panel
│   │   │   ├── auth/         # Authentication
│   │   │   ├── health/       # Health-related features
│   │   │   ├── hospital/     # Hospital features
│   │   │   └── chat/         # Chat functionality
│   │   ├── layouts/          # Layout components
│   │   ├── lib/              # Utilities & helpers
│   │   ├── pages/            # Page components
│   │   └── main.jsx          # Entry point
│
├── server/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Route controllers
│   │   ├── middlewares/      # Custom middlewares
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Helper functions
│   │   ├── validations/      # Input validation
│   │   └── index.js          # Server entry point
│   ├── logs/                 # Application logs
│   └── package.json
│
└── README.md                 # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 5.0+
- npm or yarn

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Configure .env with your settings
# - MONGODB_URI
# - JWT_SECRET
# - EMAIL_USER & EMAIL_PASSWORD
# - Payment gateway keys
# - Google OAuth credentials

# Run database migrations (if any)
npm run seed

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Configure API endpoint in lib/api/axiosConfig.js
# Point to http://localhost:5000/api/v1

# Start development server
npm run dev

# Frontend runs on http://localhost:5173
```

## 📡 API Endpoints

### User Management
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/profile` - Get profile
- `PUT /api/v1/users/profile` - Update profile
- `POST /api/v1/users/change-password` - Change password
- `GET /api/v1/users/all` - Get all users (Admin)

### Hospital Management
- `GET /api/v1/hospitals` - Get all hospitals
- `POST /api/v1/hospitals` - Create hospital
- `GET /api/v1/hospitals/:id` - Get hospital details
- `PUT /api/v1/hospitals/:id` - Update hospital
- `DELETE /api/v1/hospitals/:id` - Delete hospital
- `PATCH /api/v1/hospitals/:id/admin/approve` - Approve hospital (Admin)

### Doctor Management
- `GET /api/v1/doctors` - Get all doctors
- `POST /api/v1/doctors` - Register doctor
- `GET /api/v1/doctors/:id` - Get doctor details
- `PUT /api/v1/doctors/:id` - Update doctor profile
- `GET /api/v1/doctors/:id/availability` - Get availability

### Appointments
- `POST /api/v1/appointments` - Book appointment
- `GET /api/v1/appointments` - Get appointments
- `GET /api/v1/appointments/:id` - Get appointment details
- `PUT /api/v1/appointments/:id` - Update appointment
- `DELETE /api/v1/appointments/:id` - Cancel appointment

### Disease & Medicine
- `GET /api/v1/diseases` - Get all diseases
- `POST /api/v1/diseases` - Create disease (Admin)
- `GET /api/v1/medicines` - Get all medicines
- `POST /api/v1/medicines` - Create medicine (Admin)

## 🔐 Authentication

The application uses JWT (JSON Web Token) for authentication.

### Login Flow
1. User sends credentials to `/api/v1/users/login`
2. Server validates and returns JWT token
3. Client stores token in localStorage
4. Token sent in `Authorization: Bearer <token>` header for protected routes
5. Middleware validates token and allows/denies access

### Protected Routes
All routes marked with `authMiddleware` require valid JWT token.

## 🎯 Key Features

### User Management
- User registration and login
- Profile management
- Role-based access (Patient, Doctor, Admin, Hospital)
- Password reset functionality

### Hospital Management
- Hospital registration
- Approval workflow
- Department/specialization management
- Analytics dashboard

### Doctor Management
- Doctor profile and credentials
- Availability scheduling
- Appointment management
- Rating and reviews

### Appointments
- Appointment booking
- Schedule management
- Cancellation and rescheduling
- Appointment reminders

### Health Information
- Disease database
- Medicine catalog
- Medical records
- Health tips

### Admin Panel
- User management
- Hospital approvals
- System analytics
- Activity logs
- Settings management

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd server
npm run test

# Frontend tests
cd client
npm run test
```

### Building for Production

**Backend:**
```bash
cd server
npm run build
npm start
```

**Frontend:**
```bash
cd client
npm run build
# Outputs to dist/ directory
```

## 📦 Dependencies

### Frontend
- React 19.2.4
- Vite 4.x
- Tailwind CSS 4.2
- Framer Motion 12.38
- Redux Toolkit 2.11
- React Router 7.14
- Axios 1.15
- React Hook Form 7.72

### Backend
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Joi for validation
- Nodemailer for email
- Multer for file uploads
- Socket.io for real-time chat

## 🔄 Workflow

### Adding a New Feature

1. **Create Models** - Define database schema
2. **Create Controllers** - Implement business logic
3. **Create Routes** - Setup API endpoints
4. **Add Validation** - Validate input data
5. **Create Services** - Business logic layer
6. **Frontend Components** - Create UI components
7. **Connect APIs** - Use axios to call backend
8. **Add Tests** - Test the feature

### Creating a New API Endpoint

**Backend:**
```javascript
// 1. Create route in src/routes/feature.routes.js
router.get('/:id', featureController.getFeature);

// 2. Create controller in src/controllers/feature.controller.js
export const getFeature = async (req, res) => {
  // implementation
};

// 3. Add validation in src/validations/schemas.js
getFeature: Joi.object({ id: Joi.string().required() })
```

**Frontend:**
```javascript
// 1. Create API call in lib/api/
export const getFeature = (id) => {
  return api.get(`/features/${id}`);
};

// 2. Use in component
const { data } = await getFeature(id);
```

## 📊 Database Models

### User
```javascript
{
  name, email, password, phone,
  role, profileImage, status,
  dateOfBirth, address,
  createdAt, updatedAt
}
```

### Hospital
```javascript
{
  name, email, phone, address,
  city, state, zipCode,
  description, registrationNumber,
  licenseDocument, specializations,
  status, rating, reviews,
  createdAt, updatedAt
}
```

### Doctor
```javascript
{
  name, email, phone,
  specialization, qualifications,
  experience, licenseNumber,
  hospitalId, availability,
  rating, reviews,
  createdAt, updatedAt
}
```

### Appointment
```javascript
{
  patientId, doctorId, hospitalId,
  appointmentDate, appointmentTime,
  reason, notes, status,
  createdAt, updatedAt
}
```

## 🚨 Error Handling

The application uses centralized error handling:

```javascript
// Errors are caught and formatted consistently
{
  success: false,
  message: "Error message",
  errors: { field: "error details" },
  statusCode: 400
}
```

## 📝 Logging

Logs are stored in `server/logs/app.log` with the following information:
- Timestamp
- Log level (info, warn, error)
- Request/Response details
- Stack traces for errors

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Helmet.js for HTTP headers
- MongoDB injection prevention

## 🚀 Deployment

### Deploy to Production

**Backend (Heroku/Railway/Render):**
```bash
cd server
npm install --production
npm start
```

**Frontend (Vercel/Netlify):**
```bash
cd client
npm run build
# Deploy dist/ folder
```

## 📞 Support & Maintenance

- Monitor logs for errors
- Regular database backups
- Update dependencies regularly
- Monitor API performance
- User feedback and issues

## 📄 License

MIT License - See LICENSE file

## 👥 Team

HealthAxis Development Team

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request
5. Code review and merge

---

For more information, refer to individual README files in each module.
