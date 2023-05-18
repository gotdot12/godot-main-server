const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    withdrawDetail: [
        {
            id: {
                type: String,
            },
            amount: {
                type: Number,
            },
            time: {
                type: String,
            },
            currentStatus: {
                type: Boolean,
            }
        }
    ]
});

const userModel = new mongoose.model("WITHDRAWAL", userSchema);

module.exports = userModel;