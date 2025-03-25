# Development Practices for Insight Directory

## Command Line Guidelines

### IMPORTANT: Command Execution
- **NEVER use the `&&` operator in commands**
- Always use separate commands or scripts instead
- If you need to run multiple commands in sequence, create a script file or run them one at a time

### Example - Incorrect:
```bash
# DO NOT DO THIS
npm install && npm run dev
```

### Example - Correct:
```bash
# First command
npm install

# Second command
npm run dev
```

## Code Style Guidelines

- **Indentation**: 2 spaces
- **Naming Conventions**:
  - Files: kebab-case (e.g., `resource-card.js`)
  - React Components: PascalCase (e.g., `ResourceCard`)
  - Variables and Functions: camelCase (e.g., `fetchResources`)
- **Comments**: Use JSDoc for functions and complex logic

## API Changes

- Be cautious when modifying the API client to avoid breaking functionality
- Test all affected components when making API changes
- Document any API changes in the changelog

## Documentation

- Keep documentation updated when making significant changes
- Follow the established documentation format
- Include code examples where appropriate
