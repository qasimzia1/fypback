const express = require("express");
const router = express.Router();
const { signup, signin, editUser } = require("../controllers/auth");
const {
  getDisease,
  getSymptoms,
  getHistory,
} = require("../controllers/prediction");
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/getDisease", getDisease);
router.get("/getSymptoms", getSymptoms);
router.post("/getHistory", getHistory);
router.post("/editUser", editUser);
module.exports = router;
