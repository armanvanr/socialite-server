const express = require('express');
const comments = express.Router()
const ObjectID = require('mongoose');

const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Comment = require('../models/Comment');
const User = require('../models/User');
comments.use(cors());

comments.post('/posts/comments/:postId', async (req, res) => {
    try {
        const { content, userId } = req.body;
        const { postId } = req.params
        const commentData = new Comment({
            content,
            user_id:userId,
            post_id:postId,
        });

        console.log(commentData);
        
        commentData.save()
            .then(comment => {
                res.json({ message: 'Your comment was sent' });
            })
            .catch(err => {
                res.send(err);
            });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


comments.get('/posts/comments/:postId', async (req, res) => {
    try {
        let commentData = []
        const Comments = await Comment.find()
        const Users = await User.find()
        const { postId } = req.params

        Comments.map(comment => {    
            Users.map(user => {
                if (comment.user_id.toString() == user._id.toString() && comment.post_id==postId) {
                    commentData.push({
                        firstName: user.first_name,
                        lastName: user.last_name,
                        content: comment.content,
                        upvotes:comment.upvotes,
                        downvotes:comment.downvotes,
                        replies:comment.replies
                    })
                }
            })
        });
        res.status(200).json({ comments: commentData })

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

// comments.get('/postss', async (req, res) => {
//     result = await User.findById("63a2a6841cd536c56f99d9e5")
//     console.log('result', result)
// })
module.exports = comments;