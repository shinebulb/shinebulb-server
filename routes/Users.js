const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');
const { sign } = require('jsonwebtoken');
const transporter = require('../utils/email');
const { validateToken } = require('../middlewares/AuthMiddleware.js');

router.post("/", async (req, res) => {

    const { email, username, password } = req.body;

    const usernameFound = await Users.findOne({ where: { username: username } });
    const emailFound = await Users.findOne({ where: { email: email } });

    if (usernameFound || emailFound) {
        res.json({ error: "user or email already exists" });
        return;
    }

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

    /* const verifyLink = `http://localhost:5173/verify?token=${emailToken}`;

    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Please verify your email',
        html: `<p>Welcome! Click <a href="${verifyLink}">here</a> to verify your address.</p>`
    }); */
});

/* router.get('/verify', async (req, res) => {
    const { token } = req.query;
    const user = await Users.findOne({ where: { emailToken: token } });

    if (!user) {
        return res.status(400).json({ error: 'Invalid token' });
    }

    await user.update({ verified: true, emailToken: null });
}); */

router.post("/login", async (req, res) => {

    const { loginValue, password } = req.body;
    const emailFound = await Users.findOne({ where: { email: loginValue } });
    const usernameFound = await Users.findOne({ where: { username: loginValue } });

    if (!emailFound && !usernameFound) {
        res.json({ error: "1" });
        return;
    }

    const user = emailFound ? emailFound : usernameFound
    
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