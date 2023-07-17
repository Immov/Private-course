const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

const db = require("../sql/queries");

router.use(cookieParser());

router.get("/signin", (req, res) => {
	const emailCookie = req.cookies.email;
	const passwordCookie = req.cookies.password;
	const loggedIn = req.cookies.authenticated;
	if (loggedIn) {
		res.render("dashboard", { subject: "Dashboard", loggedIn });
	} else {
		res.render("signIn", {
			subject: "Sign-in",
		});
	}
});

router.post("/signin", (req, res) => {
	const { email, password } = req.body;
	const condition = `email = '${email}' AND password = '${password}'`;
	db.selectQuery("user_account", "*", condition, function (result) {
		if (result.length > 0) {
			// Successful sign-in
			req.session.authenticated = true;
			req.session.email = email;
			req.session.password = password;
			res.cookie("authenticated", true);
			res.cookie("email", email);
			res.cookie("password", password);
			res.render("/dashboard", { subject: "Dashboard", loggedIn: true });
		} else {
			// Invalid credentials
			res.render("signin", {
				subject: "Error!",
				warningMessage: "Wrong credentials",
			});
		}
	});
});

router.get("/signup", (req, res) => {
	res.render("signUp", {
		subject: "SignUp",
	});
});

router.post("/signup", (req, res) => {
	const data = req.body;
	const columns = "(full_name, email, username, password, phone_number)";
	const values = [
		data.full_name,
		data.email,
		data.username,
		data.password,
		data.phone_number,
	];
	const email_condition = `email = '${data.email}'`;
	const username_condition = `username = '${data.username}'`;

	const emailPromise = new Promise((resolve, reject) => {
		db.selectQuery("user_account", "*", email_condition, function (result) {
			if (result.length > 0) {
				const warningMessage = "Email already exists!!!";
				reject(warningMessage);
			} else {
				resolve();
			}
		});
	});

	const usernamePromise = new Promise((resolve, reject) => {
		db.selectQuery("user_account", "*", username_condition, function (result) {
			if (result.length > 0) {
				const warningMessage = "Username already exists!!!";
				reject(warningMessage);
			} else {
				resolve();
			}
		});
	});

	Promise.all([emailPromise, usernamePromise])
		.then(() => {
			db.insertQuery("user_account", columns, [values]);
			res.redirect("/user/signin");
		})
		.catch((errorMessage) => {
			res.render("signup", { warningMessage: errorMessage, subject: "Error!" });
		});
});

router.get("/profile", (req, res) => {
	res.render("profile", { subject: "Edit Profile" });
});

router.post("/profile", (req, res) => {
	const data = req.body;
	console.log(data.userRole);
	res.redirect("/dashboard");
});
module.exports = router;
