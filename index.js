//Main starting point of the API Server
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const router = require('./router/router');
const config = require('./config/config');
const cors = require('cors');

//DB Setup
mongoose.connect(config.mongoURI, {useNewUrlParser: true})

//App Setup
app.use(morgan('combined'));
//CORS
app.use(cors());

app.use(bodyParser.json({type: '*/*'}));

//Router Setup
router(app);

//Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log(`localhost:${port}`);