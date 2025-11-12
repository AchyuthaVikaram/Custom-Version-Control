const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/userModel');
const Repository = require('./models/repoModel');
const Issue = require('./models/issueModel');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/customvcs');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Repository.deleteMany({});
    await Issue.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.insertMany([
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: hashedPassword,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        username: 'janedoe',
        email: 'jane@example.com',
        password: hashedPassword,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
      },
      {
        username: 'devuser',
        email: 'dev@example.com',
        password: hashedPassword,
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-10')
      },
      {
        username: 'alice',
        email: 'alice@example.com',
        password: hashedPassword,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      },
      {
        username: 'bob',
        email: 'bob@example.com',
        password: hashedPassword,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15')
      }
    ]);

    console.log(`Created ${users.length} users`);

    // Create sample repositories
    const repositories = await Repository.insertMany([
      {
        name: 'react-dashboard',
        description: 'A modern React dashboard with beautiful UI components and charts',
        owner: users[0]._id,
        visibility: true,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-11-10'),
        language: 'JavaScript',
        stars: 245,
        forks: 67,
        watchers: 32
      },
      {
        name: 'node-api-server',
        description: 'RESTful API server built with Node.js, Express, and MongoDB',
        owner: users[0]._id,
        visibility: true,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-11-08'),
        language: 'JavaScript',
        stars: 189,
        forks: 43,
        watchers: 28
      },
      {
        name: 'python-ml-toolkit',
        description: 'Machine learning toolkit with common algorithms and utilities',
        owner: users[1]._id,
        visibility: true,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-11-05'),
        language: 'Python',
        stars: 567,
        forks: 123,
        watchers: 89
      },
      {
        name: 'vue-component-library',
        description: 'Reusable Vue.js components for rapid development',
        owner: users[1]._id,
        visibility: false,
        createdAt: new Date('2024-04-01'),
        updatedAt: new Date('2024-11-02'),
        language: 'Vue',
        stars: 78,
        forks: 21,
        watchers: 15
      },
      {
        name: 'docker-compose-templates',
        description: 'Collection of Docker Compose templates for various services',
        owner: users[2]._id,
        visibility: true,
        createdAt: new Date('2024-05-10'),
        updatedAt: new Date('2024-10-28'),
        language: 'Shell',
        stars: 334,
        forks: 89,
        watchers: 45
      },
      {
        name: 'css-animations',
        description: 'Beautiful CSS animations and transitions collection',
        owner: users[3]._id,
        visibility: true,
        createdAt: new Date('2024-06-20'),
        updatedAt: new Date('2024-10-25'),
        language: 'CSS',
        stars: 156,
        forks: 34,
        watchers: 22
      },
      {
        name: 'typescript-utils',
        description: 'Utility functions and types for TypeScript projects',
        owner: users[4]._id,
        visibility: true,
        createdAt: new Date('2024-07-15'),
        updatedAt: new Date('2024-10-20'),
        language: 'TypeScript',
        stars: 92,
        forks: 18,
        watchers: 12
      },
      {
        name: 'mobile-app-starter',
        description: 'React Native starter template with navigation and state management',
        owner: users[0]._id,
        visibility: false,
        createdAt: new Date('2024-08-01'),
        updatedAt: new Date('2024-10-15'),
        language: 'JavaScript',
        stars: 67,
        forks: 15,
        watchers: 8
      }
    ]);

    console.log(`Created ${repositories.length} repositories`);

    // Create sample issues
    const issues = await Issue.insertMany([
      // React Dashboard Issues
      {
        title: 'Add dark mode support',
        description: 'Users have requested a dark mode theme option for better usability in low-light environments. This should include a toggle switch in the settings and proper color scheme transitions.',
        repository: repositories[0]._id,
        author: users[1]._id,
        status: 'open',
        priority: 'medium',
        labels: ['enhancement', 'ui', 'accessibility'],
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date('2024-10-01')
      },
      {
        title: 'Fix memory leak in data processing',
        description: 'Memory usage keeps increasing when processing large datasets. The issue appears to be in the chart rendering component where event listeners are not being properly cleaned up.',
        repository: repositories[0]._id,
        author: users[2]._id,
        status: 'open',
        priority: 'high',
        labels: ['bug', 'performance', 'critical'],
        createdAt: new Date('2024-10-15'),
        updatedAt: new Date('2024-10-15')
      },
      {
        title: 'Responsive design improvements',
        description: 'Dashboard components need better responsive behavior on mobile devices. Several charts and tables are not displaying correctly on smaller screens.',
        repository: repositories[0]._id,
        author: users[3]._id,
        status: 'in_progress',
        priority: 'medium',
        labels: ['enhancement', 'mobile', 'ui'],
        createdAt: new Date('2024-10-20'),
        updatedAt: new Date('2024-11-01')
      },
      {
        title: 'Add export functionality for charts',
        description: 'Users want to export charts as PNG/PDF for reports. This should include options for different formats and resolutions.',
        repository: repositories[0]._id,
        author: users[4]._id,
        status: 'open',
        priority: 'low',
        labels: ['feature', 'export'],
        createdAt: new Date('2024-11-05'),
        updatedAt: new Date('2024-11-05')
      },

      // Node API Server Issues
      {
        title: 'Update documentation',
        description: 'API documentation needs to be updated with new endpoints and examples. Include Swagger/OpenAPI specification and postman collection.',
        repository: repositories[1]._id,
        author: users[0]._id,
        status: 'closed',
        priority: 'low',
        labels: ['documentation', 'api'],
        createdAt: new Date('2024-09-20'),
        updatedAt: new Date('2024-10-05')
      },
      {
        title: 'Add unit tests for authentication',
        description: 'Authentication module needs comprehensive unit tests to ensure security. Cover JWT token validation, password hashing, and session management.',
        repository: repositories[1]._id,
        author: users[3]._id,
        status: 'in_progress',
        priority: 'high',
        labels: ['testing', 'security', 'auth'],
        createdAt: new Date('2024-10-10'),
        updatedAt: new Date('2024-10-20')
      },
      {
        title: 'Rate limiting implementation',
        description: 'Implement rate limiting to prevent API abuse. Should include different limits for authenticated vs anonymous users.',
        repository: repositories[1]._id,
        author: users[2]._id,
        status: 'open',
        priority: 'high',
        labels: ['security', 'performance', 'middleware'],
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date('2024-11-01')
      },
      {
        title: 'Database connection pooling',
        description: 'Optimize database connections using connection pooling to improve performance under high load.',
        repository: repositories[1]._id,
        author: users[1]._id,
        status: 'open',
        priority: 'medium',
        labels: ['performance', 'database', 'optimization'],
        createdAt: new Date('2024-10-28'),
        updatedAt: new Date('2024-10-28')
      },

      // Python ML Toolkit Issues
      {
        title: 'Implement caching mechanism',
        description: 'Add Redis caching to improve API response times for frequently accessed data and model predictions.',
        repository: repositories[2]._id,
        author: users[1]._id,
        status: 'open',
        priority: 'medium',
        labels: ['enhancement', 'performance', 'caching'],
        createdAt: new Date('2024-10-25'),
        updatedAt: new Date('2024-10-25')
      },
      {
        title: 'Add support for TensorFlow 2.x',
        description: 'Update the toolkit to support TensorFlow 2.x APIs. This is a breaking change that requires careful migration.',
        repository: repositories[2]._id,
        author: users[0]._id,
        status: 'open',
        priority: 'high',
        labels: ['breaking-change', 'tensorflow', 'upgrade'],
        createdAt: new Date('2024-10-30'),
        updatedAt: new Date('2024-10-30')
      },
      {
        title: 'Memory optimization for large datasets',
        description: 'Optimize memory usage when working with large datasets. Consider implementing data streaming and chunking.',
        repository: repositories[2]._id,
        author: users[4]._id,
        status: 'in_progress',
        priority: 'medium',
        labels: ['performance', 'memory', 'optimization'],
        createdAt: new Date('2024-11-02'),
        updatedAt: new Date('2024-11-08')
      },

      // Vue Component Library Issues
      {
        title: 'Add TypeScript support',
        description: 'Convert components to TypeScript for better type safety and developer experience. Include proper type definitions.',
        repository: repositories[3]._id,
        author: users[2]._id,
        status: 'open',
        priority: 'medium',
        labels: ['typescript', 'enhancement', 'dx'],
        createdAt: new Date('2024-10-18'),
        updatedAt: new Date('2024-10-18')
      },
      {
        title: 'Component accessibility improvements',
        description: 'Improve accessibility of form components. Add proper ARIA labels, keyboard navigation, and screen reader support.',
        repository: repositories[3]._id,
        author: users[0]._id,
        status: 'open',
        priority: 'high',
        labels: ['accessibility', 'a11y', 'forms'],
        createdAt: new Date('2024-11-03'),
        updatedAt: new Date('2024-11-03')
      },

      // Docker Compose Templates Issues
      {
        title: 'Add Kubernetes deployment examples',
        description: 'Include Kubernetes deployment manifests alongside Docker Compose files for production deployments.',
        repository: repositories[4]._id,
        author: users[3]._id,
        status: 'open',
        priority: 'medium',
        labels: ['kubernetes', 'deployment', 'devops'],
        createdAt: new Date('2024-10-22'),
        updatedAt: new Date('2024-10-22')
      },
      {
        title: 'Security hardening for production',
        description: 'Review and update all templates with security best practices. Remove default passwords and add security scanning.',
        repository: repositories[4]._id,
        author: users[1]._id,
        status: 'in_progress',
        priority: 'high',
        labels: ['security', 'production', 'hardening'],
        createdAt: new Date('2024-10-26'),
        updatedAt: new Date('2024-11-05')
      },

      // CSS Animations Issues
      {
        title: 'Performance optimization for animations',
        description: 'Some animations are causing performance issues on lower-end devices. Optimize using CSS transforms and will-change property.',
        repository: repositories[5]._id,
        author: users[2]._id,
        status: 'open',
        priority: 'medium',
        labels: ['performance', 'animation', 'mobile'],
        createdAt: new Date('2024-10-12'),
        updatedAt: new Date('2024-10-12')
      },
      {
        title: 'Add animation presets',
        description: 'Create common animation presets (fade, slide, bounce) that can be easily applied with CSS classes.',
        repository: repositories[5]._id,
        author: users[4]._id,
        status: 'closed',
        priority: 'low',
        labels: ['feature', 'presets', 'ease-of-use'],
        createdAt: new Date('2024-09-15'),
        updatedAt: new Date('2024-10-08')
      },

      // TypeScript Utils Issues
      {
        title: 'Add more utility types',
        description: 'Expand the utility types collection with common patterns like DeepPartial, DeepRequired, and conditional types.',
        repository: repositories[6]._id,
        author: users[1]._id,
        status: 'open',
        priority: 'low',
        labels: ['feature', 'types', 'utility'],
        createdAt: new Date('2024-10-14'),
        updatedAt: new Date('2024-10-14')
      },
      {
        title: 'Improve JSDoc documentation',
        description: 'Add comprehensive JSDoc comments with examples for all utility functions and types.',
        repository: repositories[6]._id,
        author: users[3]._id,
        status: 'open',
        priority: 'medium',
        labels: ['documentation', 'jsdoc', 'examples'],
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date('2024-11-01')
      },

      // Mobile App Starter Issues
      {
        title: 'Update React Native version',
        description: 'Upgrade to the latest React Native version and update all dependencies. Test on both iOS and Android.',
        repository: repositories[7]._id,
        author: users[0]._id,
        status: 'open',
        priority: 'high',
        labels: ['upgrade', 'react-native', 'dependencies'],
        createdAt: new Date('2024-10-08'),
        updatedAt: new Date('2024-10-08')
      },
      {
        title: 'Add push notification support',
        description: 'Integrate Firebase Cloud Messaging for push notifications. Include both iOS and Android implementations.',
        repository: repositories[7]._id,
        author: users[2]._id,
        status: 'in_progress',
        priority: 'medium',
        labels: ['feature', 'notifications', 'firebase'],
        createdAt: new Date('2024-10-16'),
        updatedAt: new Date('2024-10-30')
      }
    ]);

    console.log(`Created ${issues.length} issues`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample users created (password: password123):');
    users.forEach(user => {
      console.log(`- ${user.username} (${user.email})`);
    });

    console.log('\nSample repositories created:');
    repositories.forEach(repo => {
      const owner = users.find(u => u._id.equals(repo.owner));
      console.log(`- ${owner.username}/${repo.name} (${repo.visibility ? 'Public' : 'Private'})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
