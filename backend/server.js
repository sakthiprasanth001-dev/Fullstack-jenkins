const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔹 MongoDB Connection (Replace with your Atlas URL)
mongoose.connect("mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/mydb")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// 🔹 Sample Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});

const User = mongoose.model("User", UserSchema);

// 🔹 Routes

// Root route (fix for "Cannot GET /")
app.get('/', (req, res) => {
  res.send("Backend is running 🚀");
});

// Create User
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 🔹 Server Start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});