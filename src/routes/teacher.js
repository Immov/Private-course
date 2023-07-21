const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	res.render("teacher/home", {
		subject: "Student: Home",
		loggedIn: true,
		image: req.cookies.image,
		role: req.cookies.role,
	});
});

router.get("/dashboard", async (req, res) => {
	res.render("teacher/dashboard", {
		subject: "Student: Dashboard",
		loggedIn: true,
		image: req.cookies.image,
		role: req.cookies.role,
	});
});

module.exports = router;
