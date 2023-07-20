const express = require("express");
const session = require("express-session");
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const cookieParser = require("cookie-parser");
const { sessionCheck } = require("./utils/sessionCheck");
require("dotenv").config();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
const store = new session.MemoryStore();
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Express app listening at http://localhost:${port}`);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.set("trust proxy", 1);

app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, "/public", "favicon.ico")));
app.use(cookieParser());
app.use(
	session({
		secret: "keyboard cat",
		cookie: {
			maxAge: 30000,
		},
		saveUninitialized: true,
		resave: false,
		store: store,
	})
);

app.use((req, res, next) => {
	// console.log("[COOKIES]", req.cookies);
	console.log(`[${req.method}] - [${req.url}]`);
	next();
});

const userRouter = require("./routes/user");
const studentRouter = require("./routes/student");
const teacherRouter = require("./routes/teacher");
const apiRouter = require("./routes/api");

app.use("/user", userRouter);
app.use("/student", studentRouter);
app.use("/teacher", teacherRouter);
app.use("/api", apiRouter);

app.get("/", (req, res) => {
	if (req.cookies.authenticated) {
		res.render("home", {
			subject: "Private Course",
			loggedIn: true,
			image: req.cookies.image,
		});
	} else {
		res.render("home", {
			subject: "Private Course",
		});
	}
});

app.get("/dashboard", sessionCheck, (req, res) => {
	res.render("dashboard", {
		subject: "Dashboard",
		loggedIn: true,
		image: req.cookies.image,
	});
});

app.get("*", (req, res) => {
	res.send("Invalid URL.");
});
