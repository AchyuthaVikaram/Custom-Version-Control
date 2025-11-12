# Custom Version Control System

A full-featured version control system that replicates Git functionality with cloud storage support via AWS S3.

## Features

### Core Version Control
- **Repository Management**: Initialize and manage local repositories
- **Staging & Commits**: Stage files and create commit snapshots
- **Branching**: Create, switch, list, and delete branches
- **Merging**: Merge branches with automatic conflict detection
- **History**: View commit history with detailed logs
- **Diff**: Compare changes between commits and working directory
- **Revert**: Restore to any previous commit

### Advanced Features
- **Remote Storage**: Push/pull commits to/from AWS S3
- **Clone**: Clone repositories from remote storage
- **Stash**: Save work in progress temporarily
- **Tags**: Mark important commits (releases, milestones)
- **Ignore Files**: `.customignore` support (like `.gitignore`)

### Web Interface
- User authentication and authorization
- Repository management UI
- Issue tracking system
- Real-time updates via WebSocket

## Installation

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Environment Configuration
Create a `.env` file in the backend directory:
```
PORT=3000
MONGODB_URL=your_mongodb_connection_string
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET=your_s3_bucket_name
JWT_SECRET=your_jwt_secret
```

## Command Line Usage

### Basic Commands

#### Initialize a Repository
```bash
node index.js init
```

#### Stage Files
```bash
node index.js add <filename>
```

#### Commit Changes
```bash
node index.js commit "Your commit message"
```

#### View Status
```bash
node index.js status
```

#### View Commit History
```bash
node index.js log
node index.js log 5          # Show last 5 commits
node index.js log-oneline    # Compact view
```

### Branch Management

#### Create a Branch
```bash
node index.js branch create <branch-name>
```

#### Switch to a Branch
```bash
node index.js branch switch <branch-name>
```

#### List All Branches
```bash
node index.js branch list
```

#### Delete a Branch
```bash
node index.js branch delete <branch-name>
```

### Merging

#### Merge a Branch
```bash
node index.js merge <branch-name>
```

#### Abort a Merge
```bash
node index.js merge-abort
```

### Comparing Changes

#### Show Differences
```bash
node index.js diff              # All files
node index.js diff <filename>   # Specific file
node index.js diff-staged       # Staged files
```

### Remote Operations

#### Push to Remote
```bash
node index.js push
```

#### Pull from Remote
```bash
node index.js pull
```

#### Clone a Repository
```bash
node index.js clone <repo-name> [target-directory]
```

### Stash Operations

#### Stash Changes
```bash
node index.js stash "Work in progress"
```

#### List Stashes
```bash
node index.js stash-list
```

#### Apply a Stash
```bash
node index.js stash-apply 0    # Apply most recent
```

#### Pop a Stash
```bash
node index.js stash-pop 0      # Apply and remove
```

#### Clear All Stashes
```bash
node index.js stash-clear
```

### Tag Management

#### Create a Tag
```bash
node index.js tag create <tag-name>
node index.js tag create <tag-name> <commit-id> "Tag message"
```

#### List Tags
```bash
node index.js tag list
```

#### Show Tag Details
```bash
node index.js tag show <tag-name>
```

#### Delete a Tag
```bash
node index.js tag delete <tag-name>
```

### Other Commands

#### Revert to a Commit
```bash
node index.js revert <commit-id>
```

#### Create .customignore File
```bash
node index.js ignore-init
```

## Web Application

### Start the Server
```bash
cd backend
node index.js start
```

### Start the Frontend
```bash
cd frontend
npm run dev
```

The web interface provides:
- User registration and login
- Repository creation and management
- Browse repositories (public/private)
- Issue tracking
- Collaborative features (follow users, star repos)

## Architecture

### Backend Structure
```
backend/
├── controllers/         # Command implementations
│   ├── init.js         # Repository initialization
│   ├── add.js          # File staging
│   ├── commit.js       # Commit creation
│   ├── branch.js       # Branch management
│   ├── merge.js        # Merge operations
│   ├── status.js       # Working directory status
│   ├── log.js          # Commit history
│   ├── diff.js         # Change comparison
│   ├── push.js         # Remote push
│   ├── pull.js         # Remote pull
│   ├── clone.js        # Repository cloning
│   ├── revert.js       # Commit reversion
│   ├── stash.js        # Stash operations
│   ├── tag.js          # Tag management
│   └── ignore.js       # Ignore file handling
├── models/             # Database schemas
├── routers/            # API routes
├── middlewares/        # Auth & validation
└── config/             # AWS configuration
```

### Repository Structure
```
.customGit/
├── commits/            # All commit snapshots
│   └── <commit-id>/
│       ├── file1.txt
│       └── commit.json
├── refs/
│   ├── heads/         # Branch references
│   │   └── master
│   └── tags/          # Tag references
├── staging/           # Staged files
├── stash/            # Stashed changes
├── HEAD              # Current branch pointer
└── config.json       # Repository configuration
```

## Git Command Comparison

| Git Command | Custom VCS Command |
|-------------|-------------------|
| `git init` | `node index.js init` |
| `git add <file>` | `node index.js add <file>` |
| `git commit -m "msg"` | `node index.js commit "msg"` |
| `git status` | `node index.js status` |
| `git log` | `node index.js log` |
| `git log --oneline` | `node index.js log-oneline` |
| `git branch` | `node index.js branch list` |
| `git branch <name>` | `node index.js branch create <name>` |
| `git checkout <name>` | `node index.js branch switch <name>` |
| `git branch -d <name>` | `node index.js branch delete <name>` |
| `git merge <branch>` | `node index.js merge <branch>` |
| `git diff` | `node index.js diff` |
| `git diff --staged` | `node index.js diff-staged` |
| `git push` | `node index.js push` |
| `git pull` | `node index.js pull` |
| `git clone <repo>` | `node index.js clone <repo>` |
| `git stash` | `node index.js stash` |
| `git stash list` | `node index.js stash-list` |
| `git stash apply` | `node index.js stash-apply` |
| `git stash pop` | `node index.js stash-pop` |
| `git tag <name>` | `node index.js tag create <name>` |
| `git tag` | `node index.js tag list` |
| `git revert <commit>` | `node index.js revert <commit>` |

## Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **AWS S3** - Cloud storage
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Yargs** - CLI argument parsing

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client

## Contributing

This is a custom version control system built for educational purposes and to demonstrate Git-like functionality with cloud storage integration.

## Author

Achyutha Vikaram

## License

ISC
