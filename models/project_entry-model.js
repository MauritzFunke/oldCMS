const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectTableSchema = new Schema({
    project: String,
    description: String,
    time: String
});

const project = mongoose.model('project', projectTableSchema);

module.exports = project;