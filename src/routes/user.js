const express = require("express");
const multer = require("multer");
const router = express.Router();
const cookieParser = require("cookie-parser");
const { sessionCheck } = require("../utils/sessionCheck");

const db = require("../sql/queries");

const generateRandomString = (length) => {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	return result;
};
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./src/public/images/profile_pictures");
	},
	filename: function (req, file, cb) {
		const currentDate = new Date();
		const prefix = req.cookies.user_id;
		const fileFormat = file.mimetype.split("/")[1];
		const filename = `${prefix}.${fileFormat}`;
		cb(null, filename);
	},
});
const upload = multer({ storage: storage });

router.use(cookieParser());

router.get("/signin", (req, res) => {
	const emailCookie = req.cookies.email;
	const passwordCookie = req.cookies.password;
	const loggedIn = req.cookies.authenticated;
	if (loggedIn) {
		res.redirect("/dashboard");
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
			// req.session.authenticated = true;
			// req.session.email = email;
			// req.session.password = password;
			res.cookie("user_id", result[0].user_id);
			res.cookie("authenticated", true);
			res.cookie("email", email);
			res.cookie("password", password);
			if (result[0].profile_picture === null) {
				res.cookie("image", "images/default.png");
			} else {
				res.cookie("image", result[0].profile_picture);
			}
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
		db.selectQuery(
			"user_account",
			"*",
			username_condition,
			function (result) {
				if (result.length > 0) {
					const warningMessage = "Username already exists!!!";
					reject(warningMessage);
				} else {
					resolve();
				}
			}
		);
	});

	Promise.all([emailPromise, usernamePromise])
		.then(() => {
			db.insertQuery("user_account", columns, [values]);
			res.redirect("/user/signin");
		})
		.catch((errorMessage) => {
			res.render("signup", {
				warningMessage: errorMessage,
				subject: "Error!",
			});
		});
});

router.get("/profile", sessionCheck, (req, res) => {
	res.render("user/profile", {
		subject: "Edit Profile",
		loggedIn: true,
		image: req.cookies.image,
	});
});

router.post(
	"/profile",
	sessionCheck,
	upload.single("profilePicture"),
	(req, res) => {
		const user_id = req.cookies.user_id;

		// Update Profile Picture
		const image = req.file;
		const { userRole } = req.body;
		if (image) {
			let filePath = image.path;
			filePath = filePath.replace("src\\public\\", "");
			filePath = filePath.replace(/\\/g, "/");
			filePath = "/" + filePath;
			console.log(filePath);
			const condition = `user_id = ${user_id}`;
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
			console.log("[IMG]-Skipped");
		}

		const columns = "(user_id)";
		const values = [parseInt(user_id)];
		const condition = `user_id = ${values[0]}`;
		// Check if role already exist
		if (userRole === "Student") {
			db.selectQuery(
				"student_account",
				"*",
				`user_id = ${user_id}`,
				function (result) {
					if (result.length > 0) {
						console.log("Student Already Exist");
					} else {
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
					if (result.length > 0) {
						console.log("Teacher Already Exist");
					} else {
						db.insertQuery("teacher_account", columns, [values]);
						db.deleteQUery("student_account", condition);
					}
				}
			);
		}

		res.redirect("/dashboard");
	}
);

router.get("/signout", sessionCheck, (req, res) => {
	const cookiesNames = Object.keys(req.cookies);
	cookiesNames.forEach((cookieName) => {
		res.clearCookie(cookieName);
	});
	res.redirect("/");
});

module.exports = router;
