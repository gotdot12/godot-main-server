const express = require("express");
const router = express.Router();
const purchase = require("../models/purchase.model");
const mailer = require("nodemailer");

router.post("/beforePurchase", async (req, res) => {
    const { plan, email, refer, wallet } = req.body;

    try {
        const add = new purchase({ plan, email, refer, wallet });
        const result = await add.save();

        return res.status(200).json({ message: "Purchase data send to DB! 🟢" })
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Some error occurred while setting data into DB! 🔴" });
    }
})

module.exports = router
