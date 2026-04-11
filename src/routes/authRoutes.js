import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@gmail.com" && password === "1234") {
    return res.json({
      token: jwt.sign({ role: "admin" }, "secret"),
      role: "admin",
    });
  }

  return res.json({
    token: jwt.sign({ role: "user" }, "secret"),
    role: "user",
  });
});

export default router;