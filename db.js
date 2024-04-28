const mysql = require('mysql');
const config = require('./config');
const dbConfig = process.env.NODE_ENV === 'production' ? config.production : config.development;

const connection = mysql.createConnection(dbConfig);

module.exports = connection;