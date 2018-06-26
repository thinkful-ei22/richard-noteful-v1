'use strict';

// Load array of notes
const data = require('./db/notes');

const express = require('express');

const { PORT } = require('./config');

const app = express();

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...


app.get('/api/notes', (req, res) => {
  const {searchTerm} = req.query;
  if (searchTerm) {
    let list = data.filter(note => note.title.includes(searchTerm)||note.content.includes(searchTerm));
    res.json(list);
  } else {
    res.json(data);
  }
});

app.get('/api/notes/:id' , (req, res) => {
  const foundData = data.find(item => item.id === Number(req.params.id));
  res.json(foundData);
});


// ADD STATIC SERVER HERE

app.use(express.static('public'));

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
