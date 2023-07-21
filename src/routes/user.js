const express = require("express");
const multer = require("multer");
const router = express.Router();
const cookieParser = require("cookie-parser");
const { sessionCheck } = require("../utils/sessionCheck");
const db = require("../sql/queries");
const { parse } = require("dotenv");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./src/public/images/profile_pictures");
	},
	filename: function (req, file, cb) {
		const prefix = req.cookies.user_id;
		const fileFormat = file.mimetype.split("/")[1];
		const filename = `${prefix}.${fileFormat}`;
		cb(null, filename);
	},
});
const upload = multer({ storage: storage });

router.use(cookieParser());

// Sign-in, Sign-up, Sign-out

router.get("/signin", async (req, res) => {
	const loggedIn = req.cookies.authenticated;
	if (loggedIn) {
		res.redirect("/dashboard");
	} else {
		res.render("signIn", {
			subject: "Sign-in",
		});
	}
});

router.post("/signin", async (req, res) => {
	const { email, password } = req.body;
	const condition = `email = '${email}' AND password = '${password}'`;
	let image = "/images/default.png";
	let role = "Unassigned";
	db.selectQuery("user_account", "*", condition, function (result) {
		if (result.length > 0) {
			if (result[0].profile_picture !== null) {
				image = result[0].profile_picture;
			}
			if (result[0].role !== null) {
				role = result[0].role;
			}
			// Assign cookies for about, role, and level
			res.cookie("user_id", result[0].user_id);
			res.cookie("authenticated", true);
			res.cookie("email", email);
			res.cookie("password", password);
			res.cookie("image", image);
			res.cookie("role", role);
			res.redirect("/dashboard");
		} else {
			// Invalid credentials
			res.render("signin", {
				subject: "Error!",
				warningMessage: "Wrong credentials",
			});
		}
	});
});

router.get("/signup", async (req, res) => {
	res.render("signUp", {
		subject: "SignUp",
	});
});

router.post("/signup", async (req, res) => {
	const data = req.body;
	const columns = "(full_name, email, username, password, phone_number)";
	const values = [
		data.full_name,
		data.email,
		data.username,
		data.password,
		data.phone_number,
	];
	const condition = `email = '${data.email}' OR username = '${data.username}'`;
	db.selectQuery("user_account", "*", condition, function (result) {
		if (result.length > 0) {
			warningMessage = "Email or username already exists!!!";
			res.render("signup", {
				warningMessage,
				subject: "Error!",
			});
		} else {
			db.insertQuery("user_account", columns, [values]);
			res.redirect("/user/signin");
		}
	});
});

router.get("/signout", sessionCheck, async (req, res) => {
	const cookiesNames = Object.keys(req.cookies);
	cookiesNames.forEach((cookieName) => {
		res.clearCookie(cookieName);
	});
	res.redirect("/");
});

// Profile Edits

router.get("/profile", sessionCheck, async (req, res) => {
	res.render("user/profile", {
		subject: "Edit Profile",
		loggedIn: true,
		image: req.cookies.image,
		role: req.cookies.role,
	});
});

router.post(
	"/profile",
	sessionCheck,
	upload.single("profilePicture"),
	async (req, res) => {
		const image = req.file;
		if (image) {
			const condition = `user_id = ${req.cookies.user_id}`;
			let filePath = image.path;
			filePath = filePath.replace("src\\public\\", "");
			filePath = filePath.replace(/\\/g, "/");
			filePath = "/" + filePath;
			db.updateQuery(
				"user_account",
				`profile_picture = '${filePath}'`,
				condition,
				(result) => {
					console.log(`Update: ${result}`);
				}
			);
			res.cookie("image", filePath);
		} else {
			// WARNING user, have not set up the profile picture
			console.log("[IMG]-Skipped");
		}

		res.redirect("/dashboard");
	}
);

router.get("/role", sessionCheck, async (req, res) => {
	if (req.cookies.role !== "Unassigned") {
		console.log(req.cookies.role);
		res.redirect(`/${req.cookies.role}/dashboard`);
	} else {
		res.render("user/role", {
			subject: "Assign Role",
			loggedIn: true,
			image: req.cookies.image,
			role: req.cookies.role,
		});
	}
});

router.post("/role", sessionCheck, async (req, res) => {
	const { userRole } = req.body;
	const columns = "(user_id)";
	const user_id = req.cookies.user_id;
	const values = [parseInt(user_id)];
	const condition = `user_id = ${values[0]}`;
	if (userRole === "Student") {
		db.selectQuery(
			"student_account",
			"*",
			`user_id = ${user_id}`,
			function (result) {
				if (result.length === 0) {
					db.insertQuery("student_account", columns, [values]);
					db.deleteQUery("teacher_account", condition);
				}
			}
		);
	} else if (userRole === "Teacher") {
		db.selectQuery(
			"teacher_account",
			"*",
			`user_id = ${user_id}`,
			function (result) {
				if (result.length === 0) {
					db.insertQuery("teacher_account", columns, [values]);
					db.deleteQUery("student_account", condition);
				}
			}
		);
	}
	db.updateQuery("user_account", `role = '${userRole}'`, condition);
	res.cookie("role", userRole);
	res.redirect("/dashboard");
});

module.exports = router;
