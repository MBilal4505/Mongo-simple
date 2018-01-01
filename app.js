const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const users = require('./routes/users');
const config = require('./config/database');

mongoose.Promise = global.Promise;
//Connect to database
mongoose.connect(config.database);
//on Connection
mongoose.connection.on('connected', () =>{
console.log('connected to database' +config.database);
});
//Database error
mongoose.connection.on('error', (err) =>{
console.log('Database error' +err);
});
const app = express();

const port = 3000;
//Cors middleware
app.use(cors());

//Body Parser
app.use(bodyParser.json());
//Passport
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
// Set Static Folder
app.use(express.static(path.join(__dirname,'public')));
//Users 
app.use('/users', users);

//Start Server
app.listen(port, () => {
console.log('Server started on port',+port);
});

//Index Route
app.get('/',  (req, res) => {
res.send('Invalid Endpoint');
});