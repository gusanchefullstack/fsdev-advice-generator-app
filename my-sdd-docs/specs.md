# Specifications

## Design

The design can be found at Figma Desktop at:

- System Design:
  https://www.figma.com/design/blhCgD0US3YPfhgYxftkSu/advice-generator-app?node-id=2-2
- Designs for Desktop, Tablet and Mobile:
  https://www.figma.com/design/blhCgD0US3YPfhgYxftkSu/advice-generator-app?node-id=1-3

You will find all the required assets in the `/images` folder. The assets are already optimized.

## Domain Rules and Business Logic

The users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Generate a new piece of advice by clicking the dice icon

### Data Source: Advice Slip API

- Endpoint: `GET https://api.adviceslip.com/advice` — returns one random advice slip.
- Success payload (HTTP 200):

  ```json
  { "slip": { "id": 193, "advice": "Value the people in your life." } }
  ```

  - `slip.id` — number. The slip identifier, shown in the heading per the Figma design.
  - `slip.advice` — string. The advice text, shown as the quote.

- The API returns **HTTP 200 on failure too**, with a different payload shape:

  ```json
  { "message": { "type": "error", "text": "Advice slip not found." } }
  ```

  A response therefore counts as successful only when `slip.advice` is a non-empty
  string. `response.ok` MUST NOT be treated as sufficient. An unknown path returns an
  HTML 404 page, so JSON parsing MUST be guarded against a non-JSON body.

- The endpoint sends `Cache-Control: max-age=600, private, must-revalidate`. Without
  cache-busting, a browser may serve the same slip for up to 10 minutes and the dice
  button will appear not to work. Every request MUST bypass the HTTP cache — append a
  unique query parameter, or pass `cache: "no-store"` to `fetch`.

### Request States

- **Loading**: while a request is in flight, the dice button is disabled and shows a
  non-interactive state. The previously displayed advice remains visible until the new
  slip arrives.
- **Error**: any failure — network error, non-2xx status, unparseable body, or a
  payload without `slip.advice` — displays the friendly message
  "Couldn't fetch advice right now. Please try again." The dice button returns to its
  enabled state so the user can retry. Raw errors and stack traces are never surfaced.
- No automatic retry. The user retries by clicking the dice.

## Front-end Architecture and Style Guide

### Front-end Architecture

- Use vite as deploying server for frontend
- The source code should be in src/ folder under the project root. CSS styles and Typescript files should inside corresponding subfolders. Use logical reactjs components created in a /componentes folder
- Use vitest for testing use cases
- Use best practices for frontend development naming convention, semantic html among others.
- Use semantic HTML (header, nav, main, aside, footer, article, section) consistently. It clarifies structure for users and assistive tech and reduces the need for extra ARIA.
- One main per page is a simple, high-impact rule to remember. Wrap the primary page content in a single <main> element (and remove any other main roles/elements). If there are multiple sections that look “main-like,” choose one principal area and mark others with appropriate semantics (section, aside, nav).
- Only one h1 element should exist in html
- Avoid to use Multiple links with identical text, which makes it hard to determine each link's purpose when list of links is read out of surrounding context by assistive technology. This causes screen reader users and anyone scanning links quickly to be unsure which plan each action applies to, increasing cognitive load and risking mistaken clicks. Consider using best practices of WCAG.

### Front-end Style Guide

1. Layout

Use the index.html file where to contain app. Keep this file at the project root, which is
where Vite expects the entry HTML. It references the application entry point in `/src`, so
all application source still lives under `src/` as described above.

The designs were created to the following widths:

- Mobile: 375px
- Desktop: 1440px
  > These are just the design sizes. Ensure content is responsive and meets WCAG requirements by testing the full range of screen sizes from 320px to large screens.

2. Colors

2.1. Primary

- Blue 200: hsl(193, 38%, 86%)
- Green 300: hsl(150, 100%, 66%)

  2.2. Neutral

- Blue 600: hsl(217, 19%, 38%)
- Blue 900: hsl(217, 19%, 24%)
- Blue 950: hsl(218, 23%, 16%)

3. Typography

3.1 Body Copy

Quote font size is defined by the Figma design and changes at the 768px breakpoint:

- Font size (quote), below 768px: 24px
- Font size (quote), 768px and above: 28px

Both sizes use Manrope ExtraBold at 135% line height with -0.3px letter spacing (Figma
"Text Preset 2" and "Text Preset 1" respectively). The full token set read from the Figma
Design System is recorded in `specs/001-advice-generator/research.md` D1-D2.

  3.2 Font

- Family: [Manrope](https://fonts.google.com/specimen/Manrope)
- Weights: 800

## Testing

- Use vitest as testing framework
- Test implementation with browser screen at 375px (mobile), 768px (tablet) and 1440px (desktop) screens.
- Test key and edge cases that can apply
- Use test to validate functionality/features after important changes.

## Documentation

- Add comments in plain style for key elements of code.
- Create a README.md following README-template.md but also considering skill /create-readme once the project is finished
- Update the Author section in README with the following contact info. Add badges to each related link address. Arrange them in inline row.
  https://www.linkedin.com/in/gustavosanchezgalarza/
  https://github.com/gusanchefullstack
  https://hashnode.com/@gusanchedev
  https://x.com/gusanchedev
  https://bsky.app/profile/gusanchedev.bsky.social
  https://www.freecodecamp.org/gusanchedev
  https://www.frontendmentor.io/profile/gusanchefullstack

- Once finished implementation, take screenshots for 375px strictly and 1440px strictly viewport (responsive view) and add them first to the /screenshots folder in root and them insert from here to the readme in the screenshots section.
- Screenshots to include in README.md for 375px should be 40% width of 1440px shots.

## Deployment

- Once I confirm the project is done and the github repos were created, deploy the frontend project to vercel under my account (gustavosanchezgalarza@gmail.com). If the project has backend component, use www.render.com to deploy the backend.

## Post Implementation Tasks

Execute the following tasks:

1. Submit project to frontendmentor.io. Use @frontendmentor-submitter to submit the project. Follow the ["Complete guide to submitting solutions"](https://www.frontendmentor.io/guides/how-to-submit-solutions) for tips on how to do this.

The url of the project is:
https://www.frontendmentor.io/challenges/advice-generator-app-QdUG-13db?tab=submit

2. Get Solution URL (in frontendmentor.io) and live site URL (in vercel) and once you have them update the git hub repo README.md. Also be sure to update the live site url in the repo page.

3. Update my landing page. Ask for confirmation first. If yes, Use @landing-page-portfolio-updater to update my portafolio with this project.

4. Fixing issues of FrontendMentor.io.
   Use @frontend-mentor-issue-fixer to fix issues detected by frontendmentor.io for improving score of app submitted.
