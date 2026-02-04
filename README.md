Backend readme · MD
Copy

# DevHub Backend - Professional Networking Platform API

## Overview
RESTful API backend for DevHub, a professional networking platform with authentication, connection management, real-time chat, and user feed features.

## 🛠️ Tech Stack
- **Runtime:** Node.js (v14+)
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcrypt
- **Real-time:** Socket.IO
- **Validation:** validator.js
- **Environment:** dotenv

## Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middlewares/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── user.js               # User schema
│   │   ├── connectionRequest.js  # Connection request schema
│   │   └── chat.js               # Chat & message schema
│   ├── router/
│   │   ├── auth.js               # Authentication routes
│   │   ├── profile.js            # Profile management routes
│   │   ├── request.js            # Connection request routes
│   │   ├── user.js               # User & feed routes
│   │   ├── chat.js               # Chat routes
│   │   └── premium.js            # Premium features routes
│   ├── utils/
│   │   ├── validation.js         # Input validation helpers
│   │   └── socket.js             # Socket.IO configuration
│   └── app.js                    # Application entry point
├── .env                          # Environment variables (create this)
├── .env.example                  # Environment template
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   DB_CONNECTION_SECRET=mongodb://localhost:27017/devhub
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/devhub
   
   JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
   PORT=3000
   ```

3. **Start MongoDB**
   
   **Local MongoDB:**
   ```bash
   mongod
   ```
   
   **MongoDB Atlas:** 
   - Create a cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Get connection string and update `DB_CONNECTION_SECRET`

4. **Run the Application**
   
   **Development Mode:**
   ```bash
   npm start
   ```
   
   **Production Mode:**
   ```bash
   NODE_ENV=production npm start
   ```

5. **Verify Installation**
   
   Server should start at: `http://localhost:3000`
   
   Check console for: "Database Connection Established !!!"

## 📡 API Documentation

### Base URL
```
Local: http://localhost:3000
Production: https://devhub-cygq.onrender.com
```

### API Versioning
All routes follow the pattern: `/api/v1/{endpoint}`

---

### Authentication Endpoints

#### 1. Sign Up
```http
POST /signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "emailId": "john.doe@example.com",
  "password": "SecurePass123!",
  "age": 25,
  "gender": "male",
  "photoUrl": "https://example.com/photo.jpg" (optional),
  "about": "Software developer passionate about tech" (optional)
}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "emailId": "john.doe@example.com",
  "age": 25,
  "gender": "male",
  "photoUrl": "https://...",
  "createdAt": "2024-02-04T10:30:00.000Z"
}

Errors:
- 400: Invalid data (weak password, invalid email, etc.)
```

#### 2. Login
```http
POST /login
Content-Type: application/json

{
  "emailId": "john.doe@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "emailId": "john.doe@example.com",
  ...
}

Set-Cookie: token=; HttpOnly; Secure; SameSite=None; Max-Age=604800

Errors:
- 400: Invalid credentials
```

#### 3. Logout
```http
POST /logout

Response: 200 OK
"Logout Successful !!!"
```

---

### Profile Endpoints (Protected)

#### 1. View Profile
```http
GET /profile/view
Cookie: token=

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "emailId": "john.doe@example.com",
  "age": 25,
  "gender": "male",
  "about": "Software developer",
  "photoUrl": "https://...",
  "skills": ["JavaScript", "React", "Node.js"],
  "createdAt": "2024-02-04T10:30:00.000Z"
}

Errors:
- 401: Please Login
- 400: User does not exist
```

#### Edit Profile
```http
PATCH /profile/edit
Cookie: token=
Content-Type: application/json

{
  "firstName": "John",
  "about": "Senior Software Developer",
  "skills": ["JavaScript", "TypeScript", "React"]
}

Allowed Fields: firstName, lastName, emailId, age, gender, skills, about, photoUrl

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "about": "Senior Software Developer",
  ...
}

Errors:
- 400: Invalid Edit Request
```

