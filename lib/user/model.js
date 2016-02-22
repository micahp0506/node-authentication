'use strict';


const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const BCRYPT_DIFFICULTY = 11;

const UserSchema = mongoose.Schema({
    email: String,
    password: String
});

// Can not use es6 function, have to use es5, no fat arrows
UserSchema.pre('save', function (next) {
    bcrypt.hash(this.password, BCRYPT_DIFFICULTY, (err, hash) => {
        if (err) throw (err);
        this.password = hash;
        next();
    });
})

module.exports = mongoose.model('Users', UserSchema);
