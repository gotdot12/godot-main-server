const express = require("express");
const router = express.Router();
const user = require("../models/user.model");
const shortid = require('shortid');
const mailer = require("nodemailer");

const senderMail = "godotcrypto@gmail.com";
const appPassword = "mtnnchftufmuhmuh";

router.post("/register", async (req, res) => {
    const { fname, email, password, referred } = req.body;
    const referCodet = shortid.generate();
    const referCode = referCodet.substring(0, 8);
    const otp = Math.floor(1000 + Math.random() * 9000);


    if (!fname || !email || !password) {
        res.status(422).json({ error: "Please Fill All Required Feilds" })
    } else {

        const fetchUser = await user.findOne({ email: email });

        if (fetchUser) {
            if (fetchUser.verifyCode != 0) {
                const transporter = mailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: senderMail,
                        pass: appPassword
                    }
                });

                const mailOption = {
                    from: senderMail,
                    to: email,
                    subject: "Email Verification",
                    html: `<h3> ${fetchUser.verifyCode} is the OTP to verify your Email </h3>`
                }

                transporter.sendMail(mailOption, async (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        res.status(421).json({ error: "Verify Email" });
                    }
                })
            } else {
                res.status(422).json({ error: "User Already Registered" });
            }
        } else {
            const currentBalance = 10000;

            const add = new user({ name: fname, email, password, referCode, currentBalance, verifyCode: otp });

            const result = await add.save();

            if (result) {
                const transporter = mailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: senderMail,
                        pass: appPassword
                    }
                });

                const mailOption = {
                    from: senderMail,
                    to: email,
                    subject: "Email Verification",
                    html: `<h3> ${otp} is the OTP to verify your Email </h3>`
                }

                transporter.sendMail(mailOption, async (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        return res.status(200).json({ message: "Email Sent to your Email ID and User Registered" })
                    }
                })
            } else {
                res.status(422).json({ error: "Error Occurred in Adding User" });
            }
        }
    }
})

router.post("/verify", async (req, res) => {
    const { email, code, referred } = req.body;
    const codeOtp = Number(code);


    if (!email || !code) {
        res.status(422).json({ error: "Please Fill All Required Feilds" })
    } else {

        const fetchUser = await user.findOne({ email: email });

        if (fetchUser.verifyCode == codeOtp) {
            const fetchReferUser = await user.findOne({ referCode: referred });

            const newBalance = fetchReferUser.currentBalance + 1000;

            const firstUser = await user.findOneAndUpdate({ referCode: referred }, { $set: { "currentBalance": newBalance } }, { new: true });

            const refeeredPersonsList = fetchReferUser.referredBy;

            refeeredPersonsList.push(referred);

            const referredBy = refeeredPersonsList;

            const secUser = await user.findOneAndUpdate({ email: email }, { $set: { verifyCode: 0, "referredBy": referredBy } }, { new: true });

            return res.status(200).json({ message: "User verified!!! 🟢" })
        } else {
            res.status(422).json({ error: "Wrong OTP!!!" });
        }

    }
})

router.post("/resend", async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000);

    if (!email) {
        res.status(422).json({ error: "Please Fill All Required Feilds" })
    } else {

        const plans = await user.findOneAndUpdate({ email: email }, { $set: { verifyCode: otp } });

        if (plans) {
            const transporter = mailer.createTransport({
                service: "gmail",
                auth: {
                    user: senderMail,
                    pass: appPassword
                }
            });

            const mailOption = {
                from: senderMail,
                to: email,
                subject: "Email Verification",
                html: `<h3> ${otp} is the OTP to verify your Email </h3>`
            }

            transporter.sendMail(mailOption, async (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    return res.status(200).json({ message: "Email Sent to your Email ID Again" })
                }
            })
        } else {
            return res.status(422).json({ message: "Error sending email to your user again" })
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
