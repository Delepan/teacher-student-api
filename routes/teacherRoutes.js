const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");

router.post("/register", teacherController.registerStudents);

router.get("/commonstudents", teacherController.getCommonStudents);

router.post("/suspend", teacherController.toSuspend);

router.post(
  "/retrivefornotifications",
  teacherController.retriveForNotifications
);

module.exports = router;
