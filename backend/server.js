const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Connect DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// prachinainwnai31
// HPSP8fEhgH03Xu5O
// 6qMLF0x9gpws4JHp
// mongodb+srv://<db_username>:<db_password>@cluster0.ozxxum9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// mongodb+srv://<db_username>:<db_password>@cluster0.ozxxum9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0