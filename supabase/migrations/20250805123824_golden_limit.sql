/*
  # Insert sample blog posts for demonstration

  1. Sample Posts
    - Modern React development post
    - TypeScript best practices post
    - Web performance optimization post
    - Node.js backend development post
    - CSS Grid and Flexbox post

  2. Features Demonstrated
    - Published and draft posts
    - Featured posts
    - Various tags and categories
    - Different read times
    - Cover images from Pexels
*/

-- Insert sample blog posts
INSERT INTO posts (
  title,
  slug,
  excerpt,
  content,
  tags,
  published_at,
  read_time,
  featured,
  published,
  cover_image
) VALUES
(
  'Building Modern React Applications with TypeScript',
  'building-modern-react-applications-typescript',
  'Learn how to build scalable and maintainable React applications using TypeScript, modern hooks, and best practices.',
  '# Building Modern React Applications with TypeScript

React and TypeScript make a powerful combination for building robust web applications. In this comprehensive guide, we''ll explore the best practices for creating scalable React applications.

## Why TypeScript with React?

TypeScript brings static typing to JavaScript, which helps catch errors early and improves developer experience. When combined with React, it provides:

- **Better IntelliSense**: Enhanced autocomplete and error detection
- **Refactoring Safety**: Confident code refactoring with type checking
- **Documentation**: Types serve as living documentation
- **Team Collaboration**: Clearer interfaces and contracts

## Setting Up Your Project

```bash
npx create-react-app my-app --template typescript
cd my-app
npm start
```

## Component Patterns

### Functional Components with Props

```typescript
interface ButtonProps {
  variant: ''primary'' | ''secondary'';
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant, onClick, children }) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### Custom Hooks

```typescript
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState<number>(initialValue);
  
  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  
  return { count, increment, decrement, reset };
}
```

## State Management

For complex applications, consider using Context API with useReducer or external libraries like Redux Toolkit.

## Best Practices

- Use strict TypeScript configuration
- Leverage React.FC for component typing
- Create reusable interface definitions
- Use custom hooks for logic separation
- Implement proper error boundaries

## Conclusion

TypeScript enhances React development by providing type safety, better tooling, and improved maintainability. Start incorporating these patterns in your next project!',
  ARRAY['React', 'TypeScript', 'Web Development', 'Frontend'],
  now() - interval '2 days',
  8,
  true,
  true,
  'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1200'
),
(
  'Mastering CSS Grid and Flexbox for Modern Layouts',
  'mastering-css-grid-flexbox-modern-layouts',
  'Discover the power of CSS Grid and Flexbox to create responsive, flexible layouts that work across all devices.',
  '# Mastering CSS Grid and Flexbox for Modern Layouts

CSS Grid and Flexbox are two powerful layout systems that have revolutionized how we create web layouts. Let''s explore when and how to use each effectively.

## CSS Grid: The Two-Dimensional Layout System

CSS Grid excels at creating complex, two-dimensional layouts where you need control over both rows and columns.

### Basic Grid Setup

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}

.grid-item {
  background: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
}
```

### Advanced Grid Techniques

```css
.complex-grid {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

## Flexbox: The One-Dimensional Layout System

Flexbox is perfect for arranging items in a single direction (row or column) and distributing space between them.

### Flex Container Properties

```css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
```

### Flex Item Properties

```css
.flex-item {
  flex: 1 1 300px; /* grow shrink basis */
}

.flex-item-fixed {
  flex: 0 0 200px; /* fixed width */
}
```

## When to Use Grid vs Flexbox

- **Use Grid for**: Complex layouts, two-dimensional control, page-level layouts
- **Use Flexbox for**: Component-level layouts, navigation bars, centering content

## Responsive Design Patterns

```css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .responsive-grid {
    grid-template-columns: 1fr;
  }
}
```

## Conclusion

Mastering both CSS Grid and Flexbox gives you the tools to create any layout imaginable. Practice combining them for maximum flexibility!',
  ARRAY['CSS', 'Web Development', 'Frontend', 'Responsive Design'],
  now() - interval '5 days',
  6,
  false,
  true,
  'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200'
),
(
  'Node.js Best Practices for Backend Development',
  'nodejs-best-practices-backend-development',
  'Essential Node.js patterns and practices for building scalable, maintainable backend applications.',
  '# Node.js Best Practices for Backend Development

Building robust backend applications with Node.js requires following established patterns and best practices. Here''s your comprehensive guide.

## Project Structure

Organize your Node.js project for scalability and maintainability:

```
src/
├── controllers/
├── models/
├── routes/
├── middleware/
├── services/
├── utils/
├── config/
└── tests/
```

## Environment Configuration

```javascript
// config/database.js
const config = {
  development: {
    host: process.env.DB_HOST || ''localhost'',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || ''myapp_dev'',
  },
  production: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: true,
  }
};

