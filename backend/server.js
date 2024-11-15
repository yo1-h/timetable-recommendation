// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const recommendationRoutes = require('./routes/recommendation');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/recommend', recommendationRoutes);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
