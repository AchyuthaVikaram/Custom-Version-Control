# 🚀 Complete Setup & Run Guide - Custom Version Control System

## ✨ Production-Ready Git & GitHub Replica

This guide will help you set up and run the complete Custom Version Control System with modern UI.

---

## 📋 What You Have

### **Backend Features**
✅ 25+ CLI commands (Git replica)  
✅ 20+ REST API endpoints  
✅ JWT authentication  
✅ MongoDB integration  
✅ AWS S3 cloud storage  
✅ Branch, merge, commit, tag, stash operations  
✅ Conflict detection  
✅ Issue tracking  

### **Frontend Features**
✅ Modern GitHub-inspired dark theme UI  
✅ Dashboard with repository cards  
✅ Repository detail page with file browser  
✅ Version control interface (branches, commits, tags)  
✅ Issue tracking system  
✅ Activity feed  
✅ Responsive design  
✅ Mock data for demo  

---

## 🛠️ Prerequisites

Ensure you have installed:
- **Node.js** v14+ ([Download](https://nodejs.org/))
- **MongoDB** v4+ ([Download](https://www.mongodb.com/try/download/community))
- **npm** v6+ (comes with Node.js)
- **Git** (for version control)

---

## 📦 Installation Steps

### **Step 1: Navigate to Project**
```bash
cd Custom-Version-Control
```

### **Step 2: Install Backend Dependencies**
```bash
cd backend
npm install
```

Expected packages:
- express
- mongoose
- jsonwebtoken
- bcrypt
- aws-sdk
- socket.io
- yargs
- uuid
- dotenv
- cors

### **Step 3: Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

Expected packages:
- react
- react-dom
- react-router-dom
- axios
- react-icons
- vite

### **Step 4: Configure Environment Variables**

Create `backend/.env` file:
```env
PORT=3000
MONGODB_URL=mongodb://localhost:27017/customvcs
JWT_SECRET_KEY=your_super_secret_jwt_key_here_change_this
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET=your-s3-bucket-name
```

**Note:** AWS credentials are optional. The system works without them, but push/pull/clone won't work.

---

## 🎬 Running the Application

### **Method 1: Using Two Terminals (Recommended)**

**Terminal 1 - Backend:**
```bash
cd backend
node index.js start
```

Expected output:
```
MongoDB Connected
server is running on 3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### **Method 2: Using npm scripts (Alternative)**

Add to `package.json` in root:
```json
{
  "scripts": {
    "start:backend": "cd backend && node index.js start",
    "start:frontend": "cd frontend && npm run dev",
    "dev": "concurrently \"npm run start:backend\" \"npm run start:frontend\""
  }
}
```

Then run:
```bash
npm run dev
```

---

## 🌐 Access the Application

1. **Open Browser:** Navigate to `http://localhost:5173`
2. **Sign Up:** Create a new account
3. **Login:** Use your credentials
4. **Explore:** Dashboard, repositories, version control

---

## 🎭 Demo Walkthrough

### **1. First Time Setup**
```bash
# Start MongoDB (if not running)
mongod

# Start backend
cd backend
node index.js start

# Start frontend (new terminal)
cd frontend
npm run dev
```

### **2. Web Interface Demo**

**A. User Registration**
- Go to `http://localhost:5173/auth`
- Click "Sign Up"
- Enter: username, email, password
- Click "Create Account"

**B. Dashboard**
- View repository cards with stats
- See activity feed
- Browse trending repositories
- Quick stats sidebar

**C. Create Repository**
- Click "New" button in navbar
- Fill in:
  - Repository name
  - Description
  - Visibility (Public/Private)
- Click "Create Repository"

**D. Repository View**
- Click on any repository
- Explore tabs:
  - **Code:** File browser, README
  - **Issues:** Bug tracking
  - **Commits:** History
  - **Version Control:** Git operations

**E. Version Control**
- Click "Version Control" tab
- **Branches:** Create, switch, delete
- **Commits:** View history with details
- **Tags:** Create release tags

### **3. CLI Demo**

```bash
cd backend

# Initialize a repository
node index.js init

# Create a file
echo "# My Project" > README.md

# Stage the file
node index.js add README.md

# Commit
node index.js commit "Initial commit"

# Create a branch
node index.js branch create feature-auth

# Switch to branch
node index.js branch switch feature-auth

# Make changes
echo "## Features" >> README.md
node index.js add README.md
node index.js commit "Add features section"

# View log
node index.js log

# Switch back to main
node index.js branch switch master

# Merge
node index.js merge feature-auth

# Create tag
node index.js tag create v1.0.0 "First release"

# View all commands
node index.js --help
```

---

## 🎤 Presentation Guide for Project Guide

### **Opening (2 minutes)**
"Good [morning/afternoon], I'm presenting the Custom Version Control System - a production-ready replica of Git and GitHub built from scratch."

### **Problem Statement (1 minute)**
"Version control is essential for software development, but existing systems can be complex. We created a simplified yet feature-complete system with both CLI and modern web interface."

### **Architecture Overview (3 minutes)**

**Show diagram/explain:**
```
Frontend (React)
    ↓ REST API
Backend (Node.js + Express)
    ↓
MongoDB (Data) + AWS S3 (Storage)
```

**Key Technologies:**
- Backend: Node.js, Express, MongoDB, AWS S3
- Frontend: React, Vite, Modern CSS
- CLI: Yargs, Node.js FS APIs

### **Live Demo (10 minutes)**

**Part 1: Web Interface (5 min)**
1. Show login/signup
2. Navigate dashboard
3. Create repository
4. Show repository detail with file browser
5. Demonstrate version control interface

**Part 2: CLI Operations (5 min)**
```bash
# Show these commands live
node index.js init
node index.js add file.txt
node index.js commit "message"
node index.js branch create feature
node index.js branch switch feature
node index.js log
node index.js merge feature
node index.js tag create v1.0.0
```

### **Features Highlight (3 minutes)**

**Backend:**
- ✅ 25+ Git commands
- ✅ Branch management with HEAD tracking
- ✅ Merge with conflict detection
- ✅ Stash, tag, diff operations
- ✅ AWS S3 integration

**Frontend:**
- ✅ GitHub-inspired UI
- ✅ Repository management
- ✅ Issue tracking
- ✅ Real-time activity feed
- ✅ Responsive design

### **Code Walkthrough (5 minutes)**

**Show key files:**
1. `backend/controllers/branch.js` - Branch logic
2. `backend/controllers/merge.js` - Merge with conflicts
3. `frontend/components/dashboard/ModernDashboard.jsx` - UI
4. `frontend/components/vcs/BranchManager.jsx` - VCS interface

### **Technical Challenges & Solutions (2 minutes)**

**Challenge 1:** Implementing merge conflict detection
**Solution:** File comparison with conflict markers

**Challenge 2:** Managing repository state
**Solution:** HEAD pointer and refs structure

**Challenge 3:** Modern UI design
**Solution:** GitHub-inspired design system with CSS variables

### **Future Enhancements (1 minute)**
- Pull request system
- Code review features
- CI/CD integration
- Mobile application
- Advanced merge strategies

### **Conclusion (1 minute)**
"This project demonstrates:
- Full-stack development
- Version control concepts
- Cloud integration
- Modern UI/UX design
- RESTful API architecture

Thank you for your time. Questions?"

---

## 📊 Project Statistics

- **Total Files:** 50+
- **Lines of Code:** ~5000+
- **CLI Commands:** 25+
- **API Endpoints:** 20+
- **React Components:** 15+
- **Features:** 30+

---

## 🐛 Troubleshooting

### **Issue: Backend won't start**
```bash
# Check MongoDB is running
mongod --version

# Check port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### **Issue: Frontend won't start**
```bash
# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules
npm install

# Check port 5173
netstat -ano | findstr :5173  # Windows
lsof -i :5173                 # Mac/Linux
```

### **Issue: MongoDB connection error**
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URL in .env
```

### **Issue: Authentication not working**
```bash
# Clear browser local storage
# In browser console:
localStorage.clear()

# Verify JWT_SECRET_KEY in .env
```

### **Issue: Mock data not showing**
```bash
# Ensure theme.css is imported
# Check frontend/src/main.jsx has:
import './styles/theme.css';
```

---

## 📁 Project Structure

```
Custom-Version-Control/
├── backend/
│   ├── controllers/         # Business logic (20+ files)
│   │   ├── init.js
│   │   ├── commit.js
│   │   ├── branch.js
│   │   ├── merge.js
│   │   ├── vcsController.js
│   │   └── ...
│   ├── models/             # Database schemas
│   ├── routers/            # API routes
│   ├── middlewares/        # Auth & validation
│   ├── config/             # AWS configuration
│   ├── .env               # Environment variables
│   └── index.js           # Main entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── ModernDashboard.jsx
│   │   │   │   └── modernDashboard.css
│   │   │   ├── repo/
│   │   │   │   ├── ModernRepoDetail.jsx
│   │   │   │   └── modernRepoDetail.css
│   │   │   ├── vcs/
│   │   │   │   ├── BranchManager.jsx
│   │   │   │   ├── CommitHistory.jsx
│   │   │   │   ├── TagManager.jsx
│   │   │   │   └── vcs.css
│   │   │   └── Navbar.jsx
│   │   ├── utils/
│   │   │   └── mockData.js
│   │   ├── styles/
│   │   │   └── theme.css
│   │   └── main.jsx
│   └── package.json
├── DEMO_GUIDE.md
├── SETUP_AND_RUN.md
├── README.md
└── package.json
```

---

## 🎯 Key Features Checklist

### **CLI Features**
- [x] Repository initialization
- [x] File staging and commits
- [x] Branch create/switch/delete/list
- [x] Merge with conflict detection
- [x] Commit history and logs
- [x] Diff comparison
- [x] Tag management
- [x] Stash operations
- [x] Remote push/pull/clone
- [x] Status tracking
- [x] .customignore support

### **Web Features**
- [x] User authentication
- [x] Modern dashboard
- [x] Repository cards
- [x] File browser
- [x] Issue tracking
- [x] Activity feed
- [x] Branch visualization
- [x] Commit history viewer
- [x] Tag management UI
- [x] Responsive design

### **Backend Features**
- [x] RESTful API
- [x] JWT authentication
- [x] MongoDB integration
- [x] AWS S3 storage
- [x] WebSocket support
- [x] Error handling
- [x] Input validation

---

## 📞 Support & Resources

- **Documentation:** See README.md and DEMO_GUIDE.md
- **GitHub:** [Repository Link](https://github.com/AchyuthaVikaram/Custom-Version-Control)
- **Issues:** Report bugs via GitHub Issues

---

## 🎓 Learning Resources

To understand the codebase:
1. Start with `backend/index.js` - Entry point
2. Review `backend/controllers/` - Core logic
3. Explore `frontend/src/components/` - UI components
4. Check `utils/mockData.js` - Demo data

---

## ✅ Pre-Presentation Checklist

- [ ] MongoDB is running
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can create account and login
- [ ] Can create repository
- [ ] Can view repository details
- [ ] Version control tab works
- [ ] CLI commands work
- [ ] Mock data displays correctly
- [ ] UI looks modern and responsive

---

## 🎉 You're Ready!

Your Custom Version Control System is now fully set up and ready for demonstration. Good luck with your presentation!

**Remember:**
- Test everything before presenting
- Have backup slides ready
- Prepare for questions about architecture
- Demonstrate both CLI and Web UI
- Highlight unique features

---

**Author:** Achyutha Vikaram  
**License:** ISC  
**Version:** 1.0.0
