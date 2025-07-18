const express = require('express');
const router = express.Router();
const { SavedFonts } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware.js');

router.get("/", async (req, res) => {
    const savedFontsList = await SavedFonts.findAll();
    res.json(savedFontsList);
});

router.get("/byUser/:id", async (req, res) => {
    const savedFontsList = await SavedFonts.findAll(
        { where: { userId: req.params.id } }
    );
    res.json(savedFontsList);
})

router.post("/", validateToken, async (req, res) => {
    const savedFont = req.body;
    const userId = req.user.id;
    savedFont.userId = userId;

    const found = await SavedFonts.findOne({
        where: { fontFamily: savedFont.fontFamily, userId: userId }
    });
    if (!found) {
        await SavedFonts.create(savedFont);
        res.json({ status: "1" });
    }
    else {
        res.json({ status: "0" });
    }
});

router.delete("/:fontId", validateToken, async (req, res) => {
    const fontId = req.params.fontId;
    await SavedFonts.destroy({ where: { id: fontId } });
    res.json(fontId);
});

module.exports = router