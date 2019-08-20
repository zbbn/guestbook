const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const app = express();
var mysql  = require('mysql');

var dbenv = "GCPDB";
if (dbenv == "localDB"){
  // Local DB setup
  var config = require('./config.js');
}
if (dbenv == "GCPDB"){
  // GCP DB setup
  var config = {
      user: process.env.SQL_USER,
      database: process.env.SQL_DATABASE,
      password: process.env.SQL_PASSWORD
  }
  if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
      config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/form.html'));
//  res.send('Hello from App Engine (by Anton)! "en etta"');
});

app.get('/submit', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/form.html'));
});

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
  var name = req.body.name;
  var message = req.body.message;
  console.log({
    name,
    message
  });

  // insert statment
  let connection = mysql.createConnection(config);
  //console.log('INSERT INTO guests(name,message) VALUES (\'' + name + '\',\'' + message + '\')');
  //let sqlSnippet = 'INSERT INTO guests(name,message) VALUES (\'' + name + '\',\'' + message + '\');';

  // execute the insert statment
  connection.query("INSERT INTO guests(name,message) VALUES (?, ?)",
    [
     name,
     message
    ],
    function(error, results) {

    }
);

  //connection.query(sqlSnippet);


  // close connection
  connection.end();

  //res.send('Thanks for your message!');
  res.sendFile(path.join(__dirname, '/views/formConfirmation.html'));

});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
  console.log('DB environment: ' + dbenv);
});
