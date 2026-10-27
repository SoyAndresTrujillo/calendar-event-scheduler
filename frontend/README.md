# Calendar Event Scheduler (React + TypeScript + Ant Design)

A small app to generate calendar event links for Google Calendar or Outlook Calendar from a form. Required fields: Title, Start Date/Time, End Date/Time. You can preview the generated URL and open it in a new browser tab.

## Stack
- React 19 + TypeScript
- Vite
- Ant Design 5
- Day.js
- SCSS modules

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 if it doesn't open automatically.
3. Build for production:
   ```bash
   npm run build && npm run preview
   ```

## Notes
- Times are converted to UTC in the generated links, which is what Google/Outlook expect for deep-link composition.
- "Generate URL" validates required fields and shows the constructed link; "Open in Calendar" opens a new tab directly with the link.
- End time must be after start time.

## Project Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – type check and build
- `npm run preview` – serve production build locally
- `npm run lint` – run ESLint (optional)
- `npm run format` – format with Prettier

