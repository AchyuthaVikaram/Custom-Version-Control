# Custom Version Control System - Demo Guide

## 🚀 Complete Production-Ready Git & GitHub Replica

This is a **full-featured version control system** that replicates Git functionality with a modern GitHub-inspired web interface.

---

## 📋 Table of Contents
1. [Features Overview](#features-overview)
2. [System Requirements](#system-requirements)
3. [Installation & Setup](#installation--setup)
4. [Running the Application](#running-the-application)
5. [Demo Walkthrough](#demo-walkthrough)
6. [CLI Commands](#cli-commands)
7. [Web Interface Guide](#web-interface-guide)
8. [Architecture](#architecture)
9. [Presentation Points](#presentation-points)

---

## 🎯 Features Overview

### **Core Version Control (Git Replica)**
✅ Repository initialization and management  
✅ File staging and commit snapshots  
✅ Branch management (create, switch, delete, list)  
✅ Merge operations with conflict detection  
✅ Commit history and logs  
✅ Diff comparison (working directory vs commits)  
✅ Tag management for releases  
✅ Stash functionality for WIP  
✅ Remote operations (push/pull/clone via AWS S3)  
✅ .customignore file support  

### **Web Interface (GitHub Replica)**
✅ Modern GitHub-inspired dark theme UI  
✅ User authentication & authorization  
✅ Repository browsing and management  
✅ Issue tracking system  
✅ Real-time activity feed  
✅ Branch visualization  
✅ Commit history viewer  
✅ Tag management interface  
✅ Responsive design  

### **Backend API**
✅ RESTful API with 20+ endpoints  
✅ JWT authentication  
✅ MongoDB database integration  
✅ AWS S3 cloud storage  
✅ WebSocket support  

---

## 💻 System Requirements

- **Node.js**: v14.0 or higher
- **MongoDB**: v4.0 or higher (local or cloud)
- **npm**: v6.0 or higher
- **AWS Account**: (Optional, for remote storage)
- **Modern Browser**: Chrome, Firefox, Edge, or Safari

---

## 📦 Installation & Setup

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/AchyuthaVikaram/Custom-Version-Control.git
cd Custom-Version-Control
```

### **Step 2: Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
PORT=3000
MONGODB_URL=mongodb://localhost:27017/customvcs
JWT_SECRET_KEY=your_secret_key_here
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name
```

### **Step 3: Frontend Setup**
```bash
cd ../frontend
npm install
```

### **Step 4: Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URL in .env with your Atlas connection string
```

---

## 🎬 Running the Application

### **Terminal 1: Start Backend Server**
```bash
cd backend
node index.js start
```
Expected output:
```
MongoDB Connected
server is running on 3000
```

### **Terminal 2: Start Frontend Development Server**
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

### **Access the Application**
Open your browser and navigate to: `http://localhost:5173`

---

## 🎭 Demo Walkthrough

### **1. User Registration & Login**
1. Navigate to `http://localhost:5173/auth`
2. Click "Sign Up" to create a new account
3. Enter credentials and register
4. Login with your credentials

### **2. Dashboard Overview**
- View your repositories
- See recent activity
- Browse suggested repositories
- Search for repositories

### **3. Create a New Repository**
1. Click "New" button in navbar
2. Fill in repository details:
   - Name
   - Description
   - Visibility (Public/Private)
3. Click "Create Repository"

### **4. Repository Management**
1. Click on any repository
2. View repository details
3. Access tabs:
   - **Overview**: Repository information
   - **Issues**: Track bugs and features
   - **Version Control**: Git operations

### **5. Version Control Operations**

#### **Using Web UI:**
1. Go to repository → Click "Version Control"
2. **Branches Tab**:
   - View all branches
   - Create new branch
   - Switch between branches
   - Delete branches
3. **Commits Tab**:
   - View commit history
   - See commit details
   - View files in each commit
4. **Tags Tab**:
   - Create release tags
   - View tag details
   - Delete tags

#### **Using CLI:**
```bash
cd backend

# Initialize repository
node index.js init

# Create and add files
echo "Hello World" > test.txt
node index.js add test.txt

# Commit changes
node index.js commit "Initial commit"

# Create branch
node index.js branch create feature-auth

# Switch to branch
node index.js branch switch feature-auth

# View status
node index.js status

# View commit history
node index.js log

# Create tag
node index.js tag create v1.0.0 "First release"

# Stash changes
node index.js stash "Work in progress"

# View all commands
node index.js --help
```

### **6. Issue Tracking**
1. Go to repository → Issues tab
2. Create new issue
3. Assign to team members
4. Add labels and priorities
5. Track progress

---

## 📚 CLI Commands Reference

### **Repository Management**
```bash
node index.js init                    # Initialize repository
node index.js status                  # Show status
```

### **File Operations**
```bash
node index.js add <file>              # Stage file
node index.js commit "message"        # Create commit
```

### **Branch Management**
```bash
node index.js branch list             # List branches
node index.js branch create <name>    # Create branch
node index.js branch switch <name>    # Switch branch
node index.js branch delete <name>    # Delete branch
```

### **History & Inspection**
```bash
node index.js log                     # View commit history
node index.js log 10                  # Last 10 commits
node index.js log-oneline             # Compact view
node index.js diff                    # Show differences
node index.js diff-staged             # Staged differences
```

### **Merge Operations**
```bash
node index.js merge <branch>          # Merge branch
node index.js merge-abort             # Abort merge
```

### **Remote Operations**
```bash
node index.js push                    # Push to S3
node index.js pull                    # Pull from S3
node index.js clone <repo> [dir]      # Clone repository
```

### **Stash Operations**
```bash
node index.js stash "message"         # Stash changes
node index.js stash-list              # List stashes
node index.js stash-apply 0           # Apply stash
node index.js stash-pop 0             # Pop stash
node index.js stash-clear             # Clear all
```

### **Tag Management**
```bash
node index.js tag create <name>       # Create tag
node index.js tag list                # List tags
node index.js tag show <name>         # Show tag
node index.js tag delete <name>       # Delete tag
```

---

## 🌐 Web Interface Guide

### **Navigation**
- **Dashboard**: Home page with repository overview
- **Repositories**: Browse all your repositories
- **Explore**: Discover public repositories
- **Profile**: User profile and settings

### **Repository Features**
- **Overview Tab**: Repository information and content
- **Issues Tab**: Bug tracking and feature requests
- **Version Control Tab**: Git operations interface

### **Version Control Interface**
- **Branches**: Visual branch management
- **Commits**: Interactive commit history
- **Tags**: Release tag management

---

## 🏗️ Architecture

### **Technology Stack**

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- AWS S3 for storage
- JWT authentication
- Socket.io for real-time

**Frontend:**
- React + Vite
- React Router
- Axios for API calls
- React Icons
- Modern CSS

**CLI:**
- Yargs for argument parsing
- Node.js file system APIs
- UUID for commit IDs

### **Directory Structure**
```
Custom-Version-Control/
├── backend/
│   ├── controllers/      # Business logic
│   ├── models/          # Database schemas
│   ├── routers/         # API routes
│   ├── middlewares/     # Auth & validation
│   └── index.js         # Main entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── utils/       # Helper functions
│   │   └── styles/      # CSS files
│   └── package.json
└── README.md
```

---

## 🎤 Presentation Points for Project Guide

### **1. Problem Statement**
"Traditional version control systems like Git are powerful but complex. We created a simplified yet feature-complete version control system with an intuitive web interface."

### **2. Key Innovations**
- **Cloud Storage**: Uses AWS S3 instead of traditional Git servers
- **Web Interface**: Modern GitHub-like UI for visual operations
- **Dual Interface**: Both CLI and Web UI for flexibility
- **Educational**: Well-documented code for learning

### **3. Technical Highlights**

**Backend:**
- RESTful API with 20+ endpoints
- JWT-based authentication
- MongoDB for data persistence
- AWS S3 integration for remote storage

**Frontend:**
- Modern React with hooks
- GitHub-inspired dark theme
- Responsive design
- Real-time updates

**CLI:**
- 25+ Git-like commands
- Branch management
- Merge with conflict detection
- Stash and tag support

### **4. Features Demonstration**

**Show:**
1. User registration and login
2. Repository creation
3. Branch operations (create, switch, merge)
4. Commit history visualization
5. Issue tracking
6. Tag management
7. CLI commands in action

### **5. Use Cases**
- **Developers**: Version control for projects
- **Teams**: Collaborative development
- **Students**: Learning version control concepts
- **Organizations**: Private code hosting

### **6. Future Enhancements**
- Pull request system
- Code review features
- CI/CD integration
- Advanced merge strategies
- GitHub Actions equivalent
- Mobile application

### **7. Conclusion**
"This project demonstrates a complete understanding of:
- Version control systems
- Full-stack development
- Cloud integration
- Modern UI/UX design
- RESTful API design"

---

## 🔧 Troubleshooting

### **Backend won't start**
- Check MongoDB is running
- Verify .env file exists and is configured
- Check port 3000 is not in use

### **Frontend won't start**
- Run `npm install` in frontend directory
- Check port 5173 is not in use
- Clear npm cache: `npm cache clean --force`

### **Database connection error**
- Ensure MongoDB is running
- Check MONGODB_URL in .env
- Verify network connectivity

### **Authentication issues**
- Clear browser local storage
- Check JWT_SECRET_KEY in .env
- Verify token is being sent in headers

---

## 📞 Support

For issues or questions:
- GitHub Issues: [Create an issue](https://github.com/AchyuthaVikaram/Custom-Version-Control/issues)
- Email: your-email@example.com

---

## 📄 License

ISC License - See LICENSE file for details

---

## 👨‍💻 Author

**Achyutha Vikaram**

---

**Thank you for exploring the Custom Version Control System!** 🎉
