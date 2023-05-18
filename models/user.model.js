const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    referCode: {
        require: false,
        type: String,
    },
    currentBalance: {
        required: true,
        type: Number,
    },
    paidBalance: {
        type: Number,
        default: 0
    },
    currentPlans: [String],
    referredBy: [String],
    withdrawButtonTimer: {
        type: String,
        default: ''
    },
    commissionDetail: [
        {
            plan: {
                type: String,
            },
            commission: {
                type: Number,
            }
        }
    ],
    withdrawDetail: [
        {
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
    ],
});

const userModel = new mongoose.model("USERS", userSchema);

module.exports = userModel;