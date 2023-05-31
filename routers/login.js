const express = require("express");
const router = express.Router();
const user = require("../models/user.model");


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(422).json({ error: "Please Fill All Required Feilds" })
    } else {
        const fetchUser = await user.findOne({ email: email });

        if (fetchUser) {
            if (fetchUser.password == password) {
                if (fetchUser.verifyCode != 0) {
                    res.status(421).json({ error: "Verify Email" });
                } else {
                    res.status(200).json({ error: "User Exist", user: fetchUser });
                }
            } else {
                res.status(422).json({ error: "User Not Exist" });
            }
        } else {
            res.status(422).json({ error: "User Not Exist" });
        }
    }
})

module.exports = router