#### 3. Change Password
```http
PATCH /profile/password
Cookie: token=
Content-Type: application/json

{
  "existingPassword": "OldPass123!",
  "newPassword": "NewSecurePass456!"
}

Response: 200 OK
"Password Updated Successfully"

Errors:
- 400: Invalid credentials (wrong existing password)
```

---

### Connection Request Endpoints (Protected)

#### 1. Send Connection Request
```http
POST /request/send/:status/:toUserId
Cookie: token=

Parameters:
- status: "interested" | "ignore"
- toUserId: MongoDB ObjectId of target user

Example: POST /request/send/interested/507f1f77bcf86cd799439012

Response: 200 OK
"John interested Steve"

Errors:
- 400: Invalid Status Type
- 400: User does not Exist
- 400: Connection Request Already Exist!!!
- 400: Cannot Send Request to Yourself !!!
```

#### 2. Review Connection Request
```http
POST /request/review/:status/:requestId
Cookie: token=

Parameters:
- status: "accept" | "reject"
- requestId: MongoDB ObjectId of connection request

Example: POST /request/review/accept/507f1f77bcf86cd799439013

Response: 200 OK
"Connection Request is accepted"
OR
"Request is Rejected"

Errors:
- 400: Invalid Status Type
- 400: Connection Request Not Found !!!
```

---

### User & Feed Endpoints (Protected)

#### 1. Get Received Requests
```http
GET /user/request/received
Cookie: token=

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "fromUserId": {
      "firstName": "Alice",
      "lastName": "Smith",
      "age": 28,
      "gender": "female",
      "skills": ["Python", "Django"],
      "about": "Backend developer",
      "photoUrl": "https://..."
    },
    "toUserId": "507f1f77bcf86cd799439011",
    "status": "interested",
    "createdAt": "2024-02-04T09:00:00.000Z"
  }
]
```

#### 2. Get Connections
```http
GET /user/connections
Cookie: token=

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "firstName": "Bob",
    "lastName": "Johnson",
    "age": 30,
    "gender": "male",
    "skills": ["React", "Vue"],
    "about": "Frontend specialist",
    "photoUrl": "https://..."
  }
]
```

#### 3. Get Feed (Paginated)
```http
GET /feed?page=1&limit=10
Cookie: token=

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10, max: 50)

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "firstName": "Charlie",
    "lastName": "Brown",
    "age": 26,
    "gender": "male",
    "skills": ["Java", "Spring"],
    "about": "Backend engineer",
    "photoUrl": "https://..."
  }
]

Note: Feed excludes:
- Current user
- Users with existing connection requests (any status)
- Users already connected
```

---

### Chat Endpoints (Protected)

#### 1. Get Chat History
```http
GET /chat/:targetUserId
Cookie: token=

Parameters:
- targetUserId: MongoDB ObjectId of chat partner

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439016",
  "participants": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012"
  ],
  "messages": [
    {
      "_id": "507f1f77bcf86cd799439017",
      "senderId": {
        "firstName": "John",
        "lastName": "Doe",
        "photoUrl": "https://..."
      },
      "text": "Hello!",
      "createdAt": "2024-02-04T10:00:00.000Z"
    }
  ],
  "createdAt": "2024-02-04T09:00:00.000Z"
}

Note: Creates new chat if none exists
```

---

### Premium Endpoints (Protected)

#### 1. Create Payment
```http
POST /payment/create
Cookie: token=

Response: 200 OK
"Payment Created !!!"

Note: Placeholder for payment integration
```

---

## WebSocket Events (Socket.IO)

### Connection
```javascript
socket.on('connection', (socket) => {
  // Client connected
});
```

### Join Chat Room
```javascript
socket.emit('joinChat', {
  firstName: "John",
  lastName: "Doe",
  userId: "507f1f77bcf86cd799439011",
  targetUserId: "507f1f77bcf86cd799439012"
});
```

