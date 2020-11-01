const mongoose = require('mongoose');
require('./config/db');

const express = require('express')
const exphbs = require('express-handlebars');
const path = require('path');
const router = require('./routes');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const passport = require('./config/passport');

const app = express()

app.set('view engine','handlebars');

require('dotenv').config({path:'variables.env'});

//habilitar handlebar como view
app.engine('handlebars',
    exphbs({
        defaultLayout: 'layout',
        helpers: require('./helpers/handlebars'),
        partialsDir:path.join(app.get('views'),'partials')
    })
);

app.set('views', path.join(__dirname,'views'));
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave:true,
    saveUninitialized:true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

//inicializar passport
app.use(passport.initialize());
app.use(passport.session());

//alertas y flash messages
app.use(flash());

//crear el middleware
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

app.use('/', router());

//static files
app.use(express.static(path.join(__dirname,'public')));

app.listen(process.env.PUERTO, () => console.log(`Example app listening on port 5000!`))
