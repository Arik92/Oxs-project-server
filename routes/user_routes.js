const express = require('express');
const jwt = require("jwt-simple");
const bcrypt = require('bcryptjs');
const router = express.Router();
const cfg = require("../config");

const User = require('../models/user').User;

router.post('/add', async (req,res) => {
    const signupName = req.body.username;
    const signupPass = req.body.password;
    try {
        let newUser = new User();
        newUser.username = signupName;
        newUser.password = signupPass;
        await newUser.save();
        res.sendStatus(200);
    } catch(err) {
        console.log('error saving new user ', err);
        res.sendStatus(500);
    }
});

router.post("/token", async (req, res) => {    
        const loginName = req.body.username;
        const loginPass = req.body.password;
        try {
            const authUser = await User.findOne({"username": loginName});
            const isAuthorized = await bcrypt.compare(loginPass, authUser.password);
            if (isAuthorized) {
                const payload = {
                    id: authUser._id                                
                };
                var generatedToken = jwt.encode(payload, cfg.jwtSecret);
                res.json({
                    token: generatedToken
                });
            } else {
                res.sendStatus(401);   
            }
        } catch(userError) {
            console.log('error when getting jwt', userError);
            res.sendStatus(401);
        }       
});

module.exports = router;
