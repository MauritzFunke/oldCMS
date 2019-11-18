const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillTableSchema = new Schema({
    skill: String,
    time: String,
    level: String
});

const skill = mongoose.model('skill', skillTableSchema);

module.exports = skill;