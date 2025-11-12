# Quick Start Guide - Custom Version Control System

## 🚀 Getting Started in 5 Minutes

### 1. Initialize a Repository
```bash
cd your-project-folder
node path/to/backend/index.js init
```

### 2. Create Your First Commit
```bash
# Create a test file
echo "Hello World" > test.txt

# Stage the file
node path/to/backend/index.js add test.txt

# Commit the changes
node path/to/backend/index.js commit "Initial commit"
```

### 3. Check Status
```bash
node path/to/backend/index.js status
```

### 4. View History
```bash
node path/to/backend/index.js log
```

## 📋 Most Common Commands

### Daily Workflow
```bash
# Check what changed
node index.js status

# Stage files
node index.js add myfile.txt

# Commit changes
node index.js commit "Fixed bug in authentication"

# View history
node index.js log-oneline
```

### Working with Branches
```bash
# Create a new feature branch
node index.js branch create feature-login

# Switch to it
node index.js branch switch feature-login

# Make changes, commit them...

# Switch back to master
node index.js branch switch master

# Merge the feature
node index.js merge feature-login
```

### Saving Work Temporarily
```bash
# Stash current changes
node index.js stash "WIP: working on feature"

# Do something else...

# Restore stashed work
node index.js stash-pop 0
```

### Remote Operations
```bash
# Push to cloud (S3)
node index.js push

# Pull from cloud
node index.js pull

# Clone a repository
node index.js clone my-repo-name
```

## 🎯 Common Scenarios

### Scenario 1: Start a New Feature
```bash
node index.js branch create feature-new-ui
node index.js branch switch feature-new-ui
# Make your changes...
node index.js add .
node index.js commit "Added new UI components"
```

### Scenario 2: Save Work and Switch Context
```bash
# You're working on something but need to fix a bug
node index.js stash "Half-done feature"
node index.js branch switch master
# Fix the bug...
node index.js branch switch feature-branch
node index.js stash-pop 0
```

### Scenario 3: Compare Changes
```bash
# See what you changed
node index.js diff

# See what's staged
node index.js diff-staged
```

### Scenario 4: Tag a Release
```bash
node index.js tag create v1.0.0 "First stable release"
node index.js tag list
```

### Scenario 5: Undo Changes
```bash
# Get commit ID from log
node index.js log-oneline

# Revert to that commit
node index.js revert <commit-id>
```

## 🔧 Setup for Easy Use

### Create an Alias (Optional)
Instead of typing `node path/to/backend/index.js` every time:

**Windows (PowerShell):**
```powershell
function customgit { node C:\path\to\backend\index.js $args }
```

**Linux/Mac (Bash):**
```bash
alias customgit='node /path/to/backend/index.js'
```

Then you can use:
```bash
customgit init
customgit add myfile.txt
customgit commit "My changes"
```

## 📝 .customignore File

Create a `.customignore` file to exclude files:
```bash
node index.js ignore-init
```

Edit `.customignore` to add patterns:
```
node_modules/
*.log
.env
dist/
```

## 🌐 Web Interface

### Start the Application
```bash
# Terminal 1 - Backend
cd backend
node index.js start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open browser to `http://localhost:5173` (or the port shown)

## 💡 Tips

1. **Always check status** before committing: `node index.js status`
2. **Use meaningful commit messages**: Describe what changed and why
3. **Create branches** for new features: Keep master stable
4. **Commit often**: Small, focused commits are better than large ones
5. **Use tags** for releases: Easy to find important versions
6. **Stash before switching**: Don't lose uncommitted work

## 🆘 Troubleshooting

### "Repository not initialized"
```bash
node index.js init
```

### "Nothing to commit"
```bash
# Stage files first
node index.js add <filename>
```

### "Branch doesn't exist"
```bash
# List all branches
node index.js branch list
```

### See all available commands
```bash
node index.js --help
```

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore all commands with `node index.js --help`
- Set up AWS S3 for remote storage (see README)
- Try the web interface for visual repository management
