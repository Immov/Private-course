function studentCheck(req, res, next) {
	if (req.cookies.role === "Student") {
		console.log("[COOKIES]", req.cookies);
		// console.log("[SESSION]", req.session);
		next();
	} else {
		res.redirect("/user/signin");
	}
}

module.exports = {
	studentCheck,
};
