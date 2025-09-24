const express = require('express');
const router = express.Router();
const User = require('../schema/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {v4:uuidv4} = require('uuid')
const authMiddleware = require('../middleware/auth')

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { firstName, lastName, phone, email, password, age, gender} = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      age,
      gender,
      userId: uuidv4(),
    });

    await user.save();
        const token = jwt.sign(
      { id: user._id }, // payload
      process.env.JWT_SECRET, // secret from .env
      { expiresIn: '1d' } // 1 day expiry
    );

    // ✅ Send token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true, // prevents JS access
      secure: process.env.NODE_ENV === 'production', // only https in prod
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    res.status(201).json({ message: "User created successfully" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Set cookie first
    res.cookie('token', token, {
      httpOnly: true, // prevents JS access to cookie
      // secure: process.env.NODE_ENV === 'production', // only HTTPS in production
      secure: false,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
    });

    // Then send JSON response
    return res.json({ message: "Login successful", token, user: { firstName: user.firstName } });

  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.get('/UserPage', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('firstName lastName phone email age gender userId');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      age: user.age,
      gender: user.gender,
      userId: user.userId,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;


// const express = require('express');
// const router = express.Router();
// const User = require('../schema/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const {v4:uuidv4} = require('uuid')
// const authMiddleware = require('../middleware/auth')

// // POST /api/auth/signup
// router.post('/signup', async (req, res) => {
//   const { firstName, lastName, phone, email, password, age, gender} = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ error: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     user = new User({
//       firstName,
//       lastName,
//       phone,
//       email,
//       password: hashedPassword,
//       age,
//       gender,
//       userId: uuidv4(),
//     });

//     await user.save();
//         const token = jwt.sign(
//       { id: user._id }, // payload
//       process.env.JWT_SECRET, // secret from .env
//       { expiresIn: '1d' } // 1 day expiry
//     );

//     // ✅ Send token in HTTP-only cookie
//     res.cookie('token', token, {
//       httpOnly: true, // prevents JS access
//       secure: process.env.NODE_ENV === 'production', // only https in prod
//       sameSite: 'strict',
//       maxAge: 24 * 60 * 60 * 1000 // 1 day
//     });
//     res.status(201).json({ message: "User created successfully", user: { userId: user.userId, firstName, lastName, phone, email, age, gender } });

//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // POST /api/auth/login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

//     // Set cookie first
//     res.cookie('token', token, {
//       httpOnly: true, // prevents JS access to cookie
//       // secure: process.env.NODE_ENV === 'production', // only HTTPS in production
//       secure: false,
//       sameSite: 'strict',
//       maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
//     });

//     // Then send JSON response
//     res.json({ message: "Login successful", user: { userId: user.userId, firstName: user.firstName, lastName: user.lastName, phone: user.phone, email: user.email, age: user.age, gender: user.gender } });
    
//   } catch (err) {
//     return res.status(500).json({ error: "Server error" });
//   }
// });

// router.get('/UserPage', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user).select('firstName lastName phone email age gender userId');
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     res.json({
//       firstName: user.firstName,
//       lastName: user.lastName,
//       phone: user.phone,
//       email: user.email,
//       age: user.age,
//       gender: user.gender,
//       userId: user.userId,
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// module.exports = router;
