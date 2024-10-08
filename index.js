const express = require('express');
const app = express();

const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors());

const db = require('./models');

const savedThemesRouter = require('./routes/SavedThemes');
app.use("/savedthemes", savedThemesRouter);
const usersRouter = require('./routes/Users');
app.use("/users", usersRouter);

db.sequelize.sync().then(() => app.listen(process.env.PORT || 3001));