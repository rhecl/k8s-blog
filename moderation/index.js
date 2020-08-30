const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  console.log(`Event Received: ${type}`);
  switch (type) {
    case 'CommentCreated': {
      const status = data.content.includes('orange') ? 'rejected' : 'approved';
      const moderatedComment = { ...data, status };
      await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentModerated',
        data: moderatedComment,
      });
      break;
    }
    default: break;
  }

  res.send('OK');
});

app.listen(4003, () => { console.log('moderation - listening on port 4003'); });