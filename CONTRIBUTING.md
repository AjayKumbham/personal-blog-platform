# Contributing to Personal Developer Blog Platform

Thank you for your interest in contributing! This guide will help you get started with contributing to this React/TypeScript blog platform.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Git
- Supabase account (for backend testing)
- Brevo account (for email testing)

### Development Setup

1. **Fork and clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/personal-blog-platform.git
   cd personal-blog-platform
   git remote add upstream https://github.com/AjayKumbham/personal-blog-platform.git
   ```

2. **Install and configure**
   ```bash
   npm install
   cp .env.example .env
   # Fill in your test environment variables
   npm run dev
   ```

## 🔄 Development Workflow

### Branch Strategy
- `main` - Production ready code
- `feature/feature-name` - New features
- `fix/issue-description` - Bug fixes
- `docs/update-description` - Documentation updates

### Making Changes
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes following our code style
3. Commit with clear messages: `git commit -m "Add feature: description"`
4. Push and create a Pull Request

## 📝 What We're Looking For

### High Priority
- Bug fixes for reported issues
- Performance improvements
- Mobile responsiveness fixes
- Accessibility improvements
- Security enhancements

### Medium Priority
- New UI components
- Enhanced admin features
- Additional email templates
- SEO improvements

### Low Priority
- Code refactoring
- Documentation improvements
- Developer experience enhancements

## 🔍 Pull Request Guidelines

### Before Submitting
- [ ] Test your changes locally
- [ ] Run `npm run type-check` and fix any TypeScript errors
- [ ] Run `npm run lint` and fix any linting issues
- [ ] Update documentation if needed
- [ ] Check that your changes don't break existing functionality

### PR Requirements
- Clear title describing the change
- Reference related issues (`Fixes #123`)
- Detailed description of what was changed and why
- Screenshots for UI changes
- One feature/fix per PR

## 🎨 Code Style Guidelines

### TypeScript
```typescript
// ✅ Good: Explicit types
interface BlogPost {
  id: string;
  title: string;
  publishedAt: Date;
}

// ❌ Avoid: any types
const data: any = fetchData();
```

### React Components
```tsx
// ✅ Good: Functional components with proper typing
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary' }) => {
  return (
    <button onClick={onClick} className={`btn btn-${variant}`}>
      {children}
    </button>
  );
};
```

### Tailwind CSS
```tsx
// ✅ Good: Organized classes
<div className="
  flex items-center justify-between
  p-4 mb-6
  bg-white rounded-lg shadow-md
  hover:shadow-lg transition-shadow
">
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `BlogCard.tsx`)
- Services: `camelCase.ts` (e.g., `blogService.ts`)
- Types: `camelCase.ts` (e.g., `index.ts`)

## 🐛 Reporting Issues

### Bug Reports
Include:
- Environment details (OS, Node.js version, browser)
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or error logs
- Minimal reproduction example if possible

### Feature Requests
Include:
- Clear description of the proposed feature
- Use cases and benefits
- Implementation suggestions
- Impact on existing functionality

## 📚 Documentation

### Code Comments
```typescript
/**
 * Fetches blog posts with optional filtering
 * @param filters - Optional filters to apply
 * @param limit - Maximum posts to return (default: 10)
 * @returns Promise resolving to blog posts array
 */
async function fetchBlogPosts(filters?: BlogPostFilters, limit = 10): Promise<BlogPost[]> {
  // Implementation...
}
```

### README Updates
When adding features:
- Update feature list in README.md
- Add new environment variables to .env.example
- Include setup instructions if needed

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable components (Button, Card, Toast)
│   ├── layout/          # Header, Footer
│   ├── blog/            # Blog-specific components
│   └── newsletter/      # Email/newsletter components
├── pages/               # Route components
├── services/            # API integrations
├── hooks/               # Custom React hooks
├── types/               # TypeScript definitions
└── lib/                 # Utilities and configurations
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript checking
npm run lint         # ESLint linting
```

## 📞 Getting Help

1. Check existing documentation
2. Search closed issues for similar questions
3. Create a new issue for specific problems
4. Contact maintainers: ajaygoud.kumbham@gmail.com

## 🏆 Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors page

Thank you for helping make this project better! 🚀