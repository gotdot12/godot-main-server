const express = require("express");
const router = express.Router();
const user = require("../models/user.model");


router.post("/getUser", async (req, res) => {
    const { email } = req.body;

    try {
        const findUser = await user.findOne({ email: email });
        const planArray = findUser.currentPlans;
        return res.json({ message: "User detail is sent! 🟢", user: findUser, plans: planArray })
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Some error occurred while fetching user! 🔴" });
    }
})

router.post("/getAllUser", async (req, res) => {
    try {
        const findUser = await user.find();
        return res.json({ message: "User detail is sent! 🟢", user: findUser })
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Some error occurred while fetching user! 🔴" });
    }
})

module.exports = router