# Fake Job Scam Analyzer - Detailed Functionality Documentation

## 📋 Project Overview

The **Fake Job Scam Analyzer** is a full-stack web application designed to detect fraudulent job offer letters and recruitment scams. It uses AI-powered analysis to identify suspicious patterns, red flags, and potential scams in PDF job offer documents.

---

## 🏗️ Architecture

### **Tech Stack**
- **Frontend**: React.js with React Router DOM, Tailwind CSS, Chart.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI/ML**: Groq API (Llama 3.1 8B Instant model)
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **File Processing**: pdf-parse, multer, tesseract.js (OCR)

---

## 🔐 Authentication System

### **User Registration (`/signup`)**
- **Endpoint**: `POST /api/auth/register`
- **Functionality**:
  - Validates email format and password length (minimum 6 characters)
  - Checks for duplicate email addresses
  - Hashes passwords using bcryptjs (10 salt rounds)
  - Creates new user account in MongoDB
  - Auto-login after successful registration
  - Redirects to analyzer page upon completion

### **User Login (`/login`)**
- **Endpoint**: `POST /api/auth/login`
- **Functionality**:
  - Validates user credentials (email and password)
  - Compares hashed password with stored hash
  - Generates JWT token (expires in 1 day)
  - Stores token in localStorage
  - Redirects authenticated users to analyzer page
  - Shows error messages for invalid credentials

### **Protected Routes**
- **Middleware**: `reqAuth` (JWT verification)
- **Implementation**:
  - Checks for JWT token in Authorization header
  - Verifies token signature and expiration
  - Attaches `userId` to request object
  - Redirects unauthenticated users to login page

### **Logout**
- **Functionality**:
  - Removes JWT token from localStorage
  - Clears authentication state
  - Redirects to login page
  - Updates App component state to trigger re-render

---

## 📄 PDF Analysis System

### **PDF Upload & Processing**
- **Endpoint**: `POST /api/analyze/pdf`
- **File Upload**:
  - Uses `multer` middleware for file handling
  - Memory storage (no temporary files on disk)
  - File size limit: 10 MB
  - Accepts only PDF files (`application/pdf`)

### **Text Extraction Process**

#### **1. Primary Text Extraction**
- Uses `pdf-parse` library to extract text directly from PDF
- Handles standard PDFs with selectable text
- Extracts metadata and text content

#### **2. OCR Fallback Mechanism**
- **Trigger Conditions**:
  - If extracted text is less than 30 characters
  - If normal PDF parsing fails
  - For scanned PDFs (image-based documents)
- **Implementation**:
  - Uses `tesseract.js` for Optical Character Recognition
  - Processes PDF buffer as image
  - Extracts text from scanned documents
  - Falls back to OCR if primary extraction fails

#### **3. Text Validation**
- Ensures minimum text length (10 characters)
- Returns error if text extraction fails completely
- Handles edge cases (empty PDFs, corrupted files)

### **Data Extraction**
- **Email Extraction**:
  - Uses regex pattern: `/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g`
  - Extracts first email address found in document
- **Company Name Extraction**:
  - Pattern matching for common phrases:
    - "Company:", "Organization:", "Employer:", "Corporation:"
    - "at [Company]", "from [Company]", "with [Company]"
  - Handles company suffixes (Inc, LLC, Ltd, Corp)

### **AI-Powered Analysis**

#### **Prompt Engineering**
- **Model**: Groq API (Llama 3.1 8B Instant)
- **Temperature**: 0 (deterministic responses)
- **Max Tokens**: 800
- **Prompt Structure**:
  - Instructions for JSON-only response
  - Analysis criteria for scam detection
  - Red flag indicators (money requests, generic emails, WhatsApp-only recruitment)
  - Verdict classification system

#### **Analysis Output**
The AI returns a JSON object with:
```json
{
  "scam_probability": 0-100,
  "verdict": "safe" | "suspicious" | "scam",
  "red_flags": ["array of warning phrases"],
  "suspicious_phrases": ["array of suspicious text found"],
  "summary": "one or two sentence explanation"
}
```

#### **Error Handling**
- Logs raw model output if JSON parsing fails
- Extracts JSON substring from response (handles markdown formatting)
- Validates JSON structure before processing
- Returns detailed error messages for debugging

