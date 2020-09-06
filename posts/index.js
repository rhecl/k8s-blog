const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();

const posts = {};

app.use(cors());
app.use(bodyParser.json());

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = { id, title };

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: { id, title },
  });
  
  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log(`Event Received: ${req.body.type}`);
  res.send('OK');
});

app.listen(4000, () => {
  console.log('v2');
  console.log('posts - listening on port 4000');
});