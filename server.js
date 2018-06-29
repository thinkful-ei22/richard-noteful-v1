'use strict';

// Load array of notes

const express = require('express');

const morgan = require('morgan');

const { PORT } = require('./config');

const notesRouter = require('./router/notes.router');

const app = express();

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

app.use(morgan('dev'));

app.use(express.static('public'));

app.use(express.json());

app.use('/api', notesRouter);


app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
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

// Listen for incoming connections
if (require.main === module) {
  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = app; // Export for testing
