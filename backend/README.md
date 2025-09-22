# SMS Blast Backend

## Setup & Run

1. Open a terminal and navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the backend server:
   ```sh
   npm start
   ```
   The server will run on http://localhost:5000

## How it works
- The backend exposes a POST endpoint at `/send-sms`.
- The frontend sends a request with `{ mobile, count }`.
- The backend simulates sending SMS (see `server.js`).
- For real SMS, add your Twilio credentials and uncomment the Twilio code in `server.js`.

## Testing
- Make sure the backend is running before using the app's Send SMS button.
- The app will alert you with the result after sending.

---
**Note:** This backend is for demo/prank purposes only. Do not use for spamming or without consent.
