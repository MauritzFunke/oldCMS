const express = require('express');



// Routes

const authRoutes = require('./routes/auth-routes');

const cmsRoutes = require('./routes/cms-routes');

const contactRoutes = require('./routes/contact-routes');

const addAdminRoutes = require('./routes/admin-routes');



const passportSetup = require('./config/passport-setup');

const mongoose = require('mongoose');

const keys = require('./config/keys');

const cookieSession = require('cookie-session');

const passport = require('passport');

const bodyParser = require('body-parser');



// Models

const projectTables = require('./models/project_entry-model');

const skillTables = require('./models/skill_entry-model');



const app = express();



// View Engine

app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({ extended: true}));

app.use(bodyParser.json());



app.use(cookieSession({

    maxAge: 24 * 60 * 60 * 1000,

    keys: [keys.session.cookieKey]

}));



// Init passport

app.use(passport.initialize());

app.use(passport.session());

app.enable('trust proxy');



// Connect to MongoDB

mongoose.connect(keys.mongodb.dbURI, () => {

    console.log('Connected to Mongodb')

});



// Static css
app.use('/css', express.static('./views/css'));

// Static js
app.use('/js', express.static('./views/js'));

// Set up Routes

app.use('/auth', authRoutes);

app.use('/cms', cmsRoutes);

app.use('/contact', contactRoutes);

app.use('/addadmin', addAdminRoutes);



// Home Route

app.get('/', (req,res) => {

    console.log(req.ips);

    projectTables.find({}, (err, project) => {

        skillTables.find({}, (err, skill) => {

            res.render('home', { user: req.user,

                                projects: project,

                                skills: skill});

        });    

    });

});

// Imprint and ToS

app.get('/imprint', (req, res) => {

    res.render('imprint', {

        user: req.user

    });

})

app.get('/terms', (req, res) => {

    res.render('terms', {

        user: req.user

    });

})



app.listen(1234, () => console.log('App started on port 1234'));
