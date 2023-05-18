const express = require("express");
const router = express.Router();
const user = require("../models/user.model");
const withdrawIt = require("../models/withdraw.model");
const moment = require("moment");


router.post("/withdraw", async (req, res) => {
    const { id, amt } = req.body;

    const date = moment().format('MMMM Do YYYY, h:mm:ss a');;

    let withdrawDetials = [
        {
            amount: amt,
            time: date,
            currentStatus: false
        }
    ]

    const userUpdated = await user.findOneAndUpdate({ name: id }, { $push: { withdrawDetail: withdrawDetials } }, { new: true });

    let withdrawDetial = [
        {
            id,
            amount: amt,
            time: date,
            currentStatus: false
        }
    ]

    const add = new withdrawIt({ withdrawDetail: withdrawDetial });

    const result = await add.save();

    if (result) {
        res.status(200).json({ message: "Withdraw Requested", user: userUpdated });
    } else {
        res.status(422).json({ error: "Error Occurred while Requesting Withdraw" })
    }

})

router.get("/withdrawDetails", async (req, res) => {
    try {
        const findUser = await withdrawIt.find();
        return res.json({ message: "Withdraw detail is sent! 🟢", user: findUser })
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Some error occurred while fetching withdraw details! 🔴" });
    }
})

router.post("/transactIt", async (req, res) => {
    const { elem, type } = req.body;

    if (type) {
        // var someDate = new Date();
        // var numberOfDaysToAdd = 7;
        // var result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
        // var newResult = new Date(result).spl("T");
        // console.log(newResult)

        try {
            const fetchUser = await user.findOne({ name: elem.withdrawDetail[0].id });
            const userUpdated = await user.findOneAndUpdate({ name: elem.withdrawDetail[0].id }, { $set: { paidBalance: fetchUser.paidBalance + elem.withdrawDetail[0].amount } }, { new: true });
            const adimnUpdated = await withdrawIt.findOneAndDelete({ _id: elem._id });
            return res.status(200).json({ message: "Withdraw detail is sent! 🟢", user: adimnUpdated })
        } catch (error) {
            return res
                .status(401)
                .json({ message: "Some error occurred while fetching withdraw details! 🔴" });
        }
    } else {
        try {
            const adimnUpdated = await withdrawIt.findOneAndDelete({ _id: elem._id });
            return res.json({ message: "Withdraw detail is sent! 🟢", user: adimnUpdated })
        } catch (error) {
            return res
                .status(401)
                .json({ message: "Some error occurred while fetching withdraw details! 🔴" });
        }
    }

})

module.exports = router