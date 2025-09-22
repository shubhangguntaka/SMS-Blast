// Backend server using sms.js logic, now with HTTP POST endpoint
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { startsmsprocessing } = require('./sms');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// HTTP POST endpoint for sending SMS
app.post('/send-sms', async (req, res) => {
  try {
    // Prepare a fake WebSocket-like object for compatibility
    const ws = {
      send: (msg) => {
        try {
          const data = JSON.parse(msg);
          if (data.error) {
            res.status(400).json(data);
          } else {
            res.json(data);
          }
        } catch {
          res.status(500).json({ error: true, message: 'Internal error' });
        }
      }
    };
    // Pass the request body as a JSON string
    await startsmsprocessing(JSON.stringify(req.body), ws, /* db connection here */);
  } catch (err) {
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend HTTP server running on http://localhost:${PORT}`);
});
