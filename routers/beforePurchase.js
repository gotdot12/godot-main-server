const express = require("express");
const router = express.Router();
const purchase = require("../models/purchase.model");
const mailer = require("nodemailer");

router.post("/beforePurchase", async (req, res) => {
    const { plan, email, name, refer, wallet } = req.body;

    try {
        const add = new purchase({ plan, email, refer, wallet });
        const result = await add.save();

        // const emailTemplate = `<div style="background-color:#170f1e;color:#fff;padding:1.5rem;border-radius:10px">
        //     <img style="width:40%;height:4rem" src="cid:img" alt="" data-image-whitelisted="" class="CToWUd" data-bit="iit"> 
        //     <h2 style="font-family:Gill Sans;font-weight:500">Dear ${name},</h2>
        //     <h3 style="font-family:Gill Sans;font-weight:400">Your order is under review please shit back and have a cup of tea, we'll send you the confirmation email when your payment gets verified.</h3>
        //     <br/>
        //     <h4 style="font-family:Gill Sans;font-weight:400; line-height: 1.5rem;">Regards<br/>Team GoDot<br/>Thank You</h4>
        //     </div>`;

        // const transporter = mailer.createTransport({
        //     service: "gmail",

        //     auth: {
        //         user: process.env.user,
        //         pass: process.env.pass
        //     }
        // });

        // const mailOption = {
        //     from: process.env.user,
        //     to: elem.email,
        //     subject: "Regarding your order on GODOT Network",
        //     html: emailTemplate,
        //     text: emailTemplate,
        //     attachments: [{
        //         filename: 'img.png',
        //         path: __dirname + '../assets/logo.png',
        //         cid: 'img'
        //     }]
        // }

        // transporter.sendMail(mailOption, async (error, info) => {
        //     return error ? (console.log(error), res.json({ message: "Error happen while send emails to the user!!! 🔴" })) : console.log(info)
        // })


        return res.status(200).json({ message: "Purchase data send to DB! 🟢" })
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Some error occurred while setting data into DB! 🔴" });
    }
})

module.exports = router