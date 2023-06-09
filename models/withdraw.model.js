const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        plan: {
            required: true,
            type: String,
        },
        email: {
            required: true,
            type: String,
        },
        name: {
            required: true,
            type: String,
        },
        wallet: {
            required: true,
            type: String,
        },
        amount: {
            required: true,
            type: Number,
        },
    }, 
    { timestamps: true }
);

const userModel = new mongoose.model("WITHDRAWAL", userSchema);

module.exports = userModel;