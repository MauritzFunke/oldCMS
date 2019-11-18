const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    googleId: String,
    isAdmin: Boolean
});

const User = mongoose.model('user', userSchema);

module.exports = User;