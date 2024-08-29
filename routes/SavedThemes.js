const express = require('express');
const router = express.Router();
const { SavedThemes } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware.js');

router.get("/", async (req, res) => {
    const savedThemeList = await SavedThemes.findAll();
    res.json(savedThemeList);
});

router.get("/byUser/:id", async (req, res) => {
    const savedThemeList = await SavedThemes.findAll(
        { where: { userId: req.params.id } }
    );
    res.json(savedThemeList);
})

router.post("/", validateToken, async (req, res) => {
    const savedTheme = req.body;
    const userId = req.user.id;
    savedTheme.userId = userId;

    const found = await SavedThemes.findOne({
        where: { bg: savedTheme.bg, font: savedTheme.font, userId: userId }
    });
    if (!found) {
        await SavedThemes.create(savedTheme);
        res.json({ status: "1" });
    }
    else {
        res.json({ status: "0" });
    }
});

router.put("/title", validateToken, async (req, res) => {
    const { title, id } = req.body;
    await SavedThemes.update({ title: title }, { where: { id: id } });
    res.json(title);
});

router.delete("/:themeId", validateToken, async (req, res) => {
    const themeId = req.params.themeId;
    await SavedThemes.destroy({ where: { id: themeId } });
    res.json(themeId);
});

module.exports = router