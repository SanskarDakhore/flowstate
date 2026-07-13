# Contributing to FLOWSTATE

Thank you for your interest in contributing to FLOWSTATE!

## Development Workflow

1. **Fork & Clone** the repository
2. **Create a branch** from `main` using the naming convention:
   - `feature/description` — new features
   - `fix/description` — bug fixes
   - `refactor/description` — code restructuring
   - `docs/description` — documentation changes
   - `infra/description` — infrastructure/CI changes
3. **Make your changes** following the coding standards in `docs/development/CODING_STANDARDS.md`
4. **Write/update tests** for any changed behavior
5. **Update documentation** if your changes affect architecture or APIs
6. **Update context files** if your changes affect architectural decisions
7. **Submit a Pull Request** using the PR template

## Commit Messages

Use clear, descriptive commit messages:

```
<type>(<scope>): <subject>

<body>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `infra`, `chore`

Scopes: `frontend`, `backend`, `middleware`, `database`, `shared`, `context`, `docs`, `scripts`

## Code Review

- All PRs require at least one review
- Frontend changes should be reviewed by someone familiar with the game architecture
- Backend changes should include relevant test coverage
- Database migrations require careful review

## Architecture Rules

Before contributing, read:
- `PROJECT_STRUCTURE.md` — where code belongs
- `context/DECISIONS.md` — confirmed architectural decisions
- `context/CURRENT_STATE.md` — current development phase

## Questions?

Open a GitHub Issue or check `context/OPEN_QUESTIONS.md` for known open design questions.
