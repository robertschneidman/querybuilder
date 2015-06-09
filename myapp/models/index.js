'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })

sequelize.sync()

db['User'] = sequelize.define('users', {
  username: {type: Sequelize.STRING, allowNull: false, unique: true },
  password: {type: Sequelize.STRING, allowNull: false }
});

db['Question'] = sequelize.define('questions', {
  question: {type: Sequelize.STRING, allowNull: false, unique: true},
  answer_one: {type: Sequelize.STRING, allowNull: false},
  answer_two: {type: Sequelize.STRING, allowNull: false},
  answer_three: {type: Sequelize.STRING, allowNull: false},
  answer_four: {type: Sequelize.STRING, allowNull: false}
});

db['Response'] = sequelize.define('response', {
  answer: {type: Sequelize.INTEGER, allowNull: false}
});

db['User'].hasMany(db['Response'])
db['Question'].hasMany(db['Response']);
db.sequelize = sequelize;

module.exports = db;