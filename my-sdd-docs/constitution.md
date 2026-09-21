# Contititution of the prroject: "Advice generator app"

## 1. About the application

This advice generator app use the Advice Slip API.

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Generate a new piece of advice by clicking the dice icon

The goals of this app are:

- get it looking as close to the design as possible for frontend project
- practice Spec-Driven Development (SDD) using Github's Spec Kit Tool

## 2. Source of Truth for Design

- Consider the figma-design file ("\*.fig") incluided in /figma-design folder as source of truth for css styles, spacing, fonts, responsive designs.
- Use pages Design and Design Systems in figma file for getting all styling details.
- Also use the images contained in this file like svgs if not found them in the src/assets.
- The designs in figma file reflect the expected output for the several screens: mobile, desktop and tablet. Apply the best responsive design practices for each layout but always keep the specs defined in figma.
- Use figma desktop MCP to connect to figma file and get details of design.

## 3. Source of Data

Use defined APIs in specs to get data.

## 4. Tech Stack and Tech considerations

- Separate apps (repos) for backend and frontend. Not monorepo, no monolith.

- **Frontend / UI:** Reactjs. Use CSS modules and classes for styling. Fonts, colors, gradients, typography should be parameterized in the project to allow further changes and this variables should be included in a separate file.
- **Backend:** (if exist). Backend developed in nodejs + express.js. Follow API Rest guidelines
- **Database:** (if exist).Use Prisma.io Postgres as DB. Use prisma.io ORM.
- **Languaje:** TypeScript in frontend and backend.

## 5. Code structure and styling

- **Plain Structure:** Avoid overengineering.
- **Style:** Use function components as needed by react.
- **Nomenclatura:** Use `camelCase` for functions/variables y `PascalCase` para Interfaces/Types or classes.

## 6. Error Handling and validations

- **UI:** Never expose raw errors or _stack traces_ to the end user. Evry technical error must be translated into a friendly message.
- **Backend:** Always return HTTP semantic status codes.

## 7. Behaviour of Agentic IA (you) - Spec Driven Development

- **Zero Shadow Code:** Build only the documented in Spec.md. Don't add features "just in case".
- **Source of truth:** If a user instruction contradicts this constitution or if you detect a logical fault, stop. Warning the issue and ask for spec.md update before touching any source code.

# 8. Versioning

- Initialize local git repos if not initialized.
- Github repos must be created with a prefix "fsdev-" to identify later the repos created.
- Create the backend (if apply) and frontend repos in github as first step.
- Avoid that figma designs be pushed to github (using .gitignore file).
