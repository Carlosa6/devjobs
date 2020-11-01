const mongoose = require('mongoose');
require('dotenv').config({path:'variables.env'});

mongoose.connect(process.env.DATABASE,
     {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:true,
        useCreateIndex:true
    });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('DB is connected');
});

//importar el modelo
require('../models/Usuarios');
require('../models/Vacantes');
