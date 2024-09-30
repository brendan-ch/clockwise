# Clockwise
An app designed to help you focus. Try it here: https://clockwise.bchen.dev

Features:
- Pomodoro timer with customization options and alerts
- To-do list
- Keyboard shortcuts
- Full offline support (including on web!)
- Data exports and imports

## Running the Code Locally
This project was built using Expo and React Native Web. To run the code, you must have Node.js and Yarn installed.

Quick start (doesn't require Vercel account or MongoDB database):
> Note that the background feature will not work if you use this method.
1. Clone the repository using git
2. Run `yarn` to install packages
3. Duplicate the `.env.example` file and rename it to `.env`
4. Fill environment variables with appropriate values (see section below)
5. Run `yarn build-api` to create a local production build
6. Run `npx serve web-build` to host the project locally

## Environment Variables
- `PROD_BUILD`: Link to the production build. This determines the API endpoint on mobile.
- `APP_STORE_LINK`: Link to the App Store page for the app.
- `GOOGLE_PLAY_LINK`: Link to the Google Play page for the app.
