const express = require('express');
const posts = express.Router()
const ObjectID = require('mongoose');

const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Post = require('../models/Post');
const User = require('../models/User');
posts.use(cors());

posts.post('/posts', async (req, res) => {
    try {
        const { content, image, userId } = req.body;
        let imageUrl;
        if (image) {
            let buff = new Buffer(image.split('base64,')[1], 'base64');
            let filename = userId.toString() + Date.now();
            // console.log(filename)
            const baseImage = { profilepic: image };
            let mimeType = baseImage.profilepic.match(/[^:/]\w+(?=;|,)/)[0];
            // console.log(mimeType)
            let dir = path.join(__dirname, "../assets/uploads/posts/" + filename + '.' + mimeType);
            fs.writeFileSync(dir, buff)
            imageUrl = "/uploads/posts/" + filename + '.' + mimeType;
        }

        const postData = new Post({
            content,
            image: imageUrl,
            user_id: userId,
        });
        console.log(postData);
        postData.save()
            .then(post => {
                res.json({ message: 'Your post was sent' });
            })
            .catch(err => {
                res.send(err);
            });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


posts.get('/posts', async (req, res) => {
    try {
        let postData = []
        const posts = await Post.find()

        const users = await User.find()
        posts.map(post => {
            users.map(user => {
                if (post.user_id.toString() == user._id.toString()) {
                    postData.push({
                        firstName: user.first_name,
                        lastName: user.last_name,
                        content: post.content,
                        image: post.image,
                    })
                }
            })
        });
        res.status(200).json({ postData })

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

posts.get('/postss', async (req, res) => {
    result = await User.findById("63a2a6841cd536c56f99d9e5")
    console.log('result', result)
})
module.exports = posts;
