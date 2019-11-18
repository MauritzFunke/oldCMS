const express = require('express');
const router = require('express').Router();
const passport = require('passport');
const userTables = require('../models/user-model')

// Static css
router.use('/css', express.static('./views/css'));

// Static images
router.use('/css', express.static('./views/images'));

const authCheck = (req, res, next) => {
    if (!req.user) {
        // If user is not logged in
        res.redirect('/auth/login');
    } else if (!req.user.isAdmin) {
        res.redirect('/');
    } else {
        next();
    }
}

// Login Route
router.get('/', authCheck, (req, res) => {
    userTables.find({}, (err, user) => {
        res.render('addadmin', {
            user: req.user,
            userTable: user
        });
    })

});




router.get('/add', authCheck, (req, res) => {
    userTables.findOne({ _id: req.query.id }).then((currentUser) => {
        if (currentUser) {
            var upsertData = currentUser.toObject();

            delete upsertData._id;

            upsertData.isAdmin = true;


            userTables.findOneAndUpdate({ _id: req.query.id }, upsertData).then(() => {
                console.log(currentUser);
                res.redirect('/addadmin');
            })
        } else {
            console.log('Wrong User');
            res.redirect('/cms');
        }
    });
})
router.get('/remove', authCheck, (req, res) => {
    userTables.findOne({ _id: req.query.id }).then((currentUser) => {
        if (currentUser) {
            var upsertData = currentUser.toObject();

            delete upsertData._id;

            upsertData.isAdmin = false;


            userTables.findOneAndUpdate({ _id: req.query.id }, upsertData).then(() => {
                console.log(currentUser);
                res.redirect('/addadmin');
            })
        } else {
            console.log('Wrong User');
            res.redirect('/cms');
        }
    });
})


module.exports = router;