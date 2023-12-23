const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/url');
const config = require('./config');

const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect(config.databaseURL, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/auth', authRoutes);
app.use('/url', urlRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