module.exports = config[process.env.NODE_ENV || ''development''];
```

## Error Handling

Implement comprehensive error handling:

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === ''ValidationError'') {
    return res.status(400).json({
      error: ''Validation Error'',
      details: err.message
    });
  }
  
  if (err.name === ''UnauthorizedError'') {
    return res.status(401).json({
      error: ''Unauthorized'',
      message: ''Invalid token''
    });
  }
  
  res.status(500).json({
    error: ''Internal Server Error'',
    message: process.env.NODE_ENV === ''production'' 
      ? ''Something went wrong'' 
      : err.message
  });
};

module.exports = errorHandler;
```

## Database Best Practices

### Connection Pooling

```javascript
// config/database.js
const { Pool } = require(''pg'');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;
```

### Query Optimization

```javascript
// services/userService.js
class UserService {
  static async findById(id) {
    const query = ''SELECT id, email, name FROM users WHERE id = $1'';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async findByEmail(email) {
    const query = ''SELECT * FROM users WHERE email = $1'';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }
}
```

## Security Best Practices

### Input Validation

```javascript
const Joi = require(''joi'');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).max(50).required()
});

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
```

### Rate Limiting

```javascript
const rateLimit = require(''express-rate-limit'');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: ''Too many requests from this IP''
});

app.use(''/api/'', limiter);
```

## Testing

```javascript
// tests/user.test.js
const request = require(''supertest'');
const app = require(''../app'');

describe(''User API'', () => {
  test(''POST /api/users should create a new user'', async () => {
    const userData = {
      email: ''test@example.com'',
      password: ''password123'',
      name: ''Test User''
    };
    
    const response = await request(app)
      .post(''/api/users'')
      .send(userData)
      .expect(201);
      
    expect(response.body.email).toBe(userData.email);
  });
});
```

## Performance Optimization

- Use clustering for CPU-intensive tasks
- Implement caching with Redis
- Optimize database queries
- Use compression middleware
- Monitor with APM tools

## Conclusion

Following these best practices will help you build maintainable, secure, and scalable Node.js applications. Remember to always validate input, handle errors gracefully, and test your code thoroughly.',
  ARRAY['Node.js', 'Backend', 'JavaScript', 'API Development'],
  now() - interval '1 week',
  10,
  true,
  true,
  'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1200'
),
(
  'Web Performance Optimization Techniques',
  'web-performance-optimization-techniques',
  'Learn essential techniques to optimize your web applications for better performance, faster loading times, and improved user experience.',
  '# Web Performance Optimization Techniques

Web performance directly impacts user experience, SEO rankings, and conversion rates. Let''s explore proven techniques to make your websites lightning fast.

## Core Web Vitals

Google''s Core Web Vitals are essential metrics for measuring user experience:

- **Largest Contentful Paint (LCP)**: Loading performance
- **First Input Delay (FID)**: Interactivity
- **Cumulative Layout Shift (CLS)**: Visual stability

## Image Optimization

### Modern Image Formats

```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.avif" type="image/avif">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>
```

### Responsive Images

```html
<img 
  srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 480px) 100vw, (max-width: 800px) 50vw, 25vw"
  src="medium.jpg" 
  alt="Responsive image"
>
```

## JavaScript Optimization

### Code Splitting

```javascript
// Dynamic imports for code splitting
const LazyComponent = React.lazy(() => import(''./LazyComponent''));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

### Tree Shaking

```javascript
// Import only what you need
import { debounce } from ''lodash/debounce'';
// Instead of: import _ from ''lodash'';
```

## CSS Optimization

### Critical CSS

```html
<style>
  /* Critical above-the-fold CSS */
  .header { display: flex; justify-content: space-between; }
  .hero { min-height: 100vh; background: #f0f0f0; }
</style>

<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel=''stylesheet''">
```

### CSS Containment

```css
.card {
  contain: layout style paint;
}

.sidebar {
  contain: layout;
}
```

## Network Optimization

### Resource Hints

```html
<!-- DNS prefetch for external domains -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">

<!-- Preconnect for critical resources -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Preload critical resources -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="hero-image.jpg" as="image">
```

### Service Workers

```javascript
// sw.js
const CACHE_NAME = ''v1'';
const urlsToCache = [
  ''/'',
  ''/styles/main.css'',
  ''/scripts/main.js''
];

self.addEventListener(''install'', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener(''fetch'', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

## Database Optimization

### Query Optimization

```sql
-- Use indexes for frequently queried columns
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_post_published ON posts(published, created_at);

-- Optimize queries
SELECT id, title, excerpt FROM posts 
WHERE published = true 
ORDER BY created_at DESC 
LIMIT 10;
```

### Connection Pooling

```javascript
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Monitoring and Measurement

### Performance API

```javascript
// Measure performance
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.duration);
  }
});

