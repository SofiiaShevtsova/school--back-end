const express = require("express");
const {
  registerUser,
  loginUser,
  refreshUser,
  logoutUser,
} = require("../../models/users/usersOperations");

const {
  registerUsresSchema,
  loginSchema,
  updateSubSchema,
  refreshTokenSchema,
} = require("../../models/users/userSchema");
const { valid } = require("joi");

// const authenticate = require("../../middlewares/authMiddlewar");
// const upload = require("../../middlewares/upload");

const router = express.Router();

router.post("/registerUser", async (req, res, next) => {
  try {
    const { error } = registerUsresSchema.validate(req.body);
      if (error) {
      res.status(400).json({ message: `${error}` });
    } else {
        const newUser = await registerUser(req);
      res.status(201).json({
        ...newUser
      });
    }
  } catch (error) {
      next(error);
    
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: `${error}` });
    } else {
      const user = await loginUser(req);
      res.json(user);
    }
  } catch (error) {
    next(error);
  }
});

// router.get("/current", authenticate, (req, res, next) => {
//   try {
//     const { subscription, email } = req.user;
//     res.json({ subscription, email });
//   } catch (error) {
//     next(error);
//   }
// });

// router.post("/refresh", async (req, res, next) => {
//   try {
//     const { error } = refreshTokenSchema.validate(req.body);
//     if (error) {
//       res.status(400).json({ message: `${error}` });
//     } else {
//       const user = await refreshUser(req);
//       res.json(user);
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// router.post("/logout", authenticate, async (req, res, next) => {
//   try {
//     const user = await logoutUser(req);
//     if (user==="Not found") {
//     res.status(404).json({ message: user });
//     } else {
//     res.status(204).json({ message: "Logout." });
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// router.patch("/", authenticate, async (req, res, next) => {
//   try {
//     const { error } = updateSubSchema.validate(req.body);
//     if (error) {
//       res.status(400).json({ message: "Missing field subscription." });
//     } else {
//       const updateUser = await updateSubUser(req, res);
//       res.json(updateUser);
//     }
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
