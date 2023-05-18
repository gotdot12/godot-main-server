const express = require("express");
const router = express.Router();
const user = require("../models/user.model");
const shortid = require('shortid');



router.post("/register", async (req, res) => {
    const { fname, email, password, referred } = req.body;
    const referCodet = shortid.generate();
    const referCode = referCodet.substring(0, 8);

    console.log(fname, email, password, referred);

    if (!fname || !email || !password) {
        res.status(422).json({ error: "Please Fill All Required Feilds" })
    } else {

        const fetchUser = await user.findOne({ email: email });

        if (fetchUser) {
            res.status(422).json({ error: "User Already Registered" });
        } else {
            const fetchReferUser = await user.findOne({ referCode: referred });

            const newBalance = fetchReferUser.currentBalance + 1000;

            const firstUser = await user.findOneAndUpdate({ referCode: referred }, { $set: { "currentBalance": newBalance } }, { new: true });

            const refeeredPersonsList = fetchReferUser.referredBy;

            refeeredPersonsList.push(referred);

            const referredBy = refeeredPersonsList;

            const currentBalance = 10000;

            const add = new user({ name: fname, email, password, referCode, currentBalance, referredBy });

            const result = await add.save();

            if (result) {
                res.status(200).json({ message: "User Registered" });
            } else {
                res.status(422).json({ error: "Error Occurred in Adding User" });
            }
        }
    }
})

module.exports = router



// else if (referred == "") {
        //     const currentBalance = 10000;

        //     const add = new user({ name: fname, email, password, currentBalance });

        //     const result = await add.save();

        //     if (result) {
        //         res.status(200).json({ message: "User Registered" });
        //     } else {
        //         res.status(422).json({ error: "Error Occurred while Adding User" })
        //     }
        // } 