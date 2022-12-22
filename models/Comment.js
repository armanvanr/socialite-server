const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            min: 2,
        },
        upvotes: {
            type: Number,
            default: 0,
        },
        downvotes: {
            type: Number,
            default: 0,
        },
        replies: {
            type: Number,
            default: 0,
        },
        post_id:mongoose.Types.ObjectId,
        user_id: mongoose.Types.ObjectId,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);