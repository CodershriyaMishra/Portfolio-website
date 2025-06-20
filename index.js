const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const path       = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'response.html'));
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('❌ Please provide name, email, and message.');
  }

  let messages = [];
  const filePath = 'messages.json';

  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath);
    messages = JSON.parse(fileData);
  }

  const newEntry = {
    name,
    email,
    message,
    timestamp: new Date().toISOString()
  };

  messages.push(newEntry);

  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

  res.status(200).send(` Message from ${name} has been received and stored!`);
});

app.listen(PORT, () => {
  console.log(`Backend running at: http://localhost:${PORT}`);
});
