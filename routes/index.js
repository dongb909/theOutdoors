let express = require("express"),
	router = express.Router(),
	User = require("../models/user"),
	passport = require("passport")


router.get("/", (req, res)=>{
	res.render("landing")
});

/*========================
	AUTH ROUTES
==========================*/
router.get("/register", (req, res)=>{
	res.render("register")
});

router.post("/register", (req,res)=>{
	let newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user)=>{
		if (err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, ()=>{
			res.redirect("/locations")
		})
	})
})

/*========================
	LOGIN ROUTES
==========================*/
router.get("/login", (req, res)=>{
	res.render("login",  {message: req.flash("message")})
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/locations",
	failureRedirect: "/login"
}), (err,res)=>{});

/*========================
	LOGIN ROUTES
==========================*/
router.get("/logout", (req, res)=>{
	req.logout();
	res.redirect("/locations")
})

/*========================
	MIDDLEWARE
==========================*/
function isLoggedIn(req, res, next){ 
	if(req.isAuthenticated()){ 
		return next();
	}
	res.redirect("/login");
}

module.exports = router;
