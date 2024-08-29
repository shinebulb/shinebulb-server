const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/AuthMiddleware.js');

router.post("/", async (req, res) => {

    const { username, password } = req.body;

    bcrypt.hash(password, 10).then(hash => {
        Users.create({
            username: username.toLowerCase(),
            password: hash
        });
        res.json("user created successfully");
    });
});

router.post("/login", async (req, res) => {

    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username: username } });

    if (!user) res.json({ error: "1" });
    
    bcrypt.compare(password, user.password).then(match => {
        if (!match) res.json({ error: "1" });

        const accessToken = sign({ username: user.username, id: user.id }, "5687ft8436t8bf743f8");
        res.json({ token: accessToken, username: username, id: user.id });
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
        { attributes: { exclude: ["id", "username", "password", "bulbCount", "bulbStatus", "language", "theme", "createdAt", "updatedAt"] } }
    );
    res.json(lastTheme);
});

router.get("/userinfo/:username", async (req, res) => {
    const userinfo = await Users.findOne({ where: { username: req.params.username } });
    res.json(userinfo);
});

module.exports = router