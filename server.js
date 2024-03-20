const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./Model/http-error');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const server = express();
server.use(bodyParser.json());
// server.use(cors({
//     origin: 'http://localhost:3000',
//     methods: 'GET,POST,PUT,DELETE, OPTION',
//     allowedHeaders: 'Content-Type,Authorization'
// }));

const url = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.cwqmkab.mongodb.net/${process.env.COLLECTION_NAME}?retryWrites=true&w=majority`;

const productsRoutes = require('./Route/products-routes');
const usersRoutes = require('./Route/users-routes');

// server.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//     );
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

//     next();
// });

const allowedOrigins = ['http://localhost:3000/', 'http://example2.com'];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

server.use(cors(corsOptions));

server.use('/api/products', productsRoutes);
server.use('/api/users', usersRoutes);

server.use((req, res, next) => {
    const error = new HttpError('Could not find this routessssssss', 404)
    throw (error);
});

server.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'an Unknown error occur' })
});

mongoose
    .connect(url)
    .then(() => {
        server.listen(process.env.PORT || 6000);
    })
    .catch(err => {
        // console.log(err);
        console.log('not connected');
    });
