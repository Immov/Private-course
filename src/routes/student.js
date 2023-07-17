const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
	res.render('student/home', {
		subject: 'Sign up: Student'
	})
})

module.exports = router;
