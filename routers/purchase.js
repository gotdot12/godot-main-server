const express = require("express");
const router = express.Router();
const user = require("../models/user.model");
const purchase = require("../models/purchase.model");
const history = require("../models/history.model");


router.post("/purchase", async (req, res) => {
    const { plan, email, refer, wallet } = req.body;

    var planRate = 0;

    switch (plan) {
        case "Basic":
            planRate = 20;
            break;
        case "Bronze":
            planRate = 50;
            break;
        case "Silver":
            planRate = 100;
            break;
        case "Gold":
            planRate = 200;
            break;
        case "Platinum":
            planRate = 500;
            break;
    }

    try {
        const historyAdd = new history({ plan, planRate, email, refer, wallet });
        const historyResult = await historyAdd.save();
        const deleteIt = await purchase.deleteOne({ refer: refer });
        const fetchUser = await user.findOne({ email: email });

        let userName = fetchUser.fname;

        if (refer) {
            const commissionRate = [10, 5, 3, 2, 2];

            let referCountUser = fetchUser.referredBy;
            const tempConditionCommissionRate = commissionRate.splice(0, referCountUser.length);
            const conditionCommissionRate = tempConditionCommissionRate.reverse();

            if (referCountUser.length > 5) {
                referCountUser = referCountUser.slice(referCountUser.length - 5, referCountUser.length);
            }

            const plans = await user.findOneAndUpdate({ email: email }, { $push: { currentPlans: plan } }, { new: true });

            for (let i = conditionCommissionRate.length - 1; i >= 0; i--) {
                const newCommissionDetails = [
                    {
                        plan: plan,
                        commission: (planRate * conditionCommissionRate[i]) / 100
                    }
                ]

                console.log(conditionCommissionRate[i], referCountUser[i]);

                const firstUser = await user.findOneAndUpdate({ referCode: referCountUser[i] }, { $push: { "commissionDetail": newCommissionDetails } }, { new: true });

            }

            // email sending

            const sender = () => {
                const emailTemplate = `<div style="background-color:#170f1e;color:#fff;padding:1.5rem;border-radius:10px">
            <img style="width:40%;height:4rem" src="cid:img" alt="" data-image-whitelisted="" class="CToWUd" data-bit="iit"> 
            <h2 style="font-family:Gill Sans;font-weight:500">Dear ${userName},</h2>
            <h3 style="font-family:Gill Sans;font-weight:400">Your order is verified.</h3>
            <br/>
            <a href=${'www.godotnetwork.com/dashboard?email=' + email} style="background: linear-gradient(to right, #CFA911 0%, #CF1512 100%);border-radius:4px;color:#fff;font-family:Gill Sans;font-weight:700;outline:none;padding:1rem 2rem;text-decoration:none;width:8rem" target="_blank">Register Now</a>  
            <br/>
            <h4 style="font-family:Gill Sans;font-weight:400; line-height: 1.5rem;">Regards<br/>Team GoDot<br/>Thank You</h4>
            </div>`;

                const transporter = mailer.createTransport({
                    service: "gmail",

                    auth: {
                        user: process.env.user,
                        pass: process.env.pass
                    }
                });

                const mailOption = {
                    from: process.env.user,
                    to: elem.email,
                    subject: "Order verified sucessfully",
                    html: emailTemplate,
                    text: emailTemplate,
                    attachments: [{
                        filename: 'img.png',
                        path: __dirname + '/assets/logo.png',
                        cid: 'img'
                    }]
                }

                transporter.sendMail(mailOption, async (error, info) => {
                    return error ? (res.json({ message: "Error happen while send emails to the user!!! 🔴" })) : console.log(info)
                })
            }

            // sender();


            return res.status(200).json({ message: "Plan is updated! 🟢", status: 200 })
        } else {
            const plans = await user.findOneAndUpdate({ email: email }, { $push: { currentPlans: plan } }, { new: true });
            // sender();
            return res.status(200).json({ message: "Plan is updated! 🟢", status: 200 })
        }
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Some error occurred while updating the course! 🔴" });
    }
})

router.post("/afterPurchase", async (req, res) => {
    const { item, id } = req.body;

    try {
        const plans = await user.findOneAndUpdate({ name: id }, { $push: { currentPlans: item } }, { new: true });
        return res.status(200).json({ message: "Plan is updated! 🟢" })
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Some error occurred while updating the course! 🔴" });
    }
})

router.post("/decline", async (req, res) => {
    const { email } = req.body;

    try {
        const deleteIt = await purchase.deleteOne({ email: email });
        return res.status(200).json({ message: "Payment decline is updated! 🟢", status: 200 })
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Some error occurred while declining the payment! 🔴" });
    }
})

router.post("/getAllPurchase", async (req, res) => {
    try {
        const findUser = await history.find();
        return res.json({ message: "User detail is sent! 🟢", user: findUser })
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Some error occurred while fetching user! 🔴" });
    }
})

router.post("/getOrderList", async (req, res) => {
    try {
        const findUser = await purchase.find();
        return res.json({ message: "User detail is sent! 🟢", user: findUser })
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Some error occurred while fetching user! 🔴" });
    }
})

module.exports = router