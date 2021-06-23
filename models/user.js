const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  // a user has a username and a password
    username: {
      type: String,
      unique: true
    },
    password: String 
});

UserSchema.pre("save", function(next) {
    const user = this;
  
    if (this.isModified("password") || this.isNew) {
      bcrypt.genSalt(10, (saltError, salt) => {
        if (saltError) {
          return next(saltError);
        } else {
          bcrypt.hash(user.password, salt, (hashError, hash) => {
            if (hashError) {
              return next(hashError);
            }
            user.password = hash;
            next();
          })
        }
      })
    } else {
      return next();
    }
  })


const User = mongoose.model('User', UserSchema);
module.exports = {
    User
};
