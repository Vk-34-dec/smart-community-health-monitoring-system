require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4000;

// connect to DB
connectDB();

// middleware
app.use(cors());
app.use(bodyParser.json());

// routes
app.get('/', (req, res) => res.json({ ok: true, message: 'SIH API running' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/vitals', require('./routes/vitals'));
app.use('/api/alerts', require('./routes/alerts'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
