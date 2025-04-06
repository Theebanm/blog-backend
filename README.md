backend-blogapp
NODE JS ,EXPRESS,MONGODB --> Blog Backend

📝 Blog App Backend
This is the backend for a fully functional Blog Application, built with a RESTful architecture. It supports full CRUD operations for blog posts, user authentication, and more. Perfect foundation for a modern blogging platform.

🚀 Features
🔐 User Authentication (JWT-based)
🧾 Create, Read, Update, Delete Blog Posts
👤 User Registration & Login
🔒 Password Encryption
📅 Post Timestamps
📂 Organized Folder Structure
🧪 Tested APIs (Postman or similar)


🛠️ Tech Stack
Node.js
Express.js
MongoDB + Mongoose
JWT (JSON Web Tokens)
bcrypt.js (Password Hashing)
dotenv (Environment Variables)
CORS (Cross-Origin Requests)
Multer / Cloudinary (optional for image upload)



📂 Project Structure
backend/ 
├── config/ 
│ └── db.js 
├── controllers/ 
│ ├── authController.js 
│ └── postController.js 
├── middlewares/ 
│ ├── authMiddleware.js 
│ └── errorHandler.js 
├── models/ 
│ ├── User.js 
│ └── Post.js 
├── routes/ 
│ ├── authRoutes.js 
│ └── postRoutes.js 
├── .env 
├── server.js 
└── package.json



⚙️ Installation

Clone the repository:

git clone https://github.com/yourusername/blog-app-backend.git cd blog-app-backend 2.install dependancy npm install

3. ENV FILES
//ENV PORT = 8393 
// MONGO_URI = mongi url
// NODE_ENV=development
// JWT_SECRET = your secret
// EMAIL_PASSWORD= generate your own password from https://myaccount.google.com/apppasswords
// SENDER_EMAIL=your email id from which you want to send email
// CLOUDINARY_API_KEY=cloudinary api key
// CLOUDINARY_API_SECRET=cloudinary api secret
// CLOUDINARY_CLOUD_NAME=cloudinary cloud name

4. Run server
  npm run dev


5.Routes

🔐 Auth Routes
  Method Endpoint Description Access
  POST /api/auth/register Register a new user Public  
  POST /api/auth/login Login and get JWT token Public
  GET /api/auth/profile Get logged-in user's profile Private


🗂️ Category Routes

Method Endpoint Description Access

POST /api/categories/ Add a new category Admin Only PUT /api/categories/:id Update a category Admin Only GET /api/categories/:id Get category by ID Authenticated GET /api/categories/ Get all categories Authenticated DELETE /api/categories/:id Delete a category Admin Only



📁 File Routes

Method Endpoint Description Access

POST /api/files/upload Upload a single image Authenticated DELETE /api/files/delete-file Delete uploaded file Authenticated 🔸 File upload expects a multipart/form-data request with a field named image.

📝 Post Routes

Method Endpoint Description Access

POST /api/posts/ Create a new post Authenticated 
GET /api/posts/ Get all posts Authenticated 
GET /api/posts/:id Get post by ID Authenticated 
PUT /api/posts/:id Update post by ID Authenticated 
DELETE /api/posts/:id Delete post by ID Authenticated

✅ Future Improvements Comments & Likes system

Email Notifications (e.g., on comment)

📑 License This project is licensed under the MIT License.
