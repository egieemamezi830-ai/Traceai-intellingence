# Contributing to Trace AI

## Development Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local`
3. Fill in your credentials
4. Run `npm install`
5. Run `npm run dev`

## Code Standards

- Use TypeScript strictly
- Follow ESLint configuration
- Format code with Prettier
- Write tests for new features

## Git Workflow

1. Create feature branch from `develop`
2. Make changes
3. Submit pull request to `develop`
4. Code review required before merge
5. Merge to `main` for production

## Commit Messages

```
type(scope): description

- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Code style
- refactor: Code refactor
- test: Tests
- chore: Build/tooling
```

Example:
```
feat(auth): Add two-factor authentication
```
