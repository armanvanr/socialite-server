const express = require('express');
const users = express.Router()

const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
users.use(cors());

users.post('/register', (req, res) => {

    User.findOne({ email: req.body.email, })
        .then(user => {
            if (!user) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    const userData = new User({
                        first_name: req.body.firstName,
                        last_name: req.body.lastName,
                        email: req.body.email,
                        password: hash,
                    });
                    userData.save()
                        .then(user => {
                            res.json({ message: `${user.email} registered successfully` });
                        })
                        .catch(err => {
                            res.send(err);
                        });
                });
            } else {
                res.status(400).json({ message: 'User already exists' });
            }
        })
        .catch(err => {
            res.send(err);
        })
});

users.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const resultUser = await User.findOne({ email: email });
        if (!resultUser) return res.status(400).json({ message: "User does not exist." });

        const isMatch = await bcrypt.compare(password, resultUser.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

        const token = jwt.sign({ email: resultUser.email, }, process.env.JWT_SECRET_KEY, { expiresIn: '10 seconds' });
        
        const user = {
            userId: resultUser._id,
            firstName: resultUser.first_name,
            lastName: resultUser.last_name,
            email: resultUser.email,
            avatar: resultUser.avatar,
            friends: resultUser.friends,
        };
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = users;