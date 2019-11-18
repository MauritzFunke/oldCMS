const express = require('express');
const router = require('express').Router();
const request = require('request');
const messageTables = require('../models/message-model');

const keys = require('../config/keys');

// Static css
router.use('/css', express.static('./views/css'));

// Static images
router.use('/css', express.static('./views/images'));


const userCheck = (req, res, next) => {
    if (!req.user) {
        // If user is not logged in
        res.redirect('/auth/login');
    } else if (!req.user.isAdmin) {
        next();
    } else {
        next();
    }
}
const adminCheck = (req, res, next) => {
    if (!req.user) {
        // If user is not logged in
        res.redirect('/auth/login');
    } else if (!req.user.isAdmin) {
        res.redirect('/contact')
    } else {
        next();
    }
}

router.get('/', (req, res) => {
    if (req.user) {

        if (req.user.isAdmin) {
            messageTables.find({}, (err, message) => {
                res.render('contact', {
                    user: req.user,
                    messages: message
                });
            })
        } else {
            res.render('contact', { user: req.user });
        }
    } else {
        res.render('contact', {user: null})
    }
});

router.post('/sendMessage', (req, res) => {
    if (
        req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null
    ) {
        return res.json({ "success": false, "msg": "Please confirm the captcha" });
    }

    // Verify URL
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${keys.captcha.secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

    // Make Request To VerifyURL
    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);

        // If Not Successful
        if (body.success !== undefined && !body.success) {
            return res.json({ "success": false, "msg": "Failed captcha verification" });
        }

        //If Successful
        new messageTables({
            name: req.user.username,
            email: req.body.email,
            message: req.body.message
        }).save().then((newMessage) => {
            return res.json({ "success": true, "msg": "Message send" });
        });
    });
});
router.get('/removeMessage', adminCheck, (req, res) => {
    messageTables.findOne({ _id: req.query.id }).then((currentTable) => {
        if (currentTable) {
            messageTables.remove({ _id: req.query.id }).then(() => {
                res.redirect('/contact');
            })
        } else {
            console.log('Wrong Message');
            res.redirect('/contact');
        }
    });
});
module.exports = router;