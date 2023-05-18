const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    plan: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
    },
    refer: {
        required: true,
        type: String,
    },
    wallet: {
        required: true,
        type: String,
    },
});

const userModel = new mongoose.model("PURCHASE", userSchema);

module.exports = userModel;