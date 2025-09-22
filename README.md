
# SMS Blast

> Bulk SMS sender app with beautiful iOS-style UI components, built using React Native, Expo, and Firebase.

## Features

- Send bulk SMS messages quickly and securely
- Modern iOS-inspired UI (using `react-native-ios-kit` and iOS icons)
- User authentication and profile management
- Dark mode support
- Local SMS history
- Customizable message and count
- Backend Node.js server for SMS simulation

## Screenshots

<p align="center">
  <img src="assets/images/icon.png" alt="App Icon" width="100" />
</p>

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the app:**
   ```sh
   npx expo start
   ```
3. **(Optional) Start backend for SMS simulation:**
   ```sh
   cd backend
   npm install
   npm start
   ```

## Folder Structure

- `app/` — Main React Native app code (iOS UI components)
- `backend/` — Node.js backend for SMS simulation
- `assets/` — Images and fonts

## Customization

- Replace app icons and splash images in `assets/images/`
- Update Firebase config in `firebaseConfig.js`

## Tech Stack

- React Native + Expo
- react-native-ios-kit (iOS UI components)
- Firebase Auth & Storage
- Node.js (backend)

## License

MIT
