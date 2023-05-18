const express = require("express");
const router = express.Router();
const user = require("../models/user.model");


router.post("/refer", async (req, res) => {
    const { plan, id } = req.body;

    try {
        const plans = await user.findOneAndUpdate({ name: id }, { $push: { currentPlans: plan } }, { new: true });
        return res.status(200).json({ message: "Plan is updated! 🟢" })
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Some error occurred while updating the course! 🔴" });
    }
})

module.exports = router