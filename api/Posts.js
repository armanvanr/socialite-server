const express = require('express');
const posts = express.Router()
const ObjectID = require('mongoose');
const path = require('path');
const fs = require('fs');

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
        let imageUrl = '';

        if (image) {
            let buff = new Buffer(image.split('base64,')[1], 'base64');
            let date = new Date().toISOString();
            let filename = userId.toString() + '_' + date;
            let mimeType = image.match(/[^:/]\w+(?=;|,)/)[0];
            let dir = path.join(__dirname, "../assets/uploads/posts/" + filename + '.' + mimeType);

            console.log('dir :', dir)
            imageUrl = "/assets/uploads/posts/" + filename + '.' + mimeType;
            console.log('imageUrl :', imageUrl)
            console.log('buff :', buff)
            console.log('base64 :', image)
            fs.writeFileSync(dir, buff)
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
        const Posts = await Post.find()
        const Users = await User.find()

        Posts.map(post => {
            Users.map(user => {
                if (post.user_id.toString() == user._id.toString()) {
                    postData.push({
                        userId: post.user_id,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        content: post.content,
                        image: post.image,
                    })
                }
            })
        });
        res.status(200).json({ posts: postData })

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

posts.delete('/posts', async (req, res) => {
    try {
        const { _id } = req.body;
        Post.deleteOne({ "_id": _id })
        res.status(200).json({ message: 'Your post was deleted' })
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})
module.exports = posts;
