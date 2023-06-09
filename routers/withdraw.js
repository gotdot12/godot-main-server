const express = require("express");
const router = express.Router();
const withdrawIt = require("../models/withdraw.model");
const withdrawHistoryIt = require("../models/wHistory.model");
const user = require("../models/user.model");

router.post("/withdrawalRequest", async (req, res) => {
    const { plan, email, name, wallet, amount } = req.body;

    try {
        const historyAdd = new withdrawIt({ plan, email, name, wallet, amount });
        const historyResult = await historyAdd.save();
        const firstUser = await user.findOneAndUpdate({ email: email }, { $set: { "pendingBalance": amount, "holdTransaction": 1 } }, { new: true });

        return res.status(200).json({ message: "Withdraw request data send to DB! 🟢", status: 200 })
    } catch (error) {
        console.log(error);
        return res
            .status(401)
            .json({ message: "Some error occurred while setting Withdraw request data into DB! 🔴", status: 401 });
    }
})

router.post("/removeHolding", async (req, res) => {
    const { email } = req.body;

    try {
        const firstUser = await user.findOneAndUpdate({ email: email }, { $set: { "holdingDate": "" } }, { new: true });

        return res.status(200).json({ message: "Withdraw request data send to DB! 🟢", status: 200 })
    } catch (error) {
        console.log(error);
        return res
            .status(401)
            .json({ message: "Some error occurred while setting Withdraw request data into DB! 🔴", status: 401 });
    }
})

router.get("/getWithdrawalList", async (req, res) => {
    try {
        const findUser = await withdrawIt.find();
        return res.json({ message: "User detail is sent! 🟢", user: findUser })
    } catch (error) {
        console.log(error);
        return res
            .status(401)
            .json({ message: "Some error occurred while setting Withdraw request data into DB! 🔴", status: 401 });
    }
})

router.get("/getAllWithdrawals", async (req, res) => {
    try {
        const findUser = await withdrawHistoryIt.find();
        return res.json({ message: "User detail is sent! 🟢", user: findUser })
    } catch (error) {
        console.log(error);
        return res
            .status(401)
            .json({ message: "Some error occurred while setting Withdraw request data into DB! 🔴", status: 401 });
    }
})

router.post("/getWithdrawalListOfPerson", async (req, res) => {
    const { email } = req.body;

    try {
        const findUser = await withdrawHistoryIt.find({ email: email });
        return res.json({ message: "User detail is sent! 🟢", user: findUser })
    } catch (error) {
        console.log(error);
        return res
            .status(401)
            .json({ message: "Some error occurred while setting Withdraw request data into DB! 🔴", status: 401 });
    }
})

router.post("/approveWithdrawalRequest", async (req, res) => {
    const { plan, email, name, wallet, amount } = req.body;

    var date = new Date(new Date().setDate(new Date().getDate() + 7));
    var stringDate = JSON.stringify(date);
    var dateString = stringDate.split("T");
    var realDateString = dateString[0].replace('"', '');


    try {
        const deleteIt = await withdrawIt.deleteOne({ email: email });

        const historyAdd = new withdrawHistoryIt({ plan, email, name, wallet, amount });
        const historyResult = await historyAdd.save();

        const findUser = await user.findOne({ email: email });

        const paidBalance = findUser.paidBalance + amount;
        console.log(realDateString);


        const firstUser = await user.findOneAndUpdate({ email: email }, { $set: { "pendingBalance": 0, "holdTransaction": 0, "paidBalance": paidBalance, "holdingDate": realDateString } }, { new: true });

        return res.status(200).json({ message: "Withdraw request data send to DB! 🟢", status: 200 })
    } catch (error) {
        console.log(error);
        return res
            .status(401)
            .json({ message: "Some error occurred while setting Withdraw request data into DB! 🔴", status: 401 });
    }
})

router.post("/wdecline", async (req, res) => {
    const { email } = req.body;

    try {
        const deleteIt = await withdrawIt.deleteOne({ email: email });
        const firstUser = await user.findOneAndUpdate({ email: email }, { $set: { "pendingBalance": 0, "holdTransaction": 0 } }, { new: true });
        return res.status(200).json({ message: "Withdraw decline is updated! 🟢", status: 200 })
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Some error occurred while declining the payment! 🔴" });
    }
})

// router.post("/demo", async (req, res) => {
//     const { email } = req.body;

//     try {
//         const firstUser = await user.updateMany({ }, { $set: { "pendingBalance": 0, "holdTransaction": 0, "holdingDate" : "" } }, { new: true });
//         console.log("YESS");
//         return res.status(200).json({ message: "USER DB is updated! 🟢", status: 200 })
//     } catch (error) {
//         return res
//             .status(401)
//             .json({ message: "Some error occurred while declining the payment! 🔴" });
//     }
// })

module.exports = router
