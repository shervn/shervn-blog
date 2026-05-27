const path = require('path');
const express = require('express');

module.exports = function(app) {
  app.use('/data', express.static(path.resolve(__dirname, '../../media/data')));
  app.use('/images', express.static(path.resolve(__dirname, '../../media/images')));
};