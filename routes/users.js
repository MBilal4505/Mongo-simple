const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Feed = require('../models/feed');

//Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800 //1 week
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                });
            } else {
                return res.json({ success: false, msg: 'Wrong Password' });

            }

        });
    });
});
//Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    // console.log('Req comes here' ,req);
    res.json({ user: req.user });
});
//User Feed Link
router.get('/userfeed/:id', (req, res, next) => {
    const id = req.params;
    //console.log('The id comes here',id);
    Feed.getUserById(id, (err, user_id) => {
        if (err) throw err;
        if (!user_id) {
            return res.json({ success: false, msg: 'User not found' });
        }
        // var resultArray = [];
        // mongo.connect(url, function(err, db) {
        //     assert.equal(null, err);
        //     var cursor = db.collection('feeds').find();
        //     cursor.forEach(function(doc, err) {
        //         assert.equal(null, err);
        //         resultArray.push(doc);
        //     }, function() {
        //         db.close();
        //         res.render('index', { items: resultArray });
        //     });
        // });
    });
});
//Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to register user' });
        } else {
            res.json({ success: true, msg: 'User registered' });
        }

    });
});
//add Link
router.post('/feedform', (req, res, next) => {
    let newLink = new Feed({
        email: req.body.email,
        user_id: req.body.user_id,
        link: req.body.link
    });
    Feed.addLink(newLink, (err, user) => {
        if (err) {
            console.log('User is coming here', err);
            res.json({ success: false, msg: 'Failed to add Link' });
        } else {
            res.json({ success: true, msg: 'Link added' });
        }
    });
});

module.exports = router;