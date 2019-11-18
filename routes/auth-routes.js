const express = require('express');
const router = require('express').Router();
const passport = require('passport');

// Static css
router.use('/css', express.static('./views/css'));

// Static images
router.use('/css', express.static('./views/images'));

// Login Route
router.get('/login', (req,res) => {
    res.render('login', { user: req.user});
});

// Logout
router.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/');
    // handle with passport
});

// Login with Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// Callback route for google
router.get('/google/redirect', passport.authenticate('google'), (req,res) => {
    res.redirect('/cms')
});

module.exports = router;