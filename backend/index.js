const express = require('express');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:/jobportal');
const app = express();

app.post('/', (req, res) => {
    console.log("portrunning");
});

app.listen(4000);