const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const auth = require('./middlewares/auth');

const authRoutes = require('./api/routes/authRoutes');
const userRoutes = require('./api/routes/userRoutes');
const speakerRoutes = require('./api/routes/speakerRoutes');
const talkRoutes = require('./api/routes/talkRoutes');
const attendeeRoutes = require('./api/routes/attendeeRoutes');
const publicRoutes = require('./api/routes/publicRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Tramuntana Talks API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/users', auth, userRoutes);
app.use('/api/speakers', auth, speakerRoutes);
app.use('/api/talks', auth, talkRoutes);
app.use('/api/attendees', auth, attendeeRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
