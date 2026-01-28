# Next Steps CV Builder

A comprehensive, multi-step CV building application designed for medical professionals. This platform allows users to build highly detailed CVs, preview them in real-time, and download them as professional PDFs.

---

## 🚀 Overview

The Next Steps CV Builder is a full-stack application composed of a **React-based frontend** and a **Node.js/Express backend**. It features a 10-step form process that captures everything from basic details and USMLE scores to clinical experiences and publications.

### Key Features
- **Multi-step Form**: Guided process for building a complex medical CV.
- **Real-time Preview**: Adaptive preview that reflects changes as you type.
- **Draft Persistence**: Automatic local storage saving ensures no data loss on refresh.
- **PDF Generation**: High-quality, custom-styled PDFs generated on the server using `pdfkit`.
- **Document Management**: Capabilities to upload supporting certificates and documents directly to S3.
- **Responsive Design**: Fully mobile-friendly UI using TailwindCSS.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: TailwindCSS & Lucide Icons
- **State Management**: React Hooks (useState, useCallback, useEffect)
- **API Client**: Axios
- **Persistence**: Browser LocalStorage

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB with Mongoose ODM
- **PDF Generation**: PDFKit
- **File Storage**: AWS S3 & GridFS
- **Authentication**: JWT & Cookie-parser
- **Development**: Nodemon

---

## 📁 Project Structure

### Backend (`/backend`)
- `src/models/`: Mongoose schemas (notably `cv.model.js`).
- `src/controllers/`: Business logic for CV management and PDF triggers.
- `src/routes/`: API endpoint definitions.
- `src/services/generatepdf.js`: The core engine for rendering data into custom PDF layouts.
- `src/middlewares/`: Multer configurations for file handling and JWT auth.

### Frontend (`/frontend`)
- `src/pages/Dashboard/CVBuilder/`: Main CV Builder container and steps.
- `src/pages/Dashboard/CVBuilder/steps/`: Individual components for each form step (e.g., `EducationStep`, `WorkshopsStep`).
- `src/components/`: Reusable UI components and form fields.
- `src/services/api.js`: Centralized Axios instance and API calls.
- `src/utils/`: Validation rules and helpers.

---

## � Environment Variables

Create a `.env` file in the `/backend` directory and provide the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017
DB_NAME=cv_builder

# Authentication (JWT)
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# AWS S3 (For File Uploads)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_bucket_name
```

---

## �🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or Atlas)
- AWS S3 Credentials (optional for file uploads)

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file based on environment requirements (PORT, MONGO_URI, JWT_SECRET, AWS_KEYS)
npm run start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Ensure the API base URL in src/services/api.js matches your backend
npm run dev
```

### 3. Docker (Optional)
If you have Docker installed, you can spin up the entire stack using:
```bash
docker-compose up --build
```
This will start the backend on port 5000 and the frontend on port 3000.

---

## 📝 Developer Guidelines

### Adding New Fields
1. **Update Model**: Add the field to `/backend/src/models/cv.model.js`.
2. **Update UI**: Add the corresponding input to the relevant "Step" component in `/frontend/src/pages/Dashboard/CVBuilder/steps/`.
3. **Update PDF**: Add the rendering logic to `/backend/src/services/generatepdf.js`.
4. **Update Preview**: Add the field to the live preview in `/frontend/src/pages/Dashboard/CVBuilder/CVPreview.jsx`.

### State Management
The `CVBuilder.jsx` component acts as the single source of truth for the CV data. It passes modification handlers (`onInputChange`, `onArrayUpdate`) down to child steps.

### Draft Persistence
The builder uses a `cv_draft_{userId}` key in localStorage. It prioritizes backend data if available but falls back to local drafts to prevent data loss.

---

## ⚖️ License
ISC License
