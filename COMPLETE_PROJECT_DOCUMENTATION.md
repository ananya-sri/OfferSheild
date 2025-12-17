# offersheild - Complete Project Documentation

## 📋 Project Overview

The **Fake Job Scam Analyzer** is a comprehensive full-stack web application designed to detect and analyze fraudulent job offer letters, recruitment scams, and suspicious employment communications. The application uses advanced AI-powered analysis, domain verification, and pattern recognition to protect job seekers from fraudulent schemes.

---

## 🏗️ Architecture & Technology Stack

### **Frontend Architecture**
- **Framework**: React.js 19.2.0 (Modern React with Hooks)
- **Build Tool**: Vite 7.2.5 (Rolldown-based, ultra-fast build tool)
- **Routing**: React Router DOM 7.10.1 (Client-side routing)
- **Styling**: Tailwind CSS 3.4.18 (Utility-first CSS framework)
- **Charts**: Chart.js 4.5.1 + React Chartjs 2 5.3.1 (Data visualization)
- **HTTP Client**: Axios 1.13.2 (Promise-based HTTP client)
- **Development**: ESLint 9.39.1 (Code linting)

### **Backend Architecture**
- **Runtime**: Node.js (JavaScript runtime)
- **Framework**: Express.js 5.2.1 (Web application framework)
- **Database**: MongoDB (NoSQL database)
- **ODM**: Mongoose 9.0.0 (MongoDB object modeling)
- **Authentication**: JWT (JSON Web Tokens) via jsonwebtoken 9.0.3
- **Password Hashing**: bcryptjs 3.0.3
- **File Upload**: Multer 2.0.2 (Multipart form data handling)
- **Rate Limiting**: express-rate-limit 8.2.1 (API protection)
- **Caching**: Redis 5.10.0 + node-cache 5.1.2 (In-memory caching)

### **AI & Machine Learning**
- **AI Provider**: Groq SDK 0.37.0
- **Model**: Llama 3.1 8B Instant (Fast inference LLM)
- **Alternative**: OpenAI SDK 6.9.1 (Backup option)

### **File Processing**
- **PDF Parsing**: pdf-parse 2.4.5 (Text extraction from PDFs)
- **OCR**: Tesseract.js 6.0.1 (Optical Character Recognition for scanned PDFs)
- **Domain Verification**: whois-json 2.0.4 (WHOIS data lookup)

### **Development Tools**
- **Backend Dev Server**: Nodemon 3.1.11 (Auto-restart on file changes)
- **Frontend Dev Server**: Vite (Hot Module Replacement)
- **Environment Variables**: dotenv 17.2.3
- **UUID Generation**: uuid 13.0.0

---

## 📦 Complete Dependency Breakdown

### **Backend Dependencies (package.json)**

#### **Core Framework**
- **express** (^5.2.1): Web framework for Node.js
  - Handles HTTP requests and routing
  - Middleware support for authentication, file uploads, etc.

#### **Database & Data**
- **mongoose** (^9.0.0): MongoDB object modeling tool
  - Schema definition and validation
  - Query building and data relationships
- **redis** (^5.10.0): Redis client for caching
  - Stores domain verification results
  - Reduces API calls and improves performance
- **node-cache** (^5.1.2): In-memory caching
  - Local caching fallback when Redis unavailable

#### **Authentication & Security**
- **jsonwebtoken** (^9.0.3): JWT token generation and verification
  - Secure user authentication
  - Token-based session management
- **bcryptjs** (^3.0.3): Password hashing
  - Salt rounds: 10
  - Secure password storage
- **express-rate-limit** (^8.2.1): API rate limiting
  - Analyze endpoints: 10 requests/minute
  - Verify endpoints: 30 requests/minute
  - Prevents abuse and controls costs

#### **File Processing**
- **multer** (^2.0.2): File upload middleware
  - Memory storage (no disk writes)
  - File size limit: 10 MB
  - PDF file type validation
