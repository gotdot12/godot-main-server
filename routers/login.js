const express = require("express");
const router = express.Router();
const user = require("../models/user.model");


router.post("/login", async (req, res) => {
    const { email, password } = req.body;


    if (!email || !password) {
        res.status(422).json({ error: "Please Fill All Required Feilds" })
    } else {
        const fetchUser = await user.findOne({ email: email });

        if (fetchUser.password == password) {
            res.status(200).json({ error: "User Exist" });
        } else {
            res.status(422).json({ error: "User Not Exist" });
        }
    }
})

module.exports = router