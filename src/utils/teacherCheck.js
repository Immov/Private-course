function teacherCheck(req, res, next) {
	if (req.cookies.role === "Teacher") {
		console.log("[COOKIES]", req.cookies);
		// console.log("[SESSION]", req.session);
		next();
	} else {
		res.redirect("/user/signin");
	}
}

module.exports = {
	teacherCheck,
};
