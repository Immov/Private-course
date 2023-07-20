function sessionCheck(req, res, next) {
	if (req.cookies.authenticated) {
		// console.log("[COOKIES]", req.cookies);
		// console.log("[SESSION]", req.session);
		next();
	} else {
		res.redirect("/user/signin");
	}
}

module.exports = {
	sessionCheck,
};
