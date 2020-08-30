const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const posts = {};

const handleEvent = (type, data) => {
  console.log(`Event Received: ${type}`);
  switch (type) {
    case 'PostCreated': {
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
      break;
    }
    case 'CommentCreated': {
      const { id, content, postId, status } = data;
      posts[postId].comments.push({ id, content, status });
      break;
    }
    case 'CommentUpdated': {
      const { id, content, postId, status } = data;

      const comments = posts[postId].comments;
      const comment = comments.find(c => c.id === id);
      comment.status = status;
      comment.content = content;
      break;
    }
    default: break;
  }
};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send('OK');
});

app.listen(4002, async () => {
  console.log('query - listening on port 4002');
  const res = await axios.get('http://event-bus-srv:4005/events');

  for (let event of res.data) {
    handleEvent(event.type, event.data);
  }
});