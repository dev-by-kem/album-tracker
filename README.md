# Album Tracker

Album Tracker is a React web app for finding albums, playing available 30-second previews, and saving a personal music collection. Users can track listening status, add ratings and notes, and receive LLM-powered recommendations based on the user's saved albums and ratings.

**Live demo:** https://album-tracker-nu.vercel.app/

## Screenshots

### Search results

![Search results](docs/screenshots/01-search-results.png)

### Album page

![Album page](docs/screenshots/02-album-page.png)

### Recommendations

![Recommendations](docs/screenshots/03-recommendations.png)

## Features

- Search albums by title or artist.
- View album details, tracks, and available iTunes previews.
- Save albums, set listening status, rate them, and add notes.
- Filter, search, sort, export, and import the saved collection.
- Get Gemini-based recommendations after saving at least three albums.
- Switch between light and dark themes.

## Tech stack

- React and Vite
- React Context API and `localStorage`
- iTunes Search API
- Deezer API and widget
- Google Gemini API
- Vercel for deployment

## Run locally

1. Clone the repository and open the project folder:

   ```bash
   git clone https://github.com/dev-by-kem/album-tracker.git
   cd album-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` beside `package.json`:

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

## Limitations

- The collection is saved only in the current browser and device.
- iTunes previews are limited to about 30 seconds and are not available for every track.
- Deezer playback depends on album availability and the user's Deezer login.
- Recommendations require internet access, a Gemini API key, and at least three saved albums.

## Privacy and disclaimer

The recommendation feature sends saved album titles, artists, ratings, and listening statuses to Gemini. Personal notes are not sent. This student project is not affiliated with Apple, Spotify, Deezer, Google, or Vercel.
