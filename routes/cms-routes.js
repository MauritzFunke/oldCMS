const express = require('express');
const router = require('express').Router();
const projectTables = require('../models/project_entry-model');
const skillTables = require('../models/skill_entry-model');

// Static css
router.use('/css', express.static('./views/css'));

// Static images
router.use('/css', express.static('./views/images'));


const authCheck = (req,res,next) => {
    if(!req.user) {
        // If user is not logged in
        res.redirect('/auth/login');
    } else if(!req.user.isAdmin){
        res.redirect('/');
    } else {
        next();
    }
}

router.get('/', authCheck, (req,res) => {
    projectTables.find({}, (err, project) => {
        skillTables.find({}, (err, skill) => {
            res.render('cms', { user: req.user,
                                projects: project,
                                skills: skill});
        });
    });
});

router.get('/newProject', authCheck, (req,res) => {
    new projectTables({
        project: req.query.name,
        description: req.query.description,
        time: req.query.time
    }).save().then((newTable) => {
        res.redirect('/cms');
    });

});
router.get('/removeProject', authCheck, (req,res) => {
    projectTables.findOne({_id: req.query.id}).then((currentTable) => {
        if(currentTable) {
            console.log(currentTable);
            projectTables.remove({_id: req.query.id}).then(() => {
                res.redirect('/cms');
            })
        } else {
            console.log('Wrong Table');
            res.redirect('/cms');
        }
    });
});
router.get('/newSkill', authCheck, (req,res) => {
    new skillTables({
        skill: req.query.name,
        time: req.query.time,
        level: req.query.level
    }).save().then((newTable) => {
        res.redirect('/cms');
    });

});
router.get('/removeSkill', authCheck, (req,res) => {
    skillTables.findOne({_id: req.query.id}).then((currentTable) => {
        if(currentTable) {
            console.log(currentTable);
            skillTables.remove({_id: req.query.id}).then(() => {
                res.redirect('/cms');
            })
        } else {
            console.log('Wrong Table');
            res.redirect('/cms');
        }
    });
});
module.exports = router;