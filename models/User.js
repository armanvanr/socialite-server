const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        last_name: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 5,
        },
        avatar: {
            type: String,
            default: "",
        },
        friends: {
            type: Array,
            default: "",
        },
        location: String,
        occupation: String,
        viewedProfile: Number,
    },
    { timestamps: true }
);

// UserSchema.virtual("user_id").get(function () {
//     return this._id.toHexString();
// });

// UserSchema.set("toJSON", {
//     virtuals: true,
// });

module.exports = mongoose.model("User", UserSchema);