### Send Message
```javascript
socket.emit('sendMessage', {
  firstName: "John",
  lastName: "Doe",
  userId: "507f1f77bcf86cd799439011",
  targetUserId: "507f1f77bcf86cd799439012",
  text: "Hello!",
  photoUrl: "https://..."
});
```

### Receive Message
```javascript
socket.on('receivedMessage', (data) => {
  // data: { firstName, lastName, text, photoUrl }
});
```

### Disconnect
```javascript
socket.on('disconnect', () => {
  // Client disconnected
});
```

---

## Database Schema

### User Model
```javascript
{
  firstName: String (required, 3-50 chars, alpha only),
  lastName: String (required, 3-50 chars, alpha only),
  emailId: String (required, unique, valid email),
  password: String (required, hashed with bcrypt),
  age: Number (required, 18-120),
  gender: Enum ["male", "female", "other"] (required),
  about: String (10-100 chars),
  photoUrl: String (valid URL, default provided),
  skills: Array of Strings (max 10),
  timestamps: true
}
```

### Connection Request Model
```javascript
{
  fromUserId: ObjectId (ref: User, required),
  toUserId: ObjectId (ref: User, required),
  status: Enum ["ignore", "interested", "accept", "reject"] (required),
  timestamps: true
}

Indexes: { firstName: 1, LastName: 1 }
```

### Chat Model
```javascript
{
  participants: [ObjectId] (ref: User, required),
  messages: [
    {
      senderId: ObjectId (ref: User, required),
      text: String (required),
      timestamps: true
    }
  ],
  timestamps: true
}
```

---

## Security Features

### 1. Password Security
- **Hashing Algorithm:** bcrypt with 10 salt rounds
- **Validation:** Minimum 8 characters, requires uppercase, lowercase, number, special character
- **Storage:** Never stores plain text passwords

### 2. JWT Authentication
- **Algorithm:** Default (HS256)
- **Expiry:** 7 days (604800 seconds)
- **Storage:** HTTP-only cookies
- **Verification:** Middleware validates on every protected route

### 3. Cookie Security
```javascript
{
  httpOnly: true,        // Prevents XSS attacks
  secure: true,          // HTTPS only (production)
  sameSite: "None",      // Cross-site cookies
  maxAge: 604800000      // 7 days
}
```

### 4. Input Validation
- **Server-side:** All inputs validated before processing
- **Email:** Validated using validator.isEmail()
- **Password:** Validated using validator.isStrongPassword()
- **Sanitization:** Mongoose schema validation prevents injection

### 5. Protected Routes
- All routes except `/signup`, `/login`, `/logout` require authentication
- Middleware validates JWT token and attaches user to request object

### 6. CORS Configuration
```javascript
cors({
  origin: [
    "http://localhost:5173",
    "https://dev-hub-frontend-ruby.vercel.app"
  ],
  credentials: true
})
```

---

##Testing the API

### Using cURL

**Sign Up:**
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "emailId": "test@example.com",
    "password": "Test@12345",
    "age": 25,
    "gender": "male"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailId": "test@example.com",
    "password": "Test@12345"
  }' \
  -c cookies.txt
```

**View Profile:**
```bash
curl -X GET http://localhost:3000/profile/view \
  -b cookies.txt
```

### Using Postman
Import the provided Postman collection: `DevHub.postman_collection.json`

---

## Scalability Considerations for Production

### 1. **Database Optimization**
- **Indexing Strategy:**
  ```javascript
  // Add compound indexes for frequent queries
  userSchema.index({ emailId: 1 });
  connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
  connectionRequestSchema.index({ toUserId: 1, status: 1 });
  chatSchema.index({ participants: 1 });
  ```

- **Connection Pooling:**
  ```javascript
  mongoose.connect(DB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  });
  ```

- **Read Replicas:** Use MongoDB replica sets for read-heavy operations
- **Sharding:** Implement sharding for horizontal scaling when user base exceeds millions

### 2. **Caching Strategy**
- **Redis Integration:**
  - Cache user profiles (TTL: 1 hour)
  - Cache feed results (TTL: 5 minutes)
  - Session storage for JWT tokens
  - Rate limiting counters

- **Implementation:**
  ```javascript
  // Cache user profile
  const cachedUser = await redis.get(`user:${userId}`);
  if (cachedUser) return JSON.parse(cachedUser);
  
  const user = await User.findById(userId);
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
  ```

### 3. **API Versioning & Documentation**
- **Current:** Implement `/api/v1/` prefix for all routes
- **Future:** Support `/api/v2/` for breaking changes
- **Documentation:** Auto-generate with Swagger/OpenAPI
  ```bash
  npm install swagger-ui-express swagger-jsdoc
  ```

### 4. **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later'
});

app.use('/api/v1/', limiter);
```