### **Database Storage**
- **Model**: `Report` schema
- **Fields Stored**:
  - `source`: "pdf" (default)
  - `originalTextSnippet`: First 1500 characters of extracted text
  - `hrEmail`: Extracted email address
  - `company`: Extracted company name
  - `scam_probability`: 0-100 score
  - `verdict`: "safe", "suspicious", or "scam"
  - `red_flags`: Array of red flag strings
  - `suspicious_phrases`: Array of suspicious phrases
  - `summary`: AI-generated summary
  - `createdAt`, `updatedAt`: Automatic timestamps

---

## 🎨 Frontend Features

### **1. Analyzer Page (`/analyze`)**

#### **Navigation Bar**
- Application title: "🛡️ Fake Job Scam Analyzer"
- "View Dashboard" button (only visible after analysis)
- Logout button

#### **Hero Section**
- Welcome message
- Description of functionality
- Instructions for users

#### **PDF Upload Component**
- **File Selection**:
  - Drag-and-drop style file input
  - Accepts only PDF files
  - Shows selected file name
  - Visual feedback on hover
- **Upload Button**:
  - Disabled when no file selected
  - Loading state with spinner animation
  - Error handling with user-friendly messages
  - Sends file to backend API

#### **Results Display**
- **Verdict Card**:
  - Color-coded based on verdict:
    - 🔴 Red: Scam
    - 🟡 Yellow: Suspicious
    - 🟢 Green: Safe
  - Displays verdict and scam probability percentage
  - Large, prominent display

- **Red Flags Section**:
  - Lists all detected red flags
  - Red color scheme for warnings
  - Shows "No red flags found" if none detected

- **Suspicious Phrases Section**:
  - Lists phrases that triggered suspicion
  - Yellow color scheme
  - Shows "No suspicious phrases detected" if none found

- **Summary Section**:
  - AI-generated explanation
  - Blue color scheme
  - One or two sentence overview

### **2. Dashboard Page (`/dashboard`)**

#### **Statistics Overview**
- **Pie Chart**:
  - Visual representation of scam statistics
  - Three categories: Scam, Suspicious, Safe
  - Color-coded segments:
    - Red: Scam
    - Yellow: Suspicious
    - Green: Safe
  - Interactive tooltips with percentages
  - Summary cards showing counts for each category

#### **Reports Table**
- **Columns**:
  - Date: Formatted timestamp of analysis
  - Email: HR email from document (or "—" if not found)
  - Company: Company name (or "—" if not found)
  - Score: Scam probability percentage
  - Verdict: Color-coded badge (scam/suspicious/safe)

- **Features**:
  - Clickable rows to view detailed report
  - Hover effects for better UX
  - Empty state message when no reports exist
  - Responsive design for mobile devices

#### **Report Modal**
- **Triggered by**: Clicking a row in the reports table
- **Content**:
  - Full verdict and probability display
  - Complete list of red flags
  - All suspicious phrases
  - Detailed summary
  - Contact information (email and company)
  - Extracted text snippet (first 1500 characters)
- **UI**:
  - Dark theme modal overlay
  - Close button (X) in top-right corner
  - Scrollable content for long reports
  - Click outside to close

### **3. Login Page (`/login`)**
- **Form Fields**:
  - Email input (with validation)
  - Password input (masked)
- **Features**:
  - Enter key support for form submission
  - Loading state during authentication
  - Error message display
  - Link to signup page
  - Auto-redirect if already logged in

### **4. Signup Page (`/signup`)**
- **Form Fields**:
  - Email input
  - Password input
  - Confirm password input
- **Validation**:
  - All fields required
  - Password must match confirmation
  - Minimum password length: 6 characters
  - Email format validation
- **Features**:
  - Auto-login after successful registration
  - Success message before redirect
  - Error handling for duplicate emails
  - Link to login page
  - Enter key support

---

## 🔄 Routing & Navigation

### **Route Structure**
- `/` → Redirects to `/login` (if not authenticated) or `/analyze` (if authenticated)
- `/login` → Login page (redirects to `/analyze` if already logged in)
- `/signup` → Registration page (redirects to `/analyze` if already logged in)
- `/analyze` → PDF analyzer page (protected route)
- `/dashboard` → Statistics and reports dashboard (protected route)

### **Protected Routes**
- Uses `ProtectedRoute` component wrapper
- Checks for JWT token in localStorage
- Redirects to `/login` if not authenticated
- Prevents access to analyzer and dashboard without login

---

## 📊 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### **PDF Analysis**
- `POST /api/analyze/pdf` - Upload and analyze PDF file
  - **Request**: `multipart/form-data` with `file` field
  - **Response**: Analysis result JSON

### **Reports**
- `GET /api/reports/stats` - Get statistics (scam, suspicious, safe counts)
- `GET /api/reports` - Get all reports (if implemented)

---

## 🎨 UI/UX Features

### **Design System**
- **Theme**: Dark mode throughout
- **Color Palette**:
  - Primary: Blue to Purple gradient
  - Success: Green shades
  - Warning: Yellow shades
  - Danger: Red shades
  - Background: Gray-900 to Gray-800 gradient

### **Interactive Elements**
- Hover effects on buttons and links
- Scale transforms on button hover
- Smooth transitions and animations
- Loading spinners for async operations
- Color-coded verdict badges
- Gradient backgrounds for visual appeal

### **Responsive Design**
- Mobile-friendly layouts
- Flexible grid systems
- Responsive tables with horizontal scroll
- Adaptive modal sizes
- Touch-friendly button sizes

---

## 🔒 Security Features

### **Password Security**
- Bcrypt hashing (10 salt rounds)
- No plain text password storage
- Password length validation

### **Authentication**
- JWT token-based authentication
- Token expiration (1 day)
- Secure token storage in localStorage
- Protected API routes

### **File Upload Security**
- File type validation (PDF only)
- File size limits (10 MB)
- Memory storage (no file system access)
- Input sanitization

---

## 📈 Data Flow

### **PDF Analysis Flow**
1. User selects PDF file
2. Frontend sends file to `/api/analyze/pdf`
3. Backend extracts text (with OCR fallback)
4. Backend extracts email and company name
5. Backend sends text to AI model (Groq)
6. AI returns analysis JSON
7. Backend saves report to database
8. Backend returns analysis to frontend
9. Frontend displays results

### **Dashboard Flow**
1. User navigates to `/dashboard`
2. Frontend fetches reports from API
3. Frontend fetches statistics from API
4. Frontend renders pie chart with stats
5. Frontend renders reports table
6. User clicks report row
7. Frontend opens modal with detailed report

---

## 🛠️ Error Handling

### **Frontend Error Handling**
- Network error messages
- Validation error display
- Loading states for async operations
- Empty state messages
- User-friendly error messages

### **Backend Error Handling**
- Try-catch blocks for all async operations
- Detailed error logging
- HTTP status codes (400, 401, 403, 500)
- JSON error responses
- Raw output logging for AI parsing failures

---

## 📦 Key Dependencies

### **Backend**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `multer` - File upload handling
- `pdf-parse` - PDF text extraction
- `tesseract.js` - OCR functionality
- `groq` - AI model API client
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### **Frontend**
- `react` - UI library
- `react-router-dom` - Client-side routing
- `axios` - HTTP client
- `react-chartjs-2` - Chart components
- `chart.js` - Chart library
- `tailwindcss` - CSS framework

---

## 🚀 Deployment Considerations

### **Environment Variables**
- `JWT_SECRET` - Secret key for JWT tokens
- `MONGODB_URI` - MongoDB connection string
- `GROQ_API_KEY` - Groq API key for AI analysis
- `PORT` - Server port (default: 5000)

### **Production Optimizations**
- Error logging and monitoring
- Rate limiting for API endpoints
- File size and type validation
- CORS configuration for production domains
- Database connection pooling
- Token refresh mechanism

---

## 📝 Future Enhancements

### **Potential Features**
- User-specific report filtering
- Report export (PDF/CSV)
- Email notifications for high-risk scams
- Batch PDF processing
- Historical trend analysis
- Company verification database
- User feedback system
- Report sharing functionality
- Advanced filtering and search
- Multi-language support

---

## 🎯 Use Cases

1. **Job Seekers**: Verify legitimacy of job offers before responding
2. **Recruiters**: Validate their own offer letters for compliance
3. **HR Departments**: Screen incoming job offer documents
4. **Security Teams**: Identify phishing and scam patterns
5. **Educational Institutions**: Teach students about job scam detection

---

This comprehensive functionality documentation covers all aspects of the Fake Job Scam Analyzer application, from authentication to AI-powered analysis and data visualization.

