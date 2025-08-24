const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');
const { sign } = require('jsonwebtoken');
const transporter = require('../utils/email');
const { validateToken } = require('../middlewares/AuthMiddleware.js');
const text = require('../assets/text.json');

require('dotenv').config();

router.get("/all", async (req, res) => {
    const userList = await Users.findAll({
        attributes: {
            exclude: ["password", "email", "emailToken", "language", "updatedAt"]
        },
        where: {
            verified: true
        }
    });
    res.json(userList);
})

router.post("/", async (req, res) => {

    const lang = parseInt(req.query.lang, 10) || 0;
    const { email, username, password } = req.body;

    const emailFound = await Users.findOne({ where: { email: email } });
    const usernameFound = await Users.findOne({ where: { username: username } });

    if (emailFound || usernameFound) {
        res.json({ error: `${1 + Number(!emailFound)}` });
        return;
    }
    else {
        const emailToken = randomUUID();

        bcrypt.hash(password, 10)
        .then(hash => {
            Users.create({
                email: email,
                username: username.toLowerCase(),
                password: hash,
                emailToken: emailToken
            });
            res.json("user created successfully");
        });

        const verifyLink = `${process.env.FRONTEND_URL}/verify?token=${emailToken}`;

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: text[lang].verificationEmail[0],
            html: `
                <body style="margin: 0; padding: 0; background-color: rgb(244, 240, 232); font-family: 'Roboto Slab', Georgia, 'Times New Roman', serif; color: rgb(35, 35, 35);">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: rgb(244, 240, 232);">
                        <tr>
                            <td align="center">
                                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: rgb(249, 249, 249); padding: 40px; border: rgb(43, 43, 43) 3px solid; border-radius: 15px;">
                                    <tr>
                                        <td align="center">
                                            <h1 style="font-size: 24px; margin-bottom: 20px; text-transform: lowercase;">${text[lang].verificationEmail[1]}</h1>
                                            <p style="font-size: 16px; margin-bottom: 30px; text-transform: lowercase;">
                                                ${text[lang].verificationEmail[2]}
                                            </p>
                                            <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background-color: rgb(234, 234, 234); color: rgb(43, 43, 43); text-decoration: none; font-size: 16px; border: rgb(43, 43, 43) 3px solid; border-radius: 15px; text-transform: lowercase;">
                                                ${text[lang].verificationEmail[3]}
                                            </a>
                                            <p style="font-size: 14px; margin-top: 30px; text-transform: lowercase;">
                                                ${text[lang].verificationEmail[4]}
                                            </p>
                                            <p style="font-size: 14px; word-break: break-all; color: rgb(90, 90, 90); text-transform: lowercase;">
                                                ${verifyLink}
                                            </p>
                                            <hr style="margin: 40px 0; border: none; border-top: 1px solid rgb(43, 43, 43);">
                                            <p style="font-size: 14px; text-transform: lowercase;">
                                                ${text[lang].verificationEmail[5]}
                                            </p>
                                            <p style="font-size: 14px; margin-top: 10px; text-transform: lowercase;">${text[lang].verificationEmail[6]}</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
            `
        });
    }
});

router.get("/verify", async (req, res) => {

    const { token } = req.query;
    const user = await Users.findOne({ where: { emailToken: token } });

    if (!user) {
        return res.json({ status: "2" });
    }

    await user.update({ verified: true, emailToken: null });

    res.json({ status: "3" });
});

router.post("/login", async (req, res) => {

    const { loginValue, password } = req.body;
    const emailFound = await Users.findOne({ where: { email: loginValue } });
    const usernameFound = await Users.findOne({ where: { username: loginValue } });

    if (!emailFound && !usernameFound) {
        res.json({ error: "1" });
        return;
    }

    const user = emailFound ? emailFound : usernameFound

    if (user.verified == 0) {
        res.json({ error: "3" });
        return;
    }

    bcrypt.compare(password, user.password).then(match => {
        if (!match) {
            res.json({ error: "2" });
            return;
        }

        const accessToken = sign({ username: user.username, id: user.id }, process.env.ACCESS_TOKEN);
        res.json({ token: accessToken, username: user.username, id: user.id });
    });
});

router.put("/count", validateToken, async (req, res) => {
    const { count, id } = req.body;
    await Users.update({ bulbCount: count }, { where: { id: id } });
    res.json(count);
});

router.put("/bulb", validateToken, async (req, res) => {
    const { status, id } = req.body;
    await Users.update({ bulbStatus: status }, { where: { id: id } });
    res.json(status);
});

router.put("/theme", validateToken, async (req, res) => {
    const { theme, id } = req.body;
    await Users.update({ theme: theme }, { where: { id: id } });
    res.json(theme);
});

router.put("/language", validateToken, async (req, res) => {
    const { language, id } = req.body;
    await Users.update({ language: language }, { where: { id: id } });
    res.json(language);
});

router.put("/lastTheme", validateToken, async (req, res) => {
    const { lastBg, lastFont, id } = req.body;
    await Users.update({ lastBg: lastBg, lastFont: lastFont }, { where: { id: id } });
    res.json({ lastBg: lastBg, lastFont: lastFont });
});

router.get("/auth", validateToken, (req, res) => res.json(req.user));

router.get("/settings/:id", validateToken, async (req, res) => {
    const settings = await Users.findByPk(
        req.params.id,
        { attributes: { exclude: ["username", "password", "lastBg", "lastFont", "createdAt", "updatedAt"] } }
    );
    res.json(settings);
});

router.get("/changeTheme", validateToken, async (req, res) => {
    const lastTheme = await Users.findByPk(
        req.user.id,
        { attributes: { exclude: ["id", "username", "password", "bulbCount", "language", "theme", "createdAt", "updatedAt"] } }
    );
    res.json(lastTheme);
});

router.put("/invertTheme", validateToken, async (req, res) => {
    const { invertTheme, id } = req.body;
    await Users.update({ invertTheme: invertTheme }, { where: { id: id } });
    res.json(invertTheme);
});

router.put("/changeFont", validateToken, async (req, res) => {
    const { font, id } = req.body;
    await Users.update({ font: font }, { where: { id: id } });
    res.json(font);
});

router.get("/userinfo/:username", async (req, res) => {
    const userinfo = await Users.findOne({ where: { username: req.params.username } });
    res.json(userinfo);
});

router.put("/changepassword", validateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await Users.findOne({ where: { username: req.user.username } });

    bcrypt.compare(oldPassword, user.password).then(match => {
        if (!match) {
            res.json({ error: "2" });
            return;
        }

        bcrypt.hash(newPassword, 10).then(hash => {
            Users.update({ password: hash }, { where: { username: req.user.username } })
            res.json("password updated successfully");
        });
    });
})

module.exports = router