### 5. **Security Enhancements**
- **Helmet.js:** Secure HTTP headers
  ```javascript
  const helmet = require('helmet');
  app.use(helmet());
  ```

- **CSRF Protection:**
  ```javascript
  const csrf = require('csurf');
  app.use(csrf({ cookie: true }));
  ```

- **Input Sanitization:**
  ```javascript
  const mongoSanitize = require('express-mongo-sanitize');
  app.use(mongoSanitize());
  ```

- **Refresh Token Mechanism:**
  - Access tokens (15 min expiry)
  - Refresh tokens (30 days expiry)
  - Stored securely in database

### 6. **Monitoring & Logging**
- **Winston Logger:**
  ```javascript
  const winston = require('winston');
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });
  ```

- **Error Tracking:** Sentry integration
- **APM:** New Relic or DataDog for performance monitoring
- **Health Checks:**
  ```javascript
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date(),
      uptime: process.uptime(),
      db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
  });
  ```

### 7. **Deployment Strategy**
- **Containerization:**
  ```dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .
  EXPOSE 3000
  CMD ["node", "src/app.js"]
  ```

- **Orchestration:** Kubernetes for auto-scaling
- **Load Balancing:** NGINX or AWS ALB
- **Process Management:** PM2 for Node.js clustering
  ```bash
  pm2 start src/app.js -i max
  ```

- **Environment Management:**
  - Dev: Local development
  - Staging: Pre-production testing
  - Production: Live environment

### 8. **Performance Optimization**
- **Database Query Optimization:**
  - Use `.lean()` for read-only queries (40% faster)
  - Implement pagination for all list endpoints
  - Use `.select()` to fetch only required fields

- **Response Compression:**
  ```javascript
  const compression = require('compression');
  app.use(compression());
  ```

- **Connection Pooling:** Configure optimal pool size based on traffic

### 9. **Backup & Disaster Recovery**
- **Automated Backups:** Daily MongoDB backups to S3
- **Point-in-Time Recovery:** Enable MongoDB oplog
- **Disaster Recovery Plan:** Multi-region deployment
- **Data Retention:** 30-day backup retention policy

### 10. **CI/CD Pipeline**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: docker build -t devhub-api .
      - run: docker push devhub-api
      - run: kubectl apply -f k8s/
```

---

## Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
"Please Login"
```

**400 Bad Request:**
```json
"Error : Invalid credentials"
"Error Saving the User : "
```

**500 Internal Server Error:**
```json
"Something went wrong : "
```

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_CONNECTION_SECRET` | MongoDB connection string | `mongodb://localhost:27017/devhub` |
| `JWT_SECRET` | Secret key for JWT signing | `my_super_secret_key_min_32_chars` |
| `PORT` | Server port number | `3000` |

---

## Dependencies

### Production Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.0",
  "bcrypt": "^5.1.0",
  "jsonwebtoken": "^9.0.0",
  "dotenv": "^16.0.3",
  "cors": "^2.8.5",
  "cookie-parser": "^1.4.6",
  "validator": "^13.9.0",
  "socket.io": "^4.6.0"
}
```

### Development Dependencies
```json
{
  "nodemon": "^2.0.22"
}
```

---
