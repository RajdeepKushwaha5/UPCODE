# 🚀 UPCODE - Advanced Coding Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/MongoDB-6.18.0-green?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
</div>

<p align="center">
  <strong>A comprehensive coding education platform with interactive DSA visualizations, live interviews, contest management, and AI-powered assistance.</strong>
</p>

<div align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-api-documentation">API</a> •
  <a href="#-contributing">Contributing</a>
</div>

---

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Installation](#-installation)
- [📖 Usage Guide](#-usage-guide)
- [🔌 API Documentation](#-api-documentation)
- [🗄️ Database Structure](#️-database-structure)
- [📸 Screenshots](#-screenshots)
- [⚠️ Known Issues](#️-known-issues)
- [🔮 Future Improvements](#-future-improvements)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌟 Features

### 🎯 Core Features
- **Interactive Problem Solving**: Comprehensive coding problems with multiple difficulty levels
- **Live Code Execution**: Support for Python, JavaScript, Java, and C++ with real-time testing
- **AI-Powered Assistance**: Integrated AI chatbot for coding help and explanations
- **User Authentication**: Secure OAuth integration with Google and GitHub

### 🔍 DSA Visualizer
- **Array Algorithms**: Interactive visualizations for Bubble Sort, Quick Sort, Binary Search
- **Tree Data Structures**: Binary Trees, BST, AVL Trees, Heaps with step-by-step animations
- **Graph Algorithms**: Pathfinding and traversal visualizations
- **Real-time Controls**: Play/pause, step-through, speed adjustment for all algorithms

### 🎓 Interview & Assessment
- **Live Interview System**: Real-time coding interviews with video/audio support
- **AI Interview Bot**: Automated technical interviews with instant feedback
- **Peer-Graded Reviews**: Community-driven code review system
- **Performance Analytics**: Detailed statistics and progress tracking

### 🏆 Contest Management
- **Live Contests**: Real-time competitive programming events
- **Leaderboards**: Dynamic ranking system with ELO ratings
- **Team Battles**: Collaborative coding challenges
- **Contest Analytics**: Performance metrics and insights

### 📚 Learning Resources
- **Structured Study Plans**: Curated learning paths for different skill levels
- **Course Management**: Interactive programming courses
- **Progress Tracking**: Comprehensive learning analytics
- **Community Features**: Discussion forums and knowledge sharing

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15.4.6 (React 18)
- **Styling**: TailwindCSS 3.4.17
- **UI Components**: Custom components with Radix UI primitives
- **Animations**: Framer Motion
- **Code Editor**: Monaco Editor, CodeMirror
- **Charts**: Chart.js, React Chart.js 2

### **Backend**
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB 6.18.0 with Mongoose ODM
- **Authentication**: NextAuth.js with OAuth providers
- **File Storage**: Local filesystem with upload handling
- **Real-time**: Socket.io for live features

### **External Services**
- **Code Execution**: Judge0 API integration
- **Email Service**: SendGrid for notifications
- **Payment**: Razorpay integration
- **AI Services**: Google Generative AI (Gemini)
- **Video Calls**: Jitsi Meet integration

### **DevOps & Deployment**
- **Containerization**: Docker with multi-stage builds
- **Version Control**: Git with GitHub
- **Environment**: Development, staging, and production configs
- **Process Management**: PM2 for production

## 🚀 Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (v6.0 or higher)
- **Git**
- **Docker** (optional)

### Method 1: Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/RajdeepKushwaha5/UPCODE.git
   cd UPCODE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following in `.env.local`:
   ```bash
   # Database
   MONGODB_URI=mongodb://localhost:27017/upcode
   
   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   
   # OAuth (Optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_ID=your-github-client-id
   GITHUB_SECRET=your-github-secret
   
   # Email Service
   SENDGRID_API_KEY=your-sendgrid-api-key
   
   # Payment (Optional)
   RAZORPAY_KEY_ID=your-razorpay-key
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   
   # AI Service
   GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:6.0
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Method 2: Docker Deployment

1. **Using Docker Compose**
   ```bash
   git clone https://github.com/RajdeepKushwaha5/UPCODE.git
   cd UPCODE
   
   # Configure environment variables
   cp .env.example .env.local
   
   # Build and run
   docker-compose up -d
   ```

2. **Manual Docker Build**
   ```bash
   # Build the image
   docker build -t upcode .
   
   # Run the container
   docker run -p 3000:3000 -d upcode
   ```

## 📖 Usage Guide

### Getting Started

1. **Create an Account**
   - Visit the registration page
   - Use email/password or OAuth (Google/GitHub)
   - Complete profile setup

2. **Explore DSA Visualizer**
   ```
   Navigate to: /dsa-visualizer
   - Choose algorithm category (Arrays, Trees, Graphs)
   - Interactive step-by-step visualizations
   - Adjust animation speed and controls
   ```

3. **Solve Problems**
   ```
   Navigate to: /problems-new
   - Browse by difficulty and topics
   - Use built-in code editor
   - Test with custom inputs
   - Submit for evaluation
   ```

4. **Take Interviews**
   ```
   Navigate to: /interview
   - Schedule live interviews
   - AI-powered practice sessions
   - Peer code reviews
   - Performance analytics
   ```

5. **Join Contests**
   ```
   Navigate to: /contests
   - Live competitive programming
   - Team-based challenges
   - Real-time leaderboards
   - ELO rating system
   ```

### Advanced Features

#### Custom Study Plans
```javascript
// Create personalized learning path
POST /api/study-plans
{
  "title": "Data Structures Mastery",
  "difficulty": "intermediate",
  "topics": ["arrays", "trees", "graphs"],
  "duration": "30-days"
}
```

#### AI Interview Assistant
```javascript
// Start AI-powered interview
POST /api/ai-interview/start
{
  "type": "technical",
  "level": "senior",
  "focus": ["algorithms", "system-design"]
}
```

## 🔌 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "fullName": "John Doe"
}
```

#### Login
```http
POST /api/auth/[...nextauth]
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Problem Management

#### Get All Problems
```http
GET /api/problems-new
Query Parameters:
- page: integer (default: 1)
- limit: integer (default: 20)
- difficulty: string (easy|medium|hard)
- topic: string
```

#### Submit Solution
```http
POST /api/problems-new/submit
Content-Type: application/json

{
  "problemId": "64a7c8e5f123456789abcdef",
  "code": "def solution(nums): return sum(nums)",
  "language": "python",
  "testCases": [...]
}
```

### Contest Endpoints

#### Create Contest
```http
POST /api/contest
Content-Type: application/json

{
  "title": "Weekly Contest #1",
  "description": "Beginner-friendly contest",
  "startTime": "2024-12-01T10:00:00Z",
  "duration": 120,
  "problems": ["64a7c8e5f123456789abcdef"]
}
```

#### Join Contest
```http
POST /api/contest/register
Content-Type: application/json

{
  "contestId": "64a7c8e5f123456789abcdef",
  "teamName": "CodeMasters"
}
```

### Interview System

#### Schedule Interview
```http
POST /api/interview/session
Content-Type: application/json

{
  "type": "live",
  "interviewer": "64a7c8e5f123456789abcdef",
  "scheduledTime": "2024-12-01T15:00:00Z",
  "topics": ["algorithms", "data-structures"]
}
```

#### AI Interview
```http
POST /api/ai-interview/evaluate
Content-Type: application/json

{
  "question": "Implement binary search",
  "answer": "def binary_search(arr, target): ...",
  "language": "python"
}
```

### Code Execution

#### Run Code
```http
POST /api/code/execute
Content-Type: application/json

{
  "code": "print('Hello, World!')",
  "language": "python",
  "input": ""
}
```

Response:
```json
{
  "output": "Hello, World!\n",
  "error": null,
  "executionTime": 0.045,
  "memoryUsed": 8.2
}
```

## 🗄️ Database Structure

### User Schema
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  fullName: String,
  profilePicture: String,
  role: String (user|admin),
  stats: {
    problemsSolved: Number,
    contestsParticipated: Number,
    rating: Number,
    streak: Number
  },
  preferences: {
    theme: String,
    language: String,
    notifications: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Problem Schema
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String (unique),
  description: String,
  difficulty: String (easy|medium|hard),
  topics: [String],
  constraints: String,
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: Boolean
  }],
  editorial: String,
  hints: [String],
  stats: {
    submissions: Number,
    accepted: Number,
    likes: Number
  },
  createdBy: ObjectId,
  createdAt: Date
}
```

### Contest Schema
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  type: String (individual|team),
  startTime: Date,
  endTime: Date,
  duration: Number (minutes),
  problems: [ObjectId],
  participants: [{
    user: ObjectId,
    team: String,
    joinedAt: Date
  }],
  leaderboard: [{
    user: ObjectId,
    score: Number,
    penalty: Number,
    submissions: Number
  }],
  status: String (upcoming|live|completed),
  createdBy: ObjectId
}
```

### Submission Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId,
  problem: ObjectId,
  contest: ObjectId (optional),
  code: String,
  language: String,
  status: String (pending|accepted|wrong_answer|time_limit|runtime_error),
  executionTime: Number,
  memoryUsed: Number,
  testCaseResults: [{
    passed: Boolean,
    input: String,
    output: String,
    expected: String
  }],
  submittedAt: Date
}
```

## 📸 Screenshots

### 🏠 Homepage
![Homepage](docs/screenshots/homepage.png)
*Modern landing page with feature highlights and quick access*

### 🧮 DSA Visualizer
![DSA Visualizer](docs/screenshots/dsa-visualizer.png)
*Interactive algorithm visualizations with step-by-step controls*

### 💻 Problem Solving Interface
![Problem Solving](docs/screenshots/problem-interface.png)
*Monaco Editor with real-time code execution and testing*

### 🏆 Contest Dashboard
![Contest Dashboard](docs/screenshots/contest-dashboard.png)
*Live contest management with real-time leaderboards*

### 🎯 Interview System
![Interview System](docs/screenshots/interview-system.png)
*Live coding interviews with video conferencing integration*

### 📊 Analytics Dashboard
![Analytics](docs/screenshots/analytics.png)
*Comprehensive performance tracking and insights*

## ⚠️ Known Issues

### Current Limitations
1. **OAuth Configuration**: Google/GitHub OAuth requires proper domain setup for production
2. **Code Execution**: Limited to basic test cases; complex I/O might need optimization
3. **Video Calls**: Jitsi integration may require HTTPS for full functionality
4. **Real-time Features**: WebSocket connections might timeout on some hosting platforms

### Browser Compatibility
- **Fully Supported**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Partial Support**: Older browsers may have limited DSA visualization features
- **Mobile**: Responsive design optimized for tablets; phone experience is functional but not optimal

### Performance Considerations
- **Large Datasets**: DSA visualizations with 100+ elements may experience slower animations
- **Concurrent Users**: Socket.io may need scaling for 500+ simultaneous contest participants
- **Memory Usage**: Monaco Editor instances should be properly disposed to prevent memory leaks

## 🔮 Future Improvements

### Short-term Goals (Next 3 months)
- [ ] **Enhanced DSA Visualizer**: Add Graph algorithms (Dijkstra, DFS, BFS)
- [ ] **Mobile App**: React Native version for iOS/Android
- [ ] **Advanced Analytics**: Machine learning-based performance insights
- [ ] **Code Collaboration**: Real-time collaborative editing
- [ ] **Video Tutorials**: Integrated learning videos for each topic

### Medium-term Goals (6 months)
- [ ] **Microservices Architecture**: Split into independent services
- [ ] **Advanced Contest Features**: ICPC-style contests, virtual contests
- [ ] **Plagiarism Detection**: AI-powered code similarity analysis
- [ ] **Enterprise Features**: Company-specific contests and assessments
- [ ] **API Rate Limiting**: Advanced throttling and abuse prevention

### Long-term Vision (1 year)
- [ ] **Multi-language Support**: Platform localization
- [ ] **Advanced AI Integration**: GPT-powered code review and suggestions
- [ ] **Blockchain Certificates**: Verifiable achievement certificates
- [ ] **Global Competitions**: International programming contests
- [ ] **Mentorship Platform**: Connect learners with industry experts

### Technical Debt
- [ ] **TypeScript Migration**: Full TypeScript implementation
- [ ] **Test Coverage**: Comprehensive unit and integration tests
- [ ] **Documentation**: API documentation with OpenAPI/Swagger
- [ ] **Monitoring**: Application performance monitoring (APM)
- [ ] **Security Audit**: Third-party security assessment

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started
1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests**: `npm test`
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Check linting
npm run lint

# Build for production
npm run build
```

### Code Standards
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Use Prettier for code formatting
- **Naming**: Use camelCase for variables, PascalCase for components
- **Comments**: Add JSDoc comments for functions and components
- **Commits**: Use conventional commit messages

### Contribution Areas
- 🐛 **Bug Fixes**: Help fix reported issues
- ✨ **New Features**: Implement requested features
- 📚 **Documentation**: Improve README, API docs, code comments
- 🎨 **UI/UX**: Enhance user interface and experience
- ⚡ **Performance**: Optimize code and reduce bundle size
- 🧪 **Testing**: Add test coverage for existing code

### Reporting Issues
Use GitHub Issues to report:
- Bugs with reproduction steps
- Feature requests with detailed descriptions
- Performance issues with profiling data
- Security vulnerabilities (private disclosure)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Rajdeep Kushwaha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">
  <h3>🚀 Built with ❤️ by <a href="https://github.com/RajdeepKushwaha5">Rajdeep Kushwaha</a></h3>
  
  <p>
    <a href="https://github.com/RajdeepKushwaha5/UPCODE/issues">Report Bug</a> •
    <a href="https://github.com/RajdeepKushwaha5/UPCODE/issues">Request Feature</a> •
    <a href="#-contributing">Contribute</a>
  </p>
  
  <p>
    <strong>⭐ Star this repository if you found it helpful!</strong>
  </p>
</div>