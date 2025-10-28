var config = require('./../config');
var { MongoClient } = require('mongodb');

var databaseUrl = "mongodb+srv://yogi:1234@cluster0.3rtayk3.mongodb.net/teenpatti?retryWrites=true&w=majority";
var dbName = "users"; // Change this to your database name

// MongoDB client options
var clientOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000
};

var client = new MongoClient(databaseUrl, clientOptions);
var db = null;
var isConnecting = false;
var connectionPromise = null;

// Connect to MongoDB
function connectDB() {
  if (connectionPromise) {
    return connectionPromise;
  }
  
  if (db) {
    return Promise.resolve(db);
  }
  
  isConnecting = true;
  connectionPromise = client.connect()
    .then(() => {
      console.log('Connected to MongoDB Atlas');
      db = client.db(dbName);
      isConnecting = false;
      return db;
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      isConnecting = false;
      connectionPromise = null;
      throw err;
    });
  
  return connectionPromise;
}

// Start connecting immediately
connectDB();

var DAL = {
  get db() {
    return db;
  },
  client: client,
  connect: connectDB,
  isConnected: function() {
    return db !== null;
  }
};

module.exports = DAL;