- **pdf-parse** (^2.4.5): PDF text extraction
  - Extracts text from PDF documents
  - Handles metadata extraction
  - Supports standard PDFs
- **tesseract.js** (^6.0.1): OCR (Optical Character Recognition)
  - Extracts text from scanned PDFs/images
  - Fallback when PDF text extraction fails
  - Supports multiple languages

#### **AI & External APIs**
- **groq-sdk** (^0.37.0): Groq AI API client
  - Fast inference with Llama models
  - Used for scam detection analysis
- **openai** (^6.9.1): OpenAI API client (backup)
  - Alternative AI provider option

#### **Network & HTTP**
- **axios** (^1.13.2): HTTP client
  - API requests to external services
  - Website verification checks
  - DNS resolution
- **cors** (^2.8.5): Cross-Origin Resource Sharing
  - Enables frontend-backend communication
  - Configures allowed origins

#### **Domain & Network Verification**
- **whois-json** (^2.0.4): WHOIS data lookup
  - Domain age calculation
  - Registration information
  - Domain authenticity checks
- **dns** (Node.js built-in): DNS resolution
  - MX record checks
  - A record verification
  - Domain existence validation

#### **Utilities**
- **uuid** (^13.0.0): Unique identifier generation
  - File naming (if disk storage needed)
  - Unique ID generation
- **dotenv** (^17.2.3): Environment variable management
  - Secure configuration
  - API keys and secrets

### **Frontend Dependencies (package.json)**

#### **Core Framework**
- **react** (^19.2.0): UI library
  - Component-based architecture
  - Hooks (useState, useEffect, useMemo)
  - Modern React features
- **react-dom** (^19.2.0): React DOM renderer
  - Browser DOM manipulation
  - Virtual DOM updates

#### **Routing**
- **react-router-dom** (^7.10.1): Client-side routing
  - Route definitions
  - Navigation between pages
  - Protected routes
  - URL state management

#### **Data Visualization**
- **chart.js** (^4.5.1): Chart library
  - Pie charts for statistics
  - Interactive data visualization
- **react-chartjs-2** (^5.3.1): React wrapper for Chart.js
  - React components for charts
  - Easy integration with React

#### **HTTP Client**
- **axios** (^1.13.2): Promise-based HTTP client
  - API communication
  - Request/response handling
  - Error handling

#### **Styling**
- **tailwindcss** (^3.4.18): Utility-first CSS framework
  - Dark theme implementation
  - Responsive design
  - Modern UI components
- **autoprefixer** (^10.4.22): CSS vendor prefixing
- **postcss** (^8.5.6): CSS processing

#### **Build Tools**
- **vite** (7.2.5): Build tool and dev server
  - Fast HMR (Hot Module Replacement)
  - Optimized production builds
  - Modern ES modules support

#### **Development Tools**
- **eslint** (^9.39.1): Code linting
- **@eslint/js**: ESLint JavaScript configuration
- **eslint-plugin-react-hooks**: React Hooks linting rules
- **eslint-plugin-react-refresh**: React Refresh linting

---

## 🗂️ Project Structure

### **Backend Structure**
```
backend/
├── app.js                    # Main Express app configuration
├── Server.js                 # Server entry point
├── package.json              # Backend dependencies
├── .env                      # Environment variables
└── src/
    ├── config/
    │   ├── db.js            # MongoDB connection
    │   └── redisClient.js   # Redis connection
    ├── controllers/
    │   ├── analyzeController.js    # Text analysis logic
    │   ├── pdfController.js         # PDF analysis logic
    │   └── whoisController.js       # WHOIS lookup logic
    ├── middleware/
    │   └── auth.js          # JWT authentication middleware
    ├── models/
    │   ├── User.js          # User schema
    │   └── Report.js        # Report schema
    ├── routes/
    │   ├── authRoutes.js           # Authentication routes
    │   ├── analyzeRoutes.js        # Text analysis routes
    │   ├── pdfRoutes.js            # PDF analysis routes
    │   ├── reportRoutes.js         # Report retrieval routes
    │   ├── verifyRoutes.js         # Domain verification routes
    │   └── whoisRoutes.js          # WHOIS lookup routes
    └── utils/
        ├── companyVerifier.js      # Company verification logic
        ├── domainVerifier.js       # Domain verification logic
        ├── ocr.js                  # OCR text extraction
        ├── openaiClient.js         # AI client configuration
        ├── redisClient.js          # Redis client setup
        └── textExtractors.js       # Email/company extraction
```

### **Frontend Structure**
```
frontend/
├── index.html               # HTML entry point
├── package.json             # Frontend dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Main app component with routing
    ├── index.css           # Global styles
    ├── Pages/
    │   ├── Analyzer.jsx    # Main analysis page
    │   ├── Dashboard.jsx  # Statistics dashboard
    │   ├── Login.jsx       # Login page
    │   ├── Signup.jsx      # Registration page
    │   └── Results.jsx     # Analysis results page
    └── Component/
        ├── PdfUpload.jsx        # PDF upload component
        ├── TextAnalyzer.jsx     # Text analysis component
        ├── ScamPieChart.jsx     # Statistics chart
        └── ReportModal.jsx      # Report detail modal
```

---

## 🔧 Core Features & Functionality

### **1. Authentication System**

#### **User Registration**
- **Endpoint**: `POST /api/auth/register`
- **Validation**:
  - Email format validation
  - Password minimum length (6 characters)
  - Duplicate email check
- **Security**:
  - Password hashing with bcryptjs (10 salt rounds)
  - Secure password storage
- **Flow**: Registration → Auto-login → Redirect to analyzer

#### **User Login**
- **Endpoint**: `POST /api/auth/login`
- **Process**:
  - Email/password validation
  - Password comparison with bcrypt
  - JWT token generation (1-day expiration)
  - Token storage in localStorage
- **Security**: JWT-based authentication

#### **Protected Routes**
- **Middleware**: `reqAuth` (JWT verification)
- **Implementation**:
  - Token extraction from Authorization header
  - Token signature verification
  - Expiration checking
  - User ID attachment to request

### **2. PDF Analysis System**

#### **File Upload**
- **Endpoint**: `POST /api/analyze/pdf`
- **Configuration**:
  - Max file size: 10 MB
  - File type: PDF only
  - Storage: Memory (no disk writes)
  - Middleware: Multer

#### **Text Extraction Pipeline**
1. **Primary Extraction** (pdf-parse)
   - Direct text extraction from PDF
   - Metadata extraction
   - Handles standard PDFs

2. **OCR Fallback** (tesseract.js)
   - Triggered if text < 30 characters
   - Processes scanned PDFs
   - Image-based text extraction
   - Multi-language support

3. **Validation**
   - Minimum text length: 10 characters
   - Error handling for corrupted files
   - Empty PDF detection

#### **Data Extraction**
- **Email Extraction**:
  - Regex pattern matching
  - First email found in document
- **Company Extraction**:
  - Pattern matching for company names
  - Handles various formats
  - Company suffix recognition (Inc, LLC, etc.)

### **3. Text Analysis System**

#### **Text Analysis**
- **Endpoint**: `POST /api/analyze/text`
- **Input**:
  - Job description (required, min 3 chars)
  - HR email (optional)
  - Company name (optional)
- **Process**:
  - Text validation
  - Email/company extraction
  - Domain verification (optional)
  - AI analysis

#### **Domain Verification**
- **Endpoint**: `GET /api/verify/domain?q=<domain>`
- **Checks**:
  - DNS records (A, MX)
  - Website accessibility
  - Domain age (WHOIS)
  - Trust score calculation
- **Caching**: Redis (24-hour TTL)

### **4. AI-Powered Analysis**

#### **AI Model Configuration**
- **Provider**: Groq API
- **Model**: Llama 3.1 8B Instant
- **Parameters**:
  - Temperature: 0 (deterministic)
  - Max tokens: 600-800
  - JSON-only responses

#### **Analysis Output**
```json
{
  "scam_probability": 0-100,
  "verdict": "safe" | "suspicious" | "scam",
  "red_flags": ["array of warning phrases"],
  "suspicious_phrases": ["array of suspicious text"],
  "summary": "AI-generated explanation"
}
```

#### **Prompt Engineering**
- Structured prompts for consistent output
- JSON-only response enforcement
- Red flag detection rules
- Context-aware analysis

### **5. Database Schema**

#### **User Model**
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  createdAt: Date,
  updatedAt: Date
}
```

#### **Report Model**
```javascript
{
  source: String (default: "pdf" | "text"),
  originalTextSnippet: String (first 1500 chars),
  hrEmail: String,
  company: String,
  scam_probability: Number (0-100),
  verdict: String ("safe" | "suspicious" | "scam"),
  red_flags: [String],
  suspicious_phrases: [String],
  summary: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **6. API Endpoints**

#### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### **Analysis**
- `POST /api/analyze/pdf` - PDF analysis (rate limited: 10/min)
- `POST /api/analyze/text` - Text analysis (rate limited: 10/min)

#### **Reports**
- `GET /api/reports` - Get all reports
- `GET /api/reports/stats` - Get statistics

#### **Verification**
- `GET /api/verify/domain?q=<domain>` - Domain verification (rate limited: 30/min)

### **7. Frontend Features**

#### **Pages**
1. **Login Page** (`/login`)
   - Email/password form
   - Error handling
   - Link to signup
   - Auto-redirect if authenticated

2. **Signup Page** (`/signup`)
   - Registration form
   - Password confirmation
   - Validation
   - Auto-login after signup

3. **Analyzer Page** (`/analyze`)
   - PDF upload component
   - Text analyzer component
   - Navigation bar
   - Protected route

4. **Results Page** (`/results`)
   - Detailed analysis results
   - Verdict display
   - Red flags section
   - Suspicious phrases
   - Summary
   - Action buttons

5. **Dashboard Page** (`/dashboard`)
   - Statistics pie chart
   - Reports table
   - Report detail modal
   - Navigation controls

#### **Components**
1. **PdfUpload**
   - File selection
   - Upload button
   - Loading states
   - Error handling
   - Navigation to results

2. **TextAnalyzer**
   - Text input area
   - Optional email/company fields
   - Analysis button
   - Results display
   - Copy/download features

3. **ScamPieChart**
   - Interactive pie chart
   - Statistics summary
   - Color-coded segments
   - Tooltips with percentages

4. **ReportModal**
   - Detailed report view
   - All analysis data
   - Contact information
   - Text snippet
   - Close functionality

### **8. Security Features**

#### **Authentication Security**
- JWT token-based authentication
- Password hashing with bcryptjs
- Token expiration (1 day)
- Secure token storage

#### **API Protection**
- Rate limiting on expensive endpoints
- CORS configuration
- Input validation
- Error handling

#### **File Upload Security**
- File type validation (PDF only)
- File size limits (10 MB)
- Memory storage (no disk access)
- Input sanitization

### **9. Caching Strategy**

#### **Redis Caching**
- **Domain Verification**: 24-hour TTL
- **DNS Checks**: Cached results
- **Website Info**: Cached responses
- **WHOIS Data**: Cached age calculations

#### **Benefits**
- Reduced API calls
- Faster response times
- Cost optimization
- Better user experience

### **10. Error Handling**

#### **Backend Error Handling**
- Try-catch blocks in all async functions
- HTTP status codes (400, 401, 403, 500)
- Detailed error messages
- Logging for debugging

#### **Frontend Error Handling**
- Network error messages
- Validation errors
- Loading states
- User-friendly error displays

---

## 🚀 Development Workflow

### **Backend Development**
```bash
cd backend
npm install          # Install dependencies
npm run dev          # Start with nodemon (auto-restart)
```

### **Frontend Development**
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start Vite dev server
```

### **Environment Variables**
```env
# Backend .env
MONGODB_URI=mongodb://localhost:27017/fake-scam-detector
JWT_SECRET=your-secret-key
GROQ_API_KEY=your-groq-api-key
REDIS_URL=redis://127.0.0.1:6379
PORT=5000

# Frontend (if needed)
VITE_API_URL=http://localhost:5000
```

---

## 📊 Data Flow

### **PDF Analysis Flow**
1. User uploads PDF → Frontend
2. Frontend sends to `/api/analyze/pdf` → Backend
3. Backend extracts text (pdf-parse) → Text
4. If text too short → OCR (tesseract.js) → Text
5. Extract email/company → Data
6. Send to AI (Groq) → Analysis
7. Save to MongoDB → Report
8. Return to frontend → Results page

### **Text Analysis Flow**
1. User enters text → Frontend
2. Frontend sends to `/api/analyze/text` → Backend
3. Extract email/company → Data
4. Optional domain verification → Trust score
5. Send to AI (Groq) → Analysis
6. Save to MongoDB → Report
7. Return to frontend → Results page

### **Dashboard Flow**
1. User navigates to dashboard → Frontend
2. Fetch reports from `/api/reports` → Backend
3. Fetch stats from `/api/reports/stats` → Backend
4. Display chart and table → Frontend
5. User clicks report → Modal with details

---

## 🎨 UI/UX Features

### **Design System**
- **Theme**: Dark mode throughout
- **Colors**:
  - Primary: Blue to Purple gradient
  - Success: Green shades
  - Warning: Yellow shades
  - Danger: Red shades
  - Background: Gray-900 to Gray-800 gradient

### **Interactive Elements**
- Hover effects on buttons
- Scale transforms
- Smooth transitions
- Loading spinners
- Color-coded verdicts
- Gradient backgrounds

### **Responsive Design**
- Mobile-friendly layouts
- Flexible grid systems
- Responsive tables
- Adaptive modals
- Touch-friendly buttons

---

## 🔒 Security Best Practices

1. **Password Security**: bcrypt hashing with 10 salt rounds
2. **JWT Tokens**: Secure token generation and verification
3. **Rate Limiting**: Prevents abuse and controls costs
4. **Input Validation**: All user inputs validated
5. **File Upload Security**: Type and size restrictions
6. **CORS Configuration**: Controlled cross-origin requests
7. **Environment Variables**: Sensitive data in .env files
8. **Error Messages**: No sensitive data in error responses

---

## 📈 Performance Optimizations

1. **Redis Caching**: Reduces redundant API calls
2. **Memory Storage**: No disk I/O for file uploads
3. **Rate Limiting**: Prevents server overload
4. **Efficient Queries**: MongoDB indexes
5. **Code Splitting**: Vite optimizations
6. **Lazy Loading**: React component optimization

---

## 🛠️ Future Enhancements

1. User-specific report filtering
2. Report export (PDF/CSV)
3. Email notifications for high-risk scams
4. Batch PDF processing
5. Historical trend analysis
6. Company verification database
7. User feedback system
8. Report sharing functionality
9. Advanced filtering and search
10. Multi-language support

---

## 📝 Summary

This project is a comprehensive full-stack application combining:
- **Modern Frontend**: React 19, Tailwind CSS, Chart.js
- **Robust Backend**: Express.js, MongoDB, Redis
- **AI Integration**: Groq API for intelligent analysis
- **Security**: JWT authentication, rate limiting, input validation
- **File Processing**: PDF parsing, OCR fallback
- **Domain Verification**: DNS, WHOIS, website checks
- **User Experience**: Dark theme, responsive design, interactive UI

The application provides a complete solution for detecting fraudulent job offers and protecting job seekers from scams through AI-powered analysis and comprehensive verification systems.