observer.observe({ entryTypes: [''measure'', ''navigation''] });

// Custom measurements
performance.mark(''start-task'');
// ... perform task
performance.mark(''end-task'');
performance.measure(''task-duration'', ''start-task'', ''end-task'');
```

### Web Vitals Tracking

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from ''web-vitals'';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Performance Budget

Set performance budgets to maintain standards:

```json
{
  "budget": [
    {
      "path": "/**",
      "timings": [
        { "metric": "interactive", "budget": 3000 },
        { "metric": "first-contentful-paint", "budget": 1500 }
      ],
      "resourceSizes": [
        { "resourceType": "script", "budget": 250 },
        { "resourceType": "total", "budget": 500 }
      ]
    }
  ]
}
```

## Conclusion

Web performance optimization is an ongoing process. Regularly audit your applications, set performance budgets, and monitor real user metrics to ensure optimal user experience.',
  ARRAY['Performance', 'Web Development', 'Optimization', 'Frontend'],
  now() - interval '3 days',
  12,
  false,
  true,
  'https://images.pexels.com/photos/590020/pexels-photo-590020.jpg?auto=compress&cs=tinysrgb&w=1200'
),
(
  'Getting Started with Docker for Developers',
  'getting-started-docker-developers',
  'A comprehensive guide to Docker containerization for developers, covering basics to advanced deployment strategies.',
  '# Getting Started with Docker for Developers

Docker has revolutionized how we develop, ship, and run applications. This guide will take you from Docker basics to production deployment.

## What is Docker?

Docker is a containerization platform that packages applications and their dependencies into lightweight, portable containers.

### Key Benefits

- **Consistency**: Same environment across development, testing, and production
- **Isolation**: Applications run in isolated environments
- **Portability**: Run anywhere Docker is supported
- **Efficiency**: Lightweight compared to virtual machines

## Docker Fundamentals

### Images vs Containers

- **Image**: Read-only template for creating containers
- **Container**: Running instance of an image

### Basic Commands

```bash
# Pull an image
docker pull node:18-alpine

# Run a container
docker run -d -p 3000:3000 --name myapp node:18-alpine

# List running containers
docker ps

# Stop a container
docker stop myapp

# Remove a container
docker rm myapp
```

## Creating Your First Dockerfile

```dockerfile
# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Start the application
CMD ["npm", "start"]
```

## Multi-Stage Builds

Optimize image size with multi-stage builds:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

## Docker Compose

Manage multi-container applications:

```yaml
# docker-compose.yml
version: ''3.8''

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
    depends_on:
      - db
      - redis
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## Best Practices

### Security

```dockerfile
# Use specific versions
FROM node:18.17.0-alpine

# Don''t run as root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Use .dockerignore
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.nyc_output
```

### Optimization

```dockerfile
# Layer caching optimization
COPY package*.json ./
RUN npm ci --only=production

# Copy source code last
COPY . .

# Use alpine images
FROM node:18-alpine

# Clean up in same layer
RUN apk add --no-cache git && \
    npm install && \
    apk del git
```

## Development Workflow

### Development Environment

```yaml
# docker-compose.dev.yml
version: ''3.8''

services:
  app:
    build:
      context: .
      target: development
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev
```

### Hot Reloading

```dockerfile
# Development stage
FROM node:18-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

## Production Deployment

### Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

### Resource Limits

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: ''0.5''
          memory: 512M
        reservations:
          cpus: ''0.25''
          memory: 256M
```

## Monitoring and Logging

```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Common Commands

```bash
# Build image
docker build -t myapp:latest .

# Run with environment variables
docker run -e NODE_ENV=production myapp:latest

# Execute command in running container
docker exec -it myapp bash

# View logs
docker logs -f myapp

# Clean up
docker system prune -a
```

## Conclusion

Docker simplifies application deployment and ensures consistency across environments. Start with simple containers and gradually adopt advanced patterns as your needs grow.',
  ARRAY['Docker', 'DevOps', 'Containerization', 'Deployment'],
  now() - interval '4 days',
  15,
  false,
  false,
  'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1200'
);