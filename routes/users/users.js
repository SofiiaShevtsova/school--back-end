const express = require("express");
const {
  registerUser,
  loginUser,
  refreshUser,
  logoutUser,
  updatePassword
} = require("../../models/users/usersOperations");

const {
  registerUsresSchema,
  loginSchema,
  updatePasswordSchema,
  refreshTokenSchema,
} = require("../../models/users/userSchema");
const { valid } = require("joi");

const authenticate = require("../../middlewares/authMiddlewar");

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

router.get("/current", authenticate, (req, res, next) => {
  try {
    console.log(req.user);
    const { userInformation, subscription } = req.user;
    res.json({ userInformation, subscription });
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const { error } = refreshTokenSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: `${error}` });
    } else {
      const user = await refreshUser(req);
      res.json(user);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/logout", authenticate, async (req, res, next) => {
  try {
    const responce = await logoutUser(req);
    if (responce==="Not found") {
    res.status(404).json({ message: responce });
    } else {
    res.status(204).json({ message: "Logout" });
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/password", authenticate, async (req, res, next) => {
  try {
    const { error } = updatePasswordSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: "Bad password." });
    } else {
      const responce = await updatePassword(req, res);
      res.json(responce);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
