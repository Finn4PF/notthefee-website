# NotTheFee Website

A company calendar and event management website for 4Pillar Funding.

## Features

- Staff authentication with Google (restricted to @4pillarfunding.com emails)
- Interactive calendar with event display
- Event submission system
- Responsive design

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Generate Firebase config: `npm run generate-config`
5. Start local server: `npm start`

## Deployment

Deploy to Firebase hosting with: `npm run deploy`

## Structure

- `index.html` - Main landing page
- `calendar.html` - Calendar view
- `auth.html` - Staff authentication
- `js/calendar.js` - Calendar functionality
- `scripts/generate-config.js` - Firebase config generator