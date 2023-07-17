const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.json());

router.get("/", (req, res) => {
	res.render("teacher/home", {
		subject: "Teacher: Home",
	});
});

router.post("/signup", (req, res) => {
	const data = req.body;
	console.log(data);
	res.render("teacher/home", {
		subject: `Welcome: ${data.name}`,
		t_name: `${data.name}`,
	});
});

router.get("/signup", (req, res) => {
	res.render("teacher/signUp", {
		subject: "Teacher: Sign Up",
	});
});

module.exports = router;
