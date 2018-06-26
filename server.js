'use strict';

// Load array of notes
const data = require('./db/notes');
const simDB = require('./db/simDB');  // <<== add this
const notes = simDB.initialize(data); // <<== and this

const express = require('express');

const { simpleLogger } = require('./middleware/logger');

const { PORT } = require('./config');

const app = express();

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

app.use(simpleLogger);

app.use(express.static('public'));

app.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  });
});

app.get('/api/notes/:id' , (req, res) => {
  const foundData = data.find(item => item.id === Number(req.params.id));
  res.json(foundData);
});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

// ADD STATIC SERVER HERE


app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
