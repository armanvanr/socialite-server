const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            min: 2,
        },
        image: String,
        user_id: mongoose.Types.ObjectId,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);