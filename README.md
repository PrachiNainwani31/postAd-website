# PostAd Website  

A full-stack web application for posting, viewing, and managing advertisements. Built using **React.js (frontend)**, **Node.js + Express.js (backend)**, **MongoDB (database)**, and **Cloudinary (image upload)**.  

---

## Features  

### Functional Requirements  
-> User Registration & Login (JWT Authentication)  
-> Ad Posting with Image Upload (Cloudinary integration)  
-> Search & Filter Ads by Category  
-> Paginated Ad Listings  
-> Admin Dashboard (for ad moderation - upcoming)  

### Non-Functional Requirements  
-> Secure File Upload (JPG, PNG, WebP)  
-> Role-Based Authentication & Authorization  
-> Mobile Responsive Layout  
-> Performance Optimization (Planned)  
-> Easy Navigation (Planned)  

---

## Tech Stack  

### Frontend  
- React.js (Vite)  
- React Router DOM  
- Axios  
- CSS  

### Backend  
- Node.js  
- Express.js  
- Multer (with Cloudinary Storage)  
- JWT for Authentication  
- MongoDB & Mongoose ORM  
- Nodemailer (for OTP-based password reset)  

### Deployment  
- **Frontend**: Vercel  
- **Backend**: Railway  
- **Database**: MongoDB Atlas  
- **Image Storage**: Cloudinary  

---

## ⚙️ Installation  

1. **Clone the repository**  
   ```bash
   git clone https://github.com/yourusername/postad-website.git
   cd postad-website
   ```
2. **Install dependencies**

   - **Frontend:**
     ```bash
     cd frontend
     npm install
     ```

   - **Backend:**
     ```bash
     cd backend
     npm install
     ```
**Create .env files**

**Backend .env**
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
FAST2SMS_API_KEY=your_fast2sms_key
JWT_SECRET=your_jwt_secret
BASE_URL=https://your-backend-url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
**Frontend .env**
```env
VITE_API_URL=https://your-backend-url/api
```
###Run the app locally

**Start backend:**

```bash
cd backend
npm run dev
```
**Start frontend:**

```bash
cd frontend
npm run dev
```
### Deployment
- Frontend is deployed on Vercel.
- Backend is deployed on Railway.
- Images are uploaded to Cloudinary.


markdown
![Homepage](screenshots/Homepage.png)
![Login Page](screenshots/login.png)
![Register Page](screenshots/register.png)
![Post Ad Page](screenshots/post-ad.png)
![Search & Filter](screenshots/search-filter.png)
![Ad Details](screenshots/ad-details.png)
![Postman API Test](screenshots/postman-test.png)
### Future Improvements
- Add breadcrumbs and advanced navigation.
- Improve UI for mobile responsiveness.
- Implement performance optimizations.


