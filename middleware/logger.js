'use strict';

const simpleLogger = (req, res, next) => {
  const now = new Date();
  console.log(
    `${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${req.method} ${req.url}`
  );
  next();
};


module.exports= {simpleLogger};