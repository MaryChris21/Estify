
# Estify

<!-- This line was added for demo pull request -->
### Demo Feature 2
This is a second test change for GitHub pull request demonstration.

### Demo Feature 3

🏡 Estify – Real Estate Booking Platform
Estify is a full-stack MERN application for browsing, filtering, and booking real estate properties. It includes user and agent roles, admin approvals, rent-based bookings, and a secure JWT-based authentication system.

🚀 Features
🔐 User & Agent Authentication (JWT-based)

🏘️ Agents can:

Submit, update, and delete properties (pending admin approval)

👥 Users can:

Browse approved properties
Filter by district & price
Book rental properties with a date range

🧑‍💼 Admins can:

Approve/reject property submissions and update/delete requests
📅 Bookings include conflict-checking to avoid overlaps
🌍 Fully responsive frontend using TailwindCSS + Framer Motion
📦 Secure backend with Express, MongoDB, and Mongoose

📂 Project Structure
/backend
  ├── controllers/
  ├── models/
  ├── routes/
  ├── middleware/
  ├── utils/
  ├── uploads/
  └── server.js

/frontend
  ├── src/
      ├── Components/
      ├── pages/
      ├── constants/
      ├── App.jsx
      └── main.jsx
      
🛠️ Tech Stack
Frontend: React.js, TailwindCSS, Framer Motion, Axios, React Router
Backend: Node.js, Express.js, MongoDB, Mongoose
Authentication: JWT (localStorage-based)

Other Libraries:
react-datepicker for booking
fontawesome for icons

⚙️ Setup Instructions

🔧 Backend
cd backend
npm install

Create a .env file:
env - 
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173

bash - 
npm run dev

🌐 Frontend
cd frontend
npm install
npm run dev

Runs on http://localhost:5173

👨‍💻 Contributors
IT22166838 - M. C. GUNAWARDENA
IT22626424 - R. D. S. S. MADUSHANKA
IT22105684 - S. K.T. M. N. S. JAYATHILAKA
IT22278012 - T. T. THILAKARATHNA

📄 License
This project is developed for educational purposes under the IT3040 module. All rights reserved by Team WD-